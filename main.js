var gGameX,gGameY,
	gAppVersion=39,
	gGameSizeX=192,gGameSizeY=312,
	gGameScale=1,
	gScreenSizeX,gScreenSizeY,
	gCanvasSizeX,gCanvasSizeY,
	gCanvas,
	gCursor,
	gYouStartTime,gYouEndTime,
	gLevel=1,
	gGuys,gYou,
	gGravity=.2,
	gHits,
	gStarsGot,
	gState,
	gMuted,
	gloops=0,
	gLog=console.log.bind(console),
	gGrid=[],
	gGridSizeX=8,
	gGridSizeY=13,
	gTileSizeX=24,gTileSizeY=24,
	gStateLoop,gStateLoops=0,
	u

function gStateSet(state) {
	gLog("gStateSet() from "+gState+" to "+state)
	gState = state
	gStateLoop = gloops
	gStateLoops = 0
}

function gGridRect(value, x,y,sizeX,sizeY) {
	for(var gridY=y; gridY<y+sizeY; gridY++) {
		for(var gridX=x; gridX<x+sizeX; gridX++) {
			gGrid[gridX][gridY] = value
		}
	}
}

function gReset() {
	for(var x=0;x<gGridSizeX;x++) {
		gGrid[x] = []
	}
	gGridRect(1, 0,0,gGridSizeX,gGridSizeY)
	
	gGuys = []
	if(gLevel == 1) {
		gGridRect(0, 2,1, 4,gGridSizeY-2)
		
		gGuyMake('guy',88,66)
		gGuyMake('guy',88,110)
	}
	if(gLevel == 2) {
		gGridRect(0, 1,5,gGridSizeX-2,gGridSizeY-6)
		gGridRect(0, 1,2,1,3)
		
		gGuyMake('guy',28,40)
		gGuyMake('guy',28,66)
		gGuyMake('guy',88,210)
	}
	if(gLevel == 3) {
		gGuyMake('bomb',144,40)
		gGuyMake('bomb',121,40)
		gGuyMake('guy',126,62)
		gGuyMake('bomb',98,40)
		gGuyMake('bomb',144,60)
		gGuyMake('bomb',98,60)
		gGuyMake('bomb',98,80)
		gGuyMake('bomb',121,80)
		gGuyMake('bomb',144,80)
		gGuyMake('bomb',144,110)
		gGuyMake('bomb',144,139)
		gGuyMake('bomb',144,168)
		gGridRect(0, 1,1,gGridSizeX-2,gGridSizeY-2)
		gGridRect(1, 1,5,5,2)
		gGridRect(1, 1,1,3,4)
		gGridRect(1, gGridSizeX-3,8,2,2)
		
		//gGuyMake('star',70,200)
		gGuyMake('guy',111,250)
		//gGuyMake('crate',144,166)
		//gGuyMake('crate',144,186)
		//gGuyMake('crate',144,206)
		//gGuyMake('crate',144,226)
	}
	if(gLevel == 4) {
		gGridRect(0, 1,1,gGridSizeX-2,gGridSizeY-3)
		for(var x=1;x<7;x++) {
			gGuyMake('bomb',x*24,46)
			gGuyMake('crate',x*24,66)
			gGuyMake('crate',x*24,86)
			gGuyMake('crate',x*24,106)
			gGuyMake('crate',x*24,126)
		}
		gGuyMake('guy',111,150)
		gGuyMake('guy',30,25)
	}
	if(gLevel >= 5) {
		gGridRect(0, 1,2,gGridSizeX-2,gGridSizeY-3)

		for(var i=0;i<77;i++) {
			var x = (Math.random()*(gGridSizeX-3)+1)*gTileSizeX
			var y = gTileSizeY*2+i/77*(gGridSizeY-4)*gTileSizeY
			if(i==22||i==33)
				gGuyMake('bomb',100,y)
			else
				gGuyMake('guy',x,y)
		}
	}
	
	gYou = gGuyMake('ball',-99999,22,5,5)
	gYouStartTime = gYouEndTime = 0
	gHits = 0
	gStarsGot = 0
	gStateSet('input')
}

