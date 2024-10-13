var glText = {
	letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-!?.,'\"+[]&@#$%:/\\<>=",
	letterImages: [],
	iconsByName: {},
	iconsByCode: {},
	setup: function() {
		var x=0,y=462,sizey=16
		for(var i=0; i<this.letters.length; i++)
		{
			var letter = this.letters[i]
			var size = this.sizeXGet(letter, 1)
			this.letterImages[letter.charCodeAt(0)] = gl1.imageMake(x, y, size, 16)
			x += size+1
			if(letter == 'Z' || letter == 'z') {
				x = 0
				y += sizey+1
			}
		}
	},
	letterSizeXget: function(letter, scale) {
		var size = this.letterSizeXBaseGet(letter)
		if(scale > 1 && scale < 2)
		{
			if(size < 9)size-=1
			return size+2
		}
		return Math.ceil(size*scale)
	},
	letterSizeXBaseGet: function(letter) {
		var icon = this.iconsByCode[letter]
		if(icon) {
			return icon.sizeX
		}
		if(letter=="'") return 4
		if(letter=='l' || letter=='!' || letter=='.' || letter==':') return 5
		if(letter=='i' || letter==',') return 6
		if(letter=="[" || letter=="]") return 7
		if(letter=='c' || letter=='e' || letter=='a' || letter=='r') return 8
		if(letter=='N') return 9
		if(letter=='Q') return 11
		if(letter==' ') return 7
		if(letter=='m' || letter=='w' || letter=='M' || letter=='W') return 12
		return 9
	},
	sizeXGet: function(text,scale,convertedalready) {
		scale = scale || 1
		var spacing = -1*(Math.floor(scale))
		var x = 0
		for(var i=0; i<text.length; i++)
		{
			var letter = text.charAt(i)
			var size = this.letterSizeXget(letter, scale)
			x += size+spacing
		}
		
		return x-spacing
	},
	iconAdd: function(name, imageOrX, y, sizeX, sizeY) {
		var code = String.fromCharCode(226+Object.keys(this.iconsByName).length)
		var icon = {code}
		if(imageOrX.sizeX) {
			icon.image = imageOrX
			icon.offsetY = y||-1
			icon.sizeX = imageOrX.sizeX
			icon.sizeY = imageOrX.sizeY
		} else {
			icon.image = gl1.imageMake(imageOrX,y,sizeX,sizeY)
			icon.sizeX = sizeX
			icon.sizeY = sizeY
			icon.offsetY = -1
		}
		this.iconsByCode[code] = this.iconsByName[name] = icon
	},
	iconsConvert: function(text) {
		for(var name in this.iconsByName) {
			//replaceAll is not supported by iOS9
			text = text.split('['+name+']').join(this.iconsByName[name].code)
		}
		return text
	},
	draw: function(text, x, y, scale, center, rgb, rgbfix) {
		text = text+''
		x = ~~x
		y = ~~y
		scale = scale || 1
		text = this.iconsConvert(text)
		
		var texts = text.split('\n')
		var startX = x
		if(center == 2) {
			y -= 7*Math.floor(scale)*texts.length | 0
		}
		
		rgb = rgb || 0xFFFFFF7F
		for(var text of texts) {
			var rgbnow = rgb
			
			var iconyadd = scale*3-5 | 0
			
			if(center) {
				this.drawSizeX = this.sizeXGet(text,scale,1)+scale*4
				x -= this.drawSizeX/(center==3 ? 1: 2) | 0
			}
			
			for(var i=0; i<text.length; i++) {
				var letter = text.charAt(i)
				var code = letter.charCodeAt(0)
				var image = this.letterImages[code]
				var addy = 0
				if(image) {
					image.rgb = rgbnow
					if(letter == ',')addy=3
					if(scale != 1) {
						gl1.imageDraw(image, x-(letter=='j')*3*scale, y+addy, image.sizeX*(scale), image.sizeY*(scale))
					} else
						gl1.imageDraw(image, x, y+addy)
				} else {
					var icon = this.iconsByCode[letter]
					if(icon) {
						icon.image.rgb = rgbnow
						gl1.imageDraw(icon.image, x, y+icon.offsetY*scale, icon.sizeX*scale, icon.sizeY*scale)
					}
				}
				x += (this.sizeXGet(letter,scale,1))-1 | 0
			}
			this.drawX = x
			y += 16*scale | 0
			x = startX
		}
		
	}
}