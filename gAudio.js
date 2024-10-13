var gAudio = {
	sounds: [],
	load: function(filename, isMusic) {
		var sound = {volume: 1, filename: filename, isMusic}
		var context = this.context
		if(context) {
			var ajax = new XMLHttpRequest()
			ajax.open("GET", ""+filename+"?"+gAppVersion, true)
			ajax.responseType = "arraybuffer"
			
			ajax.onload = function() {
				context.decodeAudioData(
					ajax.response,
					function(buffer) {
						sound.audioBuffer = buffer
					},
					console.error
				)
			}
			
			ajax.onerror = console.error
			
			ajax.send()
			
			this.sounds.push(sound)
		} else {
			console.error("No AudioContext found")
		}
		return sound
	},
	// pan is optional. A number from 0 to 1. 0=left speaker only. 1=right speak only.
	play: function(sound, pan) {
		if(!sound || !sound.audioBuffer) {
			return false
		}
		
		var volume = this.getGlobalVolume(sound.isMusic)
		if(!volume) {
			return false
		}
		
		var source = this.context.createBufferSource()
		if(!source) {
			return false
		}

		source.buffer = sound.audioBuffer
		if(!source.start) {
			source.start = source.noteOn
			if(!source.start) {
				return false
			}
		}

		volume *= sound.volume

		if(pan !== undefined) {
			if(pan.gridx >= 0) { //can pass tile or drag for pan
				pan = pan.gridx/(gmapsizex-1)
			}
			
			var gainNode = this.context.createGain()
			var gainNode2 = this.context.createGain()
			
			var splitter = this.context.createChannelSplitter(2)
			
			// Make sure 1 of the speakers is always 100%. Scale the other one up proportionally.
			//  Or else all panned audio would be half as loud as non-panned.
			if(pan < .5) {
				var panLeft = 1
				var panRight = pan / (1 - pan)
			} else {
				var panLeft = (1 - pan) / pan
				var panRight = 1
			}
			
			gainNode.gain.value = volume * panLeft
			gainNode2.gain.value = volume * panRight
			
			source.connect(splitter, 0, 0)
			var merger = this.context.createChannelMerger(2)
			
			splitter.connect(gainNode, 0)
			splitter.connect(gainNode2, 0)
			
			gainNode.connect(merger, 0, 0)
			gainNode2.connect(merger, 0, 1)
			merger.connect(this.context.destination)
			
			sound.gainNode2 = gainNode2
		} else {
			var gainNode = this.context.createGain()
			gainNode.gain.value = volume
			source.connect(gainNode)
			gainNode.connect(this.context.destination)
		}

		source.start(0)

		sound.gainNode = gainNode
		
		sound.playedTime = Date.now()
		return true
	},
	// In case you want to change the pan while it's playing. Only works if you passed a pan on play()
	changePan: function(sound, pan) {
		if(!sound || !sound.gainNode2) {
			return false
		}
		
		// Make sure 1 of the speakers is always 100%. Scale the other one up proportionally.
		// Or else panned audio in the middle would be 50% on each speaker, thus half as loud as non-panned, which is 100% on each speaker.
		if(pan < .5) {
			var panLeft = 1
			var panRight = pan / (1 - pan)
		} else {
			var panLeft = (1 - pan) / pan
			var panRight = 1
		}
		
		var volume = sound.volume * this.getGlobalVolume(sound.isMusic)
		
		sound.gainNode.gain.value = volume * panLeft
		sound.gainNode2.gain.value = volume * panRight
	},
	stop: function(sound) {
		if(!sound) {
			return false
		}

		if(this.musicPaused == sound) {
			this.musicPaused = null
		}
		
		sound.playedTime = 0
		if(sound.gainNode)
			sound.gainNode.gain.value = 0
		if(sound.gainNode2)
			sound.gainNode2.gain.value = 0
	},
	stopAll: function(sound) {
		for(var i=-1,sound; sound=this.sounds[++i];) {
			this.stop(sound)
		}
	},
	setVolume: function(sound, volume) {
		if(!sound) {
			return false
		}
		
		sound.volume = volume

		if(sound.gainNode)
			sound.gainNode.gain.value = volume
		if(sound.gainNode2)
			sound.gainNode2.gain.value = volume
	},
	getGlobalVolume: function(isMusic) {
		return gMuted?0:1//gStorageGetNum(isMusic?'musicvolume':'soundvolume')
	},
	isPlaying: function(sound) {
		if(!sound) {
			return false
		}
		return sound.playedTime && sound.audioBuffer && Date.now() < sound.playedTime + sound.audioBuffer.duration * 1000
	},
	// Most browsers don't allow a sound to be played unless it has already been played inside a user action event.
	unlock: function() {
		if(this.context) {
			console.log("unlock()", this.context.state, this.sounds.length)
			if(this.context.state == 'suspended') {
				this.context.resume()
			}
			if(!this.unlocked && this.sounds.length) {
				var loading
				for(var i in this.sounds) {
					var sound = this.sounds[i]
					if(!sound.audioBuffer) {
						loading = 1
						console.log("still loading:", sound.filename)
						break
					}
				}
				if(!loading) {
					this.unlocked = true
					for(var i in this.sounds) {
						var sound = this.sounds[i]
						if(!this.isPlaying(sound)) {
							this.play(sound)
							this.stop(sound)
							
							console.log("Unlocking sound:", sound.filename)
						}
					}
					if(gPlayMusic)gAudio.play(gPlayMusic)
				}
			}
		}
	},
	// Sometimes on phones, after minimizing for a long time, the context doesn't work and won't resume. So make a new one.
	makeContext: function() {
		if(window.AudioContext) {
			gAudio.context = new AudioContext()
		}
	}
}

document.addEventListener("touchend", gAudio.unlock.bind(gAudio))
document.addEventListener("mouseup", gAudio.unlock.bind(gAudio))

window.AudioContext = window.AudioContext || window.webkitAudioContext
gAudio.makeContext()

document.addEventListener('visibilitychange', function() {
	console.log("visibilitychange()", document.hidden, gAudio.sounds.length)
	if(document.hidden) {
		var musicPaused
		for(var i=-1,sound; sound=gAudio.sounds[++i];) {
			if(sound.isMusic && gAudio.isPlaying(sound)) {
				musicPaused = sound
			}
		}
		gAudio.stopAll()
		gAudio.musicPaused = musicPaused
	} else {
		gAudio.makeContext()
		if(gAudio.musicPaused) {
			gAudio.play(gAudio.musicPaused)
			gAudio.musicPaused = null
		}
	}
}, false)