function gGuyMake(kind,x,y,sizeX,sizeY) {
	if(kind=='bomb'||kind=='crate'){
		sizeX=25
		sizeY=24
	}
	if(kind=='star'){
		sizeX=15
		sizeY=13
	}
	if(kind=='guy'){
		sizeX=14
		sizeY=20
	}
	var guy = {kind,x,y,oldX:0,oldY:0,oldX2:0,oldY2:0,sizeX,sizeY,speedX:0,speedY:0,hp:9999}
	if(kind=='guy')guy.hp=1
	if(kind=='bomb')guy.hp=1
	if(kind=='star')guy.hp=0
	if(kind=='crate')guy.hp=1
	gGuys.push(guy)
	return guy
}

function gGuyHit(guy) {
	for(var guy2 of gGuys) {
		if(guy2 != guy && !guy2.dead) {
			if(gRectsHit(guy.x, guy.y, guy.sizeX, guy.sizeX, guy2)) {
				if(guy2.kind == 'guy') {
					guy2.dead = 1
					gAudio.play(gGuyDieSound, guy2.x/gGameSizeX)
				} else {
					if(guy2.kind == 'star') {
						guy2.dead = 1
						gStarsGot++
						gAudio.play(gStarSound)
					} else {
						gHits++
						guy2.hp--
						if(guy2.hp < 1) {
							guy2.hp = 0
							guy2.dead = 1
							if(guy2.kind == 'bomb') {
								gAudio.play(gExplodeSound, guy2.x/gGameSizeX)
							}
						}
						return guy2
					}
				}
			}
		}
	}
	if(gBoxHitGrid(guy)) {
		gHits++
		return 1
	}
}

function gBoxHitGrid(guy) {
	var x1 = guy.x/gTileSizeX |0
	var y1 = guy.y/gTileSizeY |0
	var x2 = (guy.x+guy.sizeX)/gTileSizeX |0
	var y2 = (guy.y+guy.sizeY)/gTileSizeY |0
	for(var y=y1; y<=y2; y++) {
		for(var x=x1; x<=x2; x++) {
			var tile = gGridGet(x,y)
			if(tile)return tile
		}
	}
}

function gBombGo(guy) {
	for(var guy2 of gGuys) {
		if(guy2 != guy && guy2 != gYou && !guy2.dead && guy2.hp < 3) {
			var mult = .6
			if(gRectsHit(guy.x-guy.sizeX*mult, guy.y-guy.sizeY*mult, guy.sizeX+guy.sizeX*mult*2, guy.sizeY+guy.sizeY*mult*2, guy2)) {
				guy2.hp = 0
				guy2.dead = 1
			}
		}
	}
}

function gUpdate() {
	gStateLoops++
	gCursorSet('auto')
	
	var stall
	for(var guy of gGuys) {
		if(guy.dead) {
			if(guy.kind == 'bomb') {
				guy.dead++
				if(guy.dead == 8) {
					gBombGo(guy)
				}
				if(guy.dead < 11) {
					stall = 1
				}
				if(guy.dead >= 20) {
					gArrayRemove(gGuys, guy)
				}
			} else if(guy.kind == 'star') {
				gArrayRemove(gGuys, guy)
			}
		}
	}

	if(!stall) {
		gloops++
		for(var guy of gGuys) {
			if(guy.dead) {
				if(guy.kind == 'guy') {
					guy.dead++
				}
				if(guy.kind == 'crate') {
					guy.dead++
					if(guy.dead>11) {
						gArrayRemove(gGuys, guy)
					}
				}
				continue
			}
			if(guy.kind == 'ball') {
				if(gState == 'go') {
					guy.oldX2 = guy.oldX
					guy.oldY2 = guy.oldY
					guy.oldX = guy.x
					guy.oldY = guy.y
					var old = guy.x
					guy.x += guy.speedX
					if(gGuyHit(guy)) {
						guy.x = old
						guy.speedX =- guy.speedX
						gAudio.play(gBounceSound, guy.x/gGameSizeX)
					}
					var old = guy.y
					guy.y += guy.speedY
					if(gGuyHit(guy)) {
						guy.y = old
						guy.speedY =- guy.speedY
						gAudio.play(gBounceSound, guy.x/gGameSizeX)
					}
				}
			}
		}
	}

	if(gState == 'go') {
		var done = 1
		for(var guy3 of gGuys) {
			if(guy3.kind == 'guy' && !guy3.dead) {
				done = 0
			}
		}
		if(done) {
			gYouEndTime = gloop.time
			gStateSet('win')
		}
	}


	if(gin.clickReleased) {
		gin.clickReleasedDraw = gin.clickReleased
	}
	gin.update()
}

function gGridGet(x,y) {
	if(x<0 || y<0 || x>=gGridSizeX || y>=gGridSizeY) {
		return 1
	}
	return gGrid[x][y]
}

function gGridLower(x,y,addX,addY) {
	x += addX
	y += addY
	var tile = gGridGet(x,y)
	return 1-tile
}

var gWayX = [1,0,-1,0]
var gWayY = [0,1,0,-1]
var gWay8X = [1,1,0,-1,-1,-1,0,1]
var gWay8Y = [0,1,1,1,0,-1,-1,-1]

function gDraw() {

	gl1.drawRect(0, 0, gCanvasSizeX, gCanvasSizeY, 0x221e237F)

	for(var gridY=0; gridY<gGridSizeY; gridY++) {
		for(var gridX=0; gridX<gGridSizeX; gridX++) {
			var value = gGrid[gridX][gridY]
			var drawX = gridX*gTileSizeX
			var drawY = gridY*gTileSizeY
			if(!value) {
				//gl1.rectDraw(drawX, drawY, gTileSizeX, gTileSizeY, 0x6666667F)
				gl1.imageDraw(gFloorImage, drawX, drawY)
			} else {
				//gl1.rectDraw(drawX, drawY, gTileSizeX, gTileSizeY, wallColor)
				var isR = gGridLower(gridX, gridY, 1, 0)
				var isL = gGridLower(gridX, gridY, -1, 0)
				var isD = gGridLower(gridX, gridY, 0, 1)
				var isU = gGridLower(gridX, gridY, 0, -1)
				var isUR = gGridLower(gridX, gridY, 1, -1)
				var isUL = gGridLower(gridX, gridY, -1, -1)
				var isDL = gGridLower(gridX, gridY, -1, 1)
				var isDR = gGridLower(gridX, gridY, 1, 1)
				if(isDR && isD && isR) {
					gl1.imageDraw(gFloorImage, drawX, drawY)
					gl1.imageDraw(gWallDRImage, drawX, drawY, gTileSizeX, gTileSizeY)
					continue
				}
				if(isDL && isD && isL) {
					gl1.imageDraw(gFloorImage, drawX, drawY)
					gl1.imageDraw(gWallDLImage, drawX, drawY, gTileSizeX, gTileSizeY)
					continue
				}
				if(isUR && isU && isR) {
					gl1.imageDraw(gFloorImage, drawX, drawY)
					gl1.imageDraw(gWallURImage, drawX, drawY, gTileSizeX, gTileSizeY)
					continue
				}
				if(isUL && isU && isL) {
					gl1.imageDraw(gFloorImage, drawX, drawY)
					gl1.imageDraw(gWallULImage, drawX, drawY, gTileSizeX, gTileSizeY)
					continue
				}
				if(isL) {
					gl1.imageDraw(gWallLImage, drawX-6, drawY, gTileSizeX, gTileSizeY)
				}
				if(isR) {
					gl1.imageDraw(gWallRImage, drawX+6, drawY, gTileSizeX, gTileSizeY)
				}
				if(isU) {
					gl1.imageDraw(gWallUImage, drawX, drawY-8, gTileSizeX, gTileSizeY)
				}
				if(isD) {
					gl1.imageDraw(gWallDImage, drawX, drawY+1, gTileSizeX, gTileSizeY)
				}
				if(!isD && !isR) {
					if(isDR) {
						gl1.imageDraw(gWallInDRImage, drawX+6, drawY+1, gTileSizeX, gTileSizeY)
					}
				}
				if(!isD && !isL) {
					if(isDL) {
						gl1.imageDraw(gWallInDLImage, drawX-6, drawY+1, gTileSizeX, gTileSizeY)
					}
				}
				if(!isU && !isR) {
					if(isUR) {
						gl1.imageDraw(gWallInURImage, drawX+6, drawY-8, gTileSizeX, gTileSizeY)
					}
				}
				if(!isU && !isL) {
					if(isUL) {
						gl1.imageDraw(gWallInULImage, drawX-6, drawY-8, gTileSizeX, gTileSizeY)
					}
				}
			}
		}
		//gl1.rectDraw(0, drawY, gGameSizeX, 1, 0xFFFF0011)
	}
	for(var gridX=0; gridX<gGridSizeX; gridX++) {
		//gl1.rectDraw(gridX*gTileSizeX, 0, 1, gGameSizeY, 0xFFFF0011)
	}

	for(var guy of gGuys) {
		var drawX = guy.x
		var drawY = guy.y
		if(guy.kind == 'star') {
			gl1.imageDraw(gStarImage,drawX,drawY)
		} else if(guy.kind == 'crate') {
			if(guy.dead) {
				var a = 167*(1-guy.dead/12)|0
				gCrateExplodeImage.rgb = 0xFFDDAA00+a
				gl1.imageDraw(gCrateExplodeImage,drawX,drawY)
			} else {
				gl1.imageDraw(gCrateImage,drawX,drawY)
			}
		} else if(guy.kind == 'bomb') {
			//var add = guy.dead ? guy.dead/10*guy.sizeX*1.5 : 0
			//gl1.rectDraw(drawX-add, drawY-add, guy.sizeX+add*2, guy.sizeY+add*2, guy.dead ? 0xFFFFBB7F : 0xFF99997F)
			if(!(guy.dead>1)) {
				gl1.imageDraw(gBombImage, drawX, drawY)
			}
			if(guy.dead) {
				gl1.imageDraw(gBombExplodeImages[guy.dead], drawX+guy.sizeX/2-56/2, drawY+guy.sizeY/2-56/2)
			}
		} else if(guy.kind == 'wall') {
			//gl1.rectDraw(drawX, drawY, guy.sizeX, guy.sizeY, guy.hp < 3 ? 0xDD77337F : 0x9999997F)
			gl1.imageDraw(gWallImage,drawX,drawY)
		} else if(guy.kind == 'ball') {
			var angle = gAngleTo(0,0,guy.speedX,guy.speedY)
			var x = guy.x-guy.sizeX/2
			var y = guy.y-guy.sizeX/2
			var distX = guy.oldX2-guy.x
			var distY = guy.oldY2-guy.y
			for(var i=0;i<9;i++) {
				var far = i/9
				var a = (1-far)*127|0
				gl1.rectDraw(drawX+distX*far, drawY+distY*far, guy.sizeX,guy.sizeX, 0x5577FF00+a)
			}
		} else {
			var scale = 1
			if(guy.dead) {
				
				var frame = Math.min(~~((guy.dead-1)/2), gAlienDieImages.length-1)
				var image = gAlienDieImages[frame]
				gl1.imageDraw(image, drawX-9*scale, drawY-1*scale, image.sizeX*scale, image.sizeY*scale)
				//gl1.rectDraw(drawX, drawY, guy.sizeX, guy.sizeY, 0x00FF0022)
			} else {
				var frame = ~~((gloops/5+guy.y)%4)
				var image = gAlienImages[frame]
				gl1.imageDraw(image, drawX-9*scale, drawY-1*scale, image.sizeX*scale, image.sizeY*scale)
				//gl1.rectDraw(drawX, drawY, guy.sizeX, guy.sizeY, 0x00FF0022)
			}
		}
		//gl1.rectDraw(drawX, drawY, guy.sizeX, guy.sizeY, 0x00FF0022)
		
	}
	
	if(gState == 'input' || gState == 'aim') {
		if((gin.clicking && gin.clicking.dragWay) || (gin.clickReleasedDraw && gin.clickReleasedDraw.dragWay)) {
			if(gState != 'aim') {
				gStateSet('aim')
			}
			
			var size = gYou.sizeX
			gYou.x = gin.clickStartX-size/2
			gYou.y = gin.clickStartY-size/2
			var angle = gAngleTo(gin.clickStartX, gin.clickStartY, gin.mouseX, gin.mouseY)
			
			gYou.speedX = Math.cos(angle)
			gYou.speedY = Math.sin(angle)

			gYou.oldX = gYou.x
			gYou.oldY = gYou.y
			gYou.oldX2 = gYou.x+gYou.speedX*7
			gYou.oldY2 = gYou.y+gYou.speedY*7
			
			if(gBoxHitGrid(guy)) {
			} else {
		
				var size = 16
				var startX = gin.clickStartX-1-Math.cos(angle)*size
				var startY = gin.clickStartY-1-Math.sin(angle)*size
				var distX = startX-gin.mouseX
				var distY = startY-gin.mouseY
				for(var i=0;i<9;i++) {
					var far = i/9*9
					gl1.rectDraw(startX+Math.cos(angle+Math.PI/4)*far, startY+Math.sin(angle+Math.PI/4)*far,2,2,0xFFFF007F)
					gl1.rectDraw(startX+Math.cos(angle-Math.PI/4)*far, startY+Math.sin(angle-Math.PI/4)*far,2,2,0xFFFF007F)
				}
				for(var i=0;i<19;i++) {
					var far = i/19*size*2
					gl1.rectDraw(startX+Math.cos(angle)*far, startY+Math.sin(angle)*far,2,2,0xFFFF007F)
				}
				if(gin.clickReleasedDraw) {
					var speed = 7
					gYou.speedX = -Math.cos(angle) * speed
					gYou.speedY = -Math.sin(angle) * speed
					gStateSet('go')
					gYouStartTime = gloop.time
					gAudio.play(gShootSound, gYou.x/gGameSizeX)
				}
			}
		}
	}

	var time = 0
	if(gYouStartTime) {
		time = gloop.time-gYouStartTime
		if(gYouEndTime) {
			time = gYouEndTime-gYouStartTime
		}
		var sec = time/1000|0
		var hundo = ((time % 1000)/10|0)+''
		if(hundo.length<2)hundo='0'+hundo
		time = sec+"."+hundo
	}
	glText.draw("Time: "+time, gGameSizeX/2, 4-gGameY, 1, 1)

	if(gState == 'title') {
		gCursorSet()
		gl1.drawRect(0, 0, gCanvasSizeX, gCanvasSizeY, 0x44)
		gl1.imageDraw(gLogoImage,gGameSizeX/2-gLogoImage.sizeX/2,10)
		glText.draw((gin.mobile?"TAP":"CLICK")+" TO PLAY", gGameSizeX/2, 230, 1, 1, 0x3FFF3F00+40+Math.floor(Math.abs(Math.sin(gloops*.1)*87)))
		if(gin.clickReleasedDraw) {
			gStateSet('input')
		}
	}
	
	if(gState == 'win') {
		gl1.drawRect(0, 0, gCanvasSizeX, gCanvasSizeY, 0x33)
		glText.draw("CLEARED!", gGameSizeX/2, 45, 2, 1)
		var time = gYouEndTime-gYouStartTime
		var timeScore = Math.floor(100000/time)
		var starsScore = Math.floor(100*gStarsGot)
		glText.draw("Time Bonus\n[score]"+timeScore, gGameSizeX/2, 90, 1, 1)
		glText.draw("Star Score\n"+gStarsGot+"x100 = [score]"+starsScore, gGameSizeX/2, 140, 1, 1)
		glText.draw("[score]"+(timeScore+starsScore), gGameSizeX/2, 190, 2, 1)
		glText.draw((gin.mobile?"Tap":"Click")+" to continue", gGameSizeX/2, 230, 1, 1, 0xFFFFFF00+40+Math.floor(Math.abs(Math.sin(gloops*.1)*87)))
	}

	if(1) {
		var x = gCanvasSizeX-gGameX-30
		var y = 4-gGameY+(onBox && gin.clicking?2:0)
		var onBox = gRectsHit(x, y, gMuteButton.sizeX, gMuteButton.sizeY, gin.mouseX, gin.mouseY,1,1)
		if(onBox)gCursorSet()
		gl1.imageDraw(gMuted ? gMutedButton: gMuteButton, x, y)
		if(gin.clickReleasedDraw && onBox) {
			gin.clickReleasedDraw = 0
			gMuted = !gMuted
			if(gMuted) {
				gAudio.stopAll()
			} else {
				gAudio.play(gPlayMusic)
			}
		}
	}
	if(gState == 'win') {
		if(gin.clickReleasedDraw) {
			gLevel++
			gReset()
		}
	}
	if(gState == 'go' || gState == 'input' || gState == 'aim') {
		var onBox = gRectsHit(4-gGameX,4-gGameY,gRetryButton.sizeX,gRetryButton.sizeY, gin.mouseX, gin.mouseY,1,1)
		//gRetryButton.rgb = onBox && (gin.clicking || gin.clickReleasedDraw) ? 0x9999997F : u
		if(gState != 'go') {
			var c = 200
			gRetryButton.rgb = gRgbMake(c,c,c)
		} else {
			gRetryButton.rgb = u
			if(onBox)gCursorSet()
		}
		gl1.imageDraw(gRetryButton,4-gGameX,4-gGameY+(onBox && gin.clicking?2:0))
		if(gin.clickReleasedDraw && onBox) {
			gReset()
		}
	}
	
	gin.clickReleasedDraw = 0

	gl1.render()
}

