var gGameX,gGameY,
	gStorage = localStorage || {},
	gStoragePrefix = 'lazerSniper',
	gAppVersion=44,
	gGameSizeX=192,gGameSizeY=312,
	gScores,gScoresGetError,
	gScore,gScoreSaveLoading,
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
	gLoops=0,
	gLog=console.log.bind(console),
	gGrid=[],
	gGridSizeX=8,
	gGridSizeY=13,
	gTileSizeX=24,gTileSizeY=24,
	gStateLoop,gStateLoops=0,gStateDraws=0,
	gLoginError,
	u

function gStateSet(state) {
	gLog("gStateSet() from "+gState+" to "+state)
	gState = state
	gStateLoop = gLoops
	gStateLoops = gStateDraws = 0
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
	gYouStartTime = gYouEndTime = 0
	gHits = 0
	gStarsGot = 0
	if(gLevel == 1) {
		gScore = 0
	}
	
	if(gLevel == 1) {
		gGridRect(0, 2,1, 4,gGridSizeY-2)
		
		gGuyMake('guy',88,66)
		gGuyMake('star',88,88,1)
		gGuyMake('guy',88,110)
	}
	if(gLevel == 2) {
		gGridRect(0, 1,5,gGridSizeX-2,gGridSizeY-6)
		gGridRect(0, 1,2,1,3)
		
		gGuyMake('guy',28,40)
		gGuyMake('guy',28,66)
		gGuyMake('guy',88,210)
		gGuyMake('star',50,160,0,1)
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
		
		gGuyMake('star',70,200,1)
		gGuyMake('guy',111,250)
		//gGuyMake('crate',144,166)
		//gGuyMake('crate',144,186)
		//gGuyMake('crate',144,206)
		//gGuyMake('crate',144,226)
	}
	if(gLevel == 4) {
		gGridRect(0, 1,2,gGridSizeX-2,gGridSizeY-4)
		var y=24
		for(var x=1;x<7;x++) {
			gGuyMake('bomb',x*24,46+y)
			gGuyMake('crate',x*24,66+y)
			gGuyMake('crate',x*24,86+y)
			gGuyMake('crate',x*24,106+y)
			gGuyMake('crate',x*24,126+y)
		}
		gGuyMake('guy',111,150+y)
		gGuyMake('guy',30,25+y)
		gGuyMake('star',50,180+y,1)
		gGuyMake('star',80,210+y,1)
	}
	if(gLevel == 5) {
		gGridRect(0, 2,1, 4,gGridSizeY-2)
		
		gGuyMake('guy',111,44)
		gGuyMake('guy',88,66)
		gGuyMake('star',50,100,3)
		gGuyMake('guy',88,133)
	}
	if(gLevel == 6) {
		gGridRect(0, 1,5,gGridSizeX-2,gGridSizeY-6)
		
		gGuyMake('guy',88,122)
		gGuyMake('guy',28,195)
		gGuyMake('guy',150,195)
		gGuyMake('guy',88,266)
		gGuyMake('star',50,155,1)
		gGuyMake('star',50,177,0,1)
	}
	if(gLevel == 7) {
		gGridRect(0, 1,5,gGridSizeX-2,gGridSizeY-6)

		for(var x=0; x<5; x++) {
			gGuyMake('guy',50+x*18,222)
			gGuyMake('guy',50+x*18,222+18)
		}
		gGuyMake('star',95,265,1,1)
	}
	if(gLevel == 8) {
		gGridRect(0, 1,5,gGridSizeX-2,gGridSizeY-6)

		for(var x=0; x<5; x++) {
			gGuyMake('guy',50+x*18,122)
			gGuyMake('guy',50+x*18,222+18)
		}
		gGuyMake('star',50,266,1)
	}
	if(gLevel == 9) {
		gGridRect(0, 1,5,gGridSizeX-2,gGridSizeY-6)

		gGuyMake('guy',80,117)
		gGuyMake('guy',100,117)
		for(var y=0; y<3; y++) {
			for(var x=0; x<3; x++) {
				var kind = 'crate'
				if(x==1&&y==1) {
					kind = 'bomb'
				} else {
					if(x!=1 && y!=1) {
						kind = 'guy'
					}
				}
				gGuyMake(kind,60+x*23+(kind=='guy')*5,160+y*20)
			}
		}
	}
		/*
	if(gLevel == 10) {
		gGridRect(0, 2,3,gGridSizeX-4,gGridSizeY-4)
		gGridRect(1, 2,3,1,2)
		gGridRect(1, 2,9,1,3)
		gGuyMake('guy',80,66)
		gGuyMake('guy',50,120)
		gGuyMake('guy',50,196)
		gGuyMake('guy',74,207)
		
		for(var x=0; x<6; x++) {
			gGuyMake('guy2',49+x*16,122)
		}
		for(var x=0; x<4; x++) {
			gGuyMake('bomb',48+x*24,99)
		}
	}
		*/
	if(gLevel == 10) {
		gGridRect(0, 1,2,gGridSizeX-2,gGridSizeY-3)

		var rando = Math.random()*60+8 | 0
		for(var i=0;i<77;i++) {
			var x = (Math.random()*(gGridSizeX-3)+1)*gTileSizeX
			var y = gTileSizeY*2+i/77*(gGridSizeY-4)*gTileSizeY
			if(i==rando)
				gGuyMake('bomb',100,y)
			else
				gGuyMake(i%5==0?'star':'guy',x,y)
		}
	}
	
	gYou = gGuyMake('ball',-99999,22)
	
	if(gLevel > 10) {
		gStateSet('victory')
		gAudio.play(gWinSound)
		gScoreSave()
	} else {
		gStateSet('input')
	}
}