function gResize(recur) {
	var ratio = window.devicePixelRatio
	gScreenSizeX = innerWidth*ratio
	gScreenSizeY = innerHeight*ratio
	var gameSizeXMin = gGameSizeX-32
	var gameSizeYMin = gGameSizeY-32
	var scaleX = gScreenSizeX / gameSizeXMin | 0
	var scaleY = gScreenSizeY / gameSizeYMin | 0
	if(scaleX < scaleY) {
		gLog("gResize() tallscreen", scaleX, scaleY)
		gGameScale = scaleX
	} else {
		gLog("gResize() widescreen", scaleX, scaleY)
		gGameScale = scaleY
	}
	if(gGameScale<1)gGameScale=1
	
	gCanvasSizeX = gScreenSizeX / gGameScale | 0
	gCanvasSizeY = gScreenSizeY / gGameScale | 0
	
	gCanvas.setAttribute('width', gCanvasSizeX)
	gCanvas.setAttribute('height', gCanvasSizeY)
	
	gCanvas.style.width = (gCanvasSizeX*gGameScale/ratio|0)+'px'
	gCanvas.style.height = (gCanvasSizeY*gGameScale/ratio|0)+'px'
	
	gGameX = ((gCanvasSizeX - gGameSizeX) >> 1)
	gGameY = ((gCanvasSizeY - gGameSizeY) >> 1)+5

	gin.offsetX = gl1.offsetX = gGameX
	gin.offsetY = gl1.offsetY = gGameY
	gin.scale = gGameScale/ratio

	gl1.resize()
	
	scrollTo(0,0)
	if(!recur) {
		setTimeout(function(){scrollTo(0,0)}, 999)
		setTimeout(function(){gResize(1)}, 111)
	}
}

var gAlienImages = []
var gAlienDieImages = []
var gWallRImage,gWallLImage,gWallDImage,gWallUImage
var gWallDRImage,gWallDLImage,gWallULImage,gWallURImage
var gWallInDRImage,gWallInDLImage,gWallInULImage,gWallInURImage
var gFloorImage
var gRetryButton
var gLogoImage
var gBombImage
var gBombExplodeImages=[]
var gCrateImage,gCrateExplodeImage
var gStarImage
var gMuteButton,gMutedButton
window.onload = function() {
	gCanvas = document.createElement('canvas')
	document.body.appendChild(gCanvas)

	gl1.setup(gCanvas, 'tex.png?29')
	glText.setup()
	glText.iconAdd("score", 0, 445, 13, 16)
	
	for(var i=0;i<4;i++) {
		gAlienImages[i] = gl1.imageMake(i*32,1,32,22)
	}
	for(var i=0;i<7;i++) {
		gAlienDieImages[i] = gl1.imageMake(4*32+i*32,1,32,22)
	}

	gFloorImage = gl1.imageMake(0,74,24,24)
	//gWallImage = gl1.imageMake(25,74,33,15)
	gCrateImage = gl1.imageMake(0,159,25,24)
	gCrateExplodeImage = gl1.imageMake(42,159,23,29)
	gStarImage = gl1.imageMake(26,160,15,13)
	
	var y = 25
	gWallRImage = gl1.imageMake(48+0, y+24, 24, 1)
	gWallLImage = gl1.imageMake(48+24, y+24, 24, 1)
	gWallDImage = gl1.imageMake(48+24, y, 1, 24)
	gWallUImage = gl1.imageMake(48+24, y+24, 1, 24)

	gWallInDRImage = gl1.imageMake(48+0, y+0, 24, 24)
	gWallInDLImage = gl1.imageMake(48+24, y+0, 24, 24)
	gWallInURImage = gl1.imageMake(48+0, y+24, 24, 24)
	gWallInULImage = gl1.imageMake(48+24, y+24, 24, 24)
	
	gWallULImage = gl1.imageMake(0, y+0, 24, 24)
	gWallURImage = gl1.imageMake(24, y+0, 24, 24)
	gWallDLImage = gl1.imageMake(0, y+24, 24, 24)
	gWallDRImage = gl1.imageMake(24, y+24, 24, 24)

	gMuteButton = gl1.imageMake(33,99,25,28)
	gMutedButton = gl1.imageMake(33+25+1,99,25,28)
	gRetryButton = gl1.imageMake(0,99,25,28)
	gLogoImage = gl1.imageMake(352,375,160,137)
	
	gBombImage = gl1.imageMake(0,134,25,24)
	for(var i=0;i<20;i++) {
		var x = i%5
		var y = i/5|0
		gBombExplodeImages[i] = gl1.imageMake(x*56,187+y*56,56,56)
	}
	
	window.onresize = gResize
	gResize()
	
	gReset()
	gStateSet('title')
	
	gloop.start(gUpdate, gDraw, 60)

	gLoadingDiv.innerHTML += "<br>LOADING GRAPHICS..."

}