function gGuyMake(kind,x,y,speedX,speedY,sizeX,sizeY) {
	var hpMax
	if(kind=='bomb'||kind=='crate'){
		sizeX=25
		sizeY=24
	}
	if(kind=='star'){
		sizeX=15
		sizeY=13
	}
	if(kind=='guy'){
		hpMax = 1
	}
	if(kind=='guy2'){
		hpMax = 2
		kind = 'guy'
	}
	if(kind=='guy'){
		sizeX=14
		sizeY=20
	}
	if(kind=='ball'){
		sizeX=4
		sizeY=4
	}
	speedX = speedX||0
	speedY = speedY||0
	var guy = {kind,x,y,oldX:0,oldY:0,oldX2:0,oldY2:0,sizeX,sizeY,speedX,speedY,hp:9999}
	if(kind=='guy')guy.hp=hpMax
	if(kind=='bomb')guy.hp=1
	if(kind=='star')guy.hp=0
	if(kind=='crate')guy.hp=1
	guy.hpMax = hpMax||guy.hp
	gGuys.push(guy)
	return guy
}

function gGuyHit(guy, checkOnly) {
	for(var guy2 of gGuys) {
		if(guy2 != guy && !guy2.dead) {
			if(guy.kind == 'star' && guy2.kind=='ball')continue
			if(gRectsHit(guy.x, guy.y, guy.sizeX, guy.sizeX, guy2)) {
				if(checkOnly) {
					if(guy2.kind == 'star')continue
					return guy2
				}
				if(guy.kind == 'star')return guy
				if(guy2.kind == 'guy') {
					guy2.hp--
					if(guy2.hp < 1) {
						guy2.dead = 1
						gAudio.play(gGuyDieSound, guy2.x/gGameSizeX)
					} else {
						guy2.hitLoop = gLoops
						return guy
					}
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
							if(guy2.kind == 'crate') {
								gAudio.play(gCrateSound, guy2.x/gGameSizeX)
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
		gLoops++
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
			if((guy.kind == 'ball' && gState == 'go') || guy.kind=='star') {
				guy.oldX2 = guy.oldX
				guy.oldY2 = guy.oldY
				guy.oldX = guy.x
				guy.oldY = guy.y
				var old = guy.x
				guy.x += guy.speedX
				if(gGuyHit(guy)) {
					guy.x = old
					guy.speedX =- guy.speedX
					if(guy.kind == 'ball') {
						gAudio.play(gBounceSound, guy.x/gGameSizeX)
					}
				}
				var old = guy.y
				guy.y += guy.speedY
				if(gGuyHit(guy)) {
					guy.y = old
					guy.speedY =- guy.speedY
					if(guy.kind == 'ball') {
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
	if(gin.clickStarted) {
		gin.clickStartedDraw = gin.clickStarted
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
			gl1.rectDraw(drawX+1, drawY-1, guy.sizeX-2, guy.sizeX+2, 0x5577FF7F)
			gl1.rectDraw(drawX-1, drawY+1, guy.sizeX+2, guy.sizeX-2, 0x5577FF7F)
			for(var i=0;i<9;i++) {
				var far = i/9
				var a = (1-far)*127|0
				gl1.rectDraw(drawX+distX*far, drawY+distY*far, guy.sizeX,guy.sizeX, 0x5577FF00+a)
			}
		} else {
			var scale = 1
			if(guy.dead) {
				var images = guy.hpMax>1?gAlien2DieImages:gAlienDieImages
				var frame = Math.min(~~((guy.dead-1)/2), images.length-1)
				var image = images[frame]
				gl1.imageDraw(image, drawX-9*scale, drawY-1*scale, image.sizeX*scale, image.sizeY*scale)
				//gl1.rectDraw(drawX, drawY, guy.sizeX, guy.sizeY, 0x00FF0022)
			} else {
				var frame = ~~((gLoops/5+guy.y)%4)
				var image = (guy.hpMax>1?gAlien2Images:gAlienImages)[frame]
				if(guy.hitLoop && gLoops-guy.hitLoop<10) {
					image = gAlien2HitImage
					if(gLoops-guy.hitLoop>5) {
						image = gAlien2DieImages[0]
					}
				}
				image.rgb = (guy.hp<guy.hpMax) ? 0xBBBBBB7F: u
				gl1.imageDraw(image, drawX-9*scale, drawY-1*scale, image.sizeX*scale, image.sizeY*scale)
				//gl1.rectDraw(drawX, drawY, guy.sizeX, guy.sizeY, 0x00FF0022)
			}
		}
		//gl1.rectDraw(drawX, drawY, guy.sizeX, guy.sizeY, 0x00FF0022)
		
	}
	
	if(gState == 'input' && gin.clickStartedDraw) {
		gClickDownSoundPlay()
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
			
			if(gGuyHit(guy,1)) {
				if(gin.clickReleasedDraw) {
					gStateSet('input')
					gYou.x = -9999
				}
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

	var sec = 0, hundo = '0'
	if(gYouStartTime) {
		var time = gloop.time-gYouStartTime
		if(gYouEndTime) {
			time = gYouEndTime-gYouStartTime
		}
		sec = time/1000|0
		hundo = ((time % 1000)/10|0)+''
	}
	if(hundo.length<2)hundo='0'+hundo
	glText.draw("[time]"+sec+"."+hundo, gGameSizeX/2, 4-gGameY, 1, 1)
	if(gCanvasSizeX < 244) {
		glText.draw("[score]"+gScore, gGameSizeX/2, 22-gGameY, 1, 1)
	} else {
		glText.draw("[score]"+gScore, 32-gGameX, 4-gGameY)
		glText.draw("[level]"+gLevel+'/10', gCanvasSizeX-gGameX-91, 4-gGameY)
	}
	
	var muteX = gCanvasSizeX-gGameX-30
	var muteY = 4-gGameY+(onBox && gin.clicking?2:0)
	var muteHover = gRectsHit(muteX, muteY, gMuteButton.sizeX, gMuteButton.sizeY, gin.mouseX, gin.mouseY,1,1)
	if(muteHover) {
		gCursorSet()
		if(gin.clickReleasedDraw) {
			gin.clickReleasedDraw = 0
			gMuted = !gMuted
			if(gMuted) {
				gAudio.stopAll()
			} else {
				gAudio.play(gPlayMusic)
				gClickUpSoundPlay()
			}
			gStorageSet('muted', gMuted ? 1: 0)
		}
	}

	if(gState == 'login') {
		gCursorSet()
		gl1.drawRect(0, 0, gCanvasSizeX, gCanvasSizeY, 0x44)
		gl1.imageDraw(gLogoImage,gGameSizeX/2-gLogoImage.sizeX/2,10)
		glText.draw((gin.mobile?"TAP":"CLICK")+" TO LOG IN\nWITH HYPLAY", gGameSizeX/2, 155, 1, 1, 0x3FFF3F00+40+Math.floor(Math.abs(Math.sin(gLoops*.1)*87)))
	}
	
	if(gState == 'loginLoading') {
		gl1.drawRect(0, 0, gCanvasSizeX, gCanvasSizeY, 0x44)
		gl1.imageDraw(gLogoImage,gGameSizeX/2-gLogoImage.sizeX/2,10)
		if(gLoginError) {
			glText.draw("Failed to log in.\nHYPLAY user required.", gGameSizeX/2, 155, 1, 1, 0x3FF55557F)
		} else {
			glText.draw("Logging in[...]", gGameSizeX/2, 160, 1, 1, 0x3FFF3F00+60+Math.floor(Math.abs(Math.sin(gLoops*.05)*67)))
		}
	}
	
	var scroll = 0
	if(gStateLoops > 200 && gScores && gScores.length > 3) {
		scroll = gStateLoops-200
		if(scroll > 160)scroll=160
	}
	
	if(gState == 'title') {
		gCursorSet()
		gl1.drawRect(0, 0, gCanvasSizeX, gCanvasSizeY, 70+Math.min(scroll,30))
		gl1.imageDraw(gLogoImage,gGameSizeX/2-gLogoImage.sizeX/2,10-scroll)
		if(!scroll) {
			glText.draw("Hi "+gStorageGet('hyplayUsername')+"!", gGameSizeX/2, 150, 1, 1)
			glText.draw((gin.mobile?"TAP":"CLICK")+" TO PLAY", gGameSizeX/2, 170, 1, 1, 0x3FFF3F00+40+Math.floor(Math.abs(Math.sin(gLoops*.1)*87)))
		}
		if(gin.clickStartedDraw) {
			gClickDownSoundPlay()
		}
		if(gin.clickReleasedDraw) {
			if(scroll) {
				scroll = 0
				gStateLoops = 0
			} else {
				gClickUpSoundPlay()
				gStateSet('input')
			}
		}
	}
	
	if(gState == 'login' || gState == 'loginLoading' || gState == 'title') {
		glText.draw("HIGH SCORES", gGameSizeX/2, 200-scroll, 1, 1)
		if(gScores === u) {
			glText.draw(gScoresGetError ? "Error" : "[...]", gGameSizeX/2, 216-scroll, 1, 1)
		} else {
			if(gScores.length) {
				gScores.forEach((score,i) => {
					if(i>2 && !scroll)return
					var y = 224+i*18-scroll
					
					var pad = -10
					if(gCanvasSizeX < 214) {
						pad = (200-gCanvasSizeX)/2
					}
					
					var name = score.username
					var max = 13
					if(pad>0) {
						max -= (pad+5)/5|0
					}
					if(name.length > max) {
						name = name.substr(0,max)+'...'
					}
					glText.draw((i+1)+". "+name, pad+2, y)
					glText.draw("[score]"+score.score, gGameSizeX-54-pad, y)
				})
			} else {
				glText.draw("none", gGameSizeX/2, 224, 1, 1)
			}
		}
	}
	
	if(gState == 'win') {
		
		gl1.drawRect(0, 0, gCanvasSizeX, gCanvasSizeY, 0x33)
		glText.draw("Level "+gLevel, gGameSizeX/2, 35, 1, 1)
		glText.draw("CLEARED!", gGameSizeX/2, 50, 2, 1)
		var time = gYouEndTime-gYouStartTime
		var timeScore = Math.floor(100000/time)
		var starsScore = Math.floor(100*gStarsGot)
		var levelScore = timeScore+starsScore
		if(gStateDraws == 20 || gStateDraws == 40 || gStateDraws == 60) {
			gAudio.play(gScoreSound)
		}
		if(gStateLoops > 20) {
			glText.draw("Time Score\n[score]"+timeScore, gGameSizeX/2, 90, 1, 1)
		}
		if(gStateLoops > 40) {
			glText.draw("Star Score\n"+gStarsGot+"x100 = [score]"+starsScore, gGameSizeX/2, 135, 1, 1)
		}
		if(gStateLoops > 60) {
			glText.draw("[score]"+levelScore, gGameSizeX/2, 180, 2, 1)
		}
		if(gStateLoops > 80) {
			gCursorSet()
			glText.draw((gin.mobile?"Tap":"Click")+" to continue", gGameSizeX/2, 230, 1, 1, 0xFFFFFF00+40+Math.floor(Math.abs(Math.sin(gLoops*.1)*87)))
			if(gin.clickReleasedDraw) {
				gScore += levelScore
				gLevel++
				gReset()
				if(!gAudio.isPlaying(gPlayMusic)) {
					gAudio.play(gPlayMusic)
				}
				gClickUpSoundPlay()
			}
			if(gin.clickStartedDraw) {
				gClickDownSoundPlay()
			}
		}
	}

	if(gState == 'victory') {
		gl1.drawRect(0, 0, gCanvasSizeX, gCanvasSizeY, 0x33)
		glText.draw("YOU WIN!", gGameSizeX/2, 45, 2, 1)
		glText.draw("The entire ship is\ncleared of aliens!", gGameSizeX/2, 90, 1, 1)
		glText.draw("Final Score:", gGameSizeX/2, 140, 1, 1)
		glText.draw("[score]"+(gScore), gGameSizeX/2, 160, 2, 1)
		if(gScoreSaveLoading) {
			glText.draw("Saving score[...]", gGameSizeX/2, 230, 1, 1)
		} else {
			glText.draw((gin.mobile?"Tap":"Click")+" to continue", gGameSizeX/2, 230, 1, 1, 0xFFFFFF00+40+Math.floor(Math.abs(Math.sin(gLoops*.1)*87)))
			if(gin.clickReleasedDraw) {
				gClickUpSoundPlay()
				gLevel = 1
				gReset()
				gStateSet('title')
			}
		}
		if(gin.clickStartedDraw) {
			gClickDownSoundPlay()
		}
	}

	gl1.imageDraw(gMuted ? gMutedButton: gMuteButton, muteX, muteY+(muteHover && gin.clicking?2:0))
	
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
			gClickUpSoundPlay()
			gReset()
		}
		if(gin.clickStartedDraw && onBox) {
			gClickDownSoundPlay()
		}
	}
	
	gin.clickReleasedDraw = gin.clickStartedDraw = 0

	gl1.render()
	gStateDraws++
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

function gLoadingDotsDraw(x, y, scale, rgb) {
	scale = scale||2
	for(var i=0; i<3; i++) {
		var loops = gLoops/6 % 6
		var a = (-loops+i*1.5)/6*Math.PI*2
		var addy = Math.sin(a)*2
		if(addy>0)addy=0
		glText.draw(".", x+4+i*5*scale, y+addy, scale, 1, rgb)
	}
}

function gAjax(url, func) {
	gLog("gajax", url)
	url = "https://curtastic.com/lazersniper/"+url
	url += "&version="+gAppVersion
		
	//ios10 doesn't support fetch
	var request = new XMLHttpRequest()
	
	request.onreadystatechange = function() {
		if(request.readyState == 4) {
			if(request.status == 200) {
				var text = request.responseText
				func(text)
			} else {
				gLog('ajax status='+request.status+' url='+url, request.statusText)
			}
		}
	}
	request.open("GET", url, true)
	request.send()
	
	return request
}

function gUserClear() {
	gStorageSet('hyplayUsername', '')
	gStorageSet('hyplayUserId', '')
	gStorageSet('hyplayUserToken', '')
}

function gHyplayUserGet(token) {
	gAjax("userGet.php?token="+encodeURIComponent(token), function(text) {
		if(text[0] != '{') {
			gUserClear()
			gLoginError = 1
			alert("Error: "+gLoginError)
			return
		}
		var user = JSON.parse(text)
		if(!user) {
			gUserClear()
			gLoginError = 2
			alert("Error: "+gLoginError)
			return
		}
		if(!user.username) {
			gUserClear()
			gLoginError = 3
			alert("Error: "+gLoginError)
			return
		}
		gStorageSet('hyplayUsername', user.username)
		gStorageSet('hyplayUserId', user.id)
		gStorageSet('hyplayUserToken', token)
		gStateSet('title')
		window.location.hash = ''
	})
}

function gScoreSave() {
	gScoreSaveLoading = 1
	gAjax("scoreSave.php?score="+gScore+"&userId="+gStorageGet('hyplayUserId')+"&userToken="+gStorageGet('hyplayUserToken'), function(text) {
		gScoreSaveLoading = 0
		gScores = u
		gScoresGet()
	})
}

function gScoresGet() {
	gAjax("scoresGet.php?", function(text) {
		if(text[0] != '{') {
			gScoresGetError = 1
			return
		}
		var scores = JSON.parse(text)
		if(!scores) {
			gScoresGetError = 2
			return
		}
		if(scores.totalScores === u) {
			gScoresGetError = 3
			return
		}
		if(!scores.scores || !scores.scores.slice) {
			gScores = []
		} else {
			gScores = scores.scores.slice(0,10)
		}
		gStateLoops = 0
	})
}
var gAlienImages = []
var gAlienDieImages = []
var gAlien2Images = []
var gAlien2DieImages = []
var gAlien2HitImage
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
	gMuted = gStorageGet('muted') == '1'
	
	gCanvas = document.createElement('canvas')
	document.body.appendChild(gCanvas)

	gl1.setup(gCanvas, 'tex.png?29')
	glText.setup()
	glText.iconAdd("score", 0, 437, 15, 18)
	glText.iconAdd("time", 16, 434, 17, 21)
	glText.iconAdd("level", 34, 436, 18, 19)
	glText.iconAdd("...", gLoadingDotsDraw, 0, 10, 16)
	
	for(var i=0;i<4;i++) {
		gAlienImages[i] = gl1.imageMake(i*32,1,32,22)
	}
	for(var i=0;i<7;i++) {
		gAlienDieImages[i] = gl1.imageMake(4*32+i*32,1,32,22)
	}

	for(var i=0;i<4;i++) {
		gAlien2Images[i] = gl1.imageMake(100+i*32,26,32,22)
	}
	for(var i=0;i<7;i++) {
		gAlien2DieImages[i] = gl1.imageMake(100+i*32,26+22,32,23)
	}
	gAlien2HitImage = gl1.imageMake(100,26+22+24,32,23)

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
	if(location.hash) {
		gStateSet('loginLoading')
		gHyplayUserGet(location.hash.substr(1))
	} else {
		if(gStorageGet('hyplayUsername')) {
			gStateSet('title')
		} else {
			gStateSet('login')
		}
	}
	
	gloop.start(gUpdate, gDraw, 60)

	gLoadingDiv.innerHTML += "<br>LOADING GRAPHICS..."

	gScoresGet()

}

function gClickUpSoundPlay() {
	gAudio.play(gClickUpSound, gin.mouseX/gCanvasSizeX)
}

function gClickDownSoundPlay() {
	gAudio.play(gClickDownSound, gin.mouseX/gCanvasSizeX)
}

var gPlayMusic
var gShootSound,gBounceSound,gGuyDieSound,gExplodeSound,gStarSound,gCrateSound,gClickDownSound,gClickUpSound,gScoreSound,gWinSound
function gAudioSetup() {
	gPlayMusic = gAudio.load('play.mp3',1)
	gShootSound = gAudio.load('shoot.wav')
	gBounceSound = gAudio.load('bounce.wav')
	gGuyDieSound = gAudio.load('die2.wav')
	gExplodeSound = gAudio.load('explode.wav')
	gStarSound = gAudio.load('star.mp3')
	gCrateSound = gAudio.load('crate.wav')
	gClickDownSound = gAudio.load('clickDown.wav')
	gClickUpSound = gAudio.load('clickUp.wav')
	gScoreSound = gAudio.load('score.mp3')
	gWinSound = gAudio.load('win.mp3')
	gAudio.setVolume(gPlayMusic, .5)
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

function gStorageGet(key) {
	return gStorage[gStoragePrefix+key] || ''
}

function gStorageSet(key, val) {
	gLog("gstorageset()", key, val)
	gStorage[gStoragePrefix+key] = val
}