var gPlayMusic
var gShootSound,gBounceSound,gGuyDieSound,gExplodeSound,gStarSound
function gAudioSetup() {
	gPlayMusic = gAudio.load('play.mp3',1)
	gShootSound = gAudio.load('shoot.wav')
	gBounceSound = gAudio.load('bounce.wav')
	gGuyDieSound = gAudio.load('die2.wav')
	gExplodeSound = gAudio.load('explode.wav')
	gStarSound = gAudio.load('star.mp3')
}

function gAngleTo(x, y, targetX, targetY) {
	var angle = Math.atan2(targetY-y, targetX-x)
	return angle
}

function gRectsHit(x1, y1, width1, height1, x2, y2, width2, height2) {
	if(y2===u) {
		y2 = x2.y
		width2 = x2.sizeX
		height2 = x2.sizeY
		x2 = x2.x
	}
	if(x1 >= x2 + width2) return 0
	if(y1 >= y2 + height2) return 0
	if(x2 >= x1 + width1) return 0
	if(y2 >= y1 + height1) return 0
	return 1
}

function gArrayRemove(a, item) {
	var i = a.indexOf(item)
	if(i<0)debugger
	a.splice(i,1)
}

function gRandomFake(seed) {
	return Math.abs(Math.sin(seed*seed))*1e8%1
}

function gCursorSet(cursor) {
	if(cursor===u)cursor='pointer'
	if(gCursor != cursor) {
		gCursor = cursor
		document.body.style.cursor = cursor
	}
}
