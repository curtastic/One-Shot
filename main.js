var gGameX,gGameY,
	gGameSizeX=375,gGameSizeY=620,
	gScreenSizeX,gScreenSizeY,
	gCanvas,gPen,
	gGuys,gYou,
	gGravity=.2,
	gHits,
	gStarsGot,
	gState,
	gLog=console.log.bind(console),
	u

function gStateSet(state) {
	gLog(`gStateSet() from ${gState} to ${state}`)
	gState = state
}

function gReset() {
	gGuys = []
	gGuyMake('star',170,350,20,20)
	gGuyMake('bomb',220,150,40,40)
	gGuyMake('guy',170,44,44,44)
	gGuyMake('guy',170,244,44,44)
	gGuyMake('wall',0,111-2,100,30+2*2)
	gGuyMake('wall',gGameSizeX-100,111-2,100,30+2*2)
	var wall = gGuyMake('wall',102,111,gGameSizeX-204,30)
	wall.hp = 2
	var pad = 30
	gGuyMake('wall',-999,-999,999+pad,9999)
	gGuyMake('wall',gGameSizeX-pad,-999,999,9999)
	gGuyMake('wall',-999,-999,9999,999)
	gGuyMake('wall',-999,gGameSizeY,9999,999)
	gYou = gGuyMake('ball',-99999,22,8,22)
	gHits = 0
	gStarsGot = 0
	gStateSet('input')
}

function gGuyMake(kind,x,y,sizeX,sizeY) {
	var guy = {kind,x,y,sizeX,sizeY,speedX:0,speedY:0,hp:9999}
	if(kind=='bomb')guy.hp=1
	if(kind=='star')guy.hp=0
	gGuys.push(guy)
	return guy
}

function gGuyHitGuy(guy) {
	for(var guy2 of gGuys) {
		if(guy2 != guy) {
			if(gRectsHit(guy.x, guy.y, guy.sizeX/2, guy.sizeY, guy2)) {
				if(guy2.kind == 'guy') {
					if(!guy2.got) {
						guy2.got = 1
						var done = 1
						for(var guy3 of gGuys) {
							if(guy3.kind == 'guy' && !guy3.got) {
								done = 0
							}
						}
						if(done) {
							gStateSet('win')
						}
					}
				} else {
					if(guy2.kind == 'star') {
						guy2.dead = 1
						gStarsGot++
					} else {
						gHits++
						guy2.hp--
						if(guy2.hp < 1) {
							guy2.hp = 0
							guy2.dead = 1
						}
						return guy2
					}
				}
			}
		}
	}
}

function gBombGo(guy) {
	for(var guy2 of gGuys) {
		if(guy2 != guy && guy2 != gYou && guy2.hp < 3) {
			if(gRectsHit(guy.x-guy.sizeX, guy.y-guy.sizeY, guy.sizeX*3, guy.sizeY*3, guy2)) {
				guy2.hp = 0
				guy2.dead = 1
			}
		}
	}
}

function gUpdate() {
	for(var guy of gGuys) {
		if(guy.dead) {
			if(guy.kind == 'bomb') {
				gBombGo(guy)
			}
			gArrayRemove(gGuys, guy)
		}
	}
	
	for(var guy of gGuys) {
		if(guy.dead) {
			continue
		}
		if(guy.kind == 'ball') {
			if(gState == 'go') {
				var old = guy.x
				guy.x += guy.speedX
				if(gGuyHitGuy(guy)) {
					guy.x = old
					guy.speedX =- guy.speedX
				}
				var old = guy.y
				guy.y += guy.speedY
				if(gGuyHitGuy(guy)) {
					guy.y = old
					guy.speedY =- guy.speedY
				}
			}
		}
		if(guy.got) {
			guy.got++
			if(guy.got > 10) {
				gArrayRemove(gGuys, guy)
			}
		}
		/*
		guy.speedY += gGravity
		if(guy.y>333) {
			guy.y = 333
			guy.speedY = 0
		}
		*/
	}
	
	if(gin.clickReleased) {
		gin.clickReleasedDraw = gin.clickReleased
	}
	gin.update()
}

function gDraw() {
	gPen.fillStyle = '#111'
	gPen.fillRect(0, 0, gScreenSizeX, gScreenSizeY)

	gPen.save()
	gPen.translate(gGameX,gGameY)
	
	for(var guy of gGuys) {
		if(guy.kind == 'star') {
			gPen.fillStyle = '#FF0'
			var add = guy.dead ? 1 : 0
			gPen.fillRect(guy.x-add, guy.y-add, guy.sizeX+add*2, guy.sizeY+add*2)
			gPen.fillText('⭐', guy.x+guy.sizeX/2, guy.y+guy.sizeY/2)
		} else if(guy.kind == 'bomb') {
			gPen.fillStyle = guy.dead ? '#FFB' : '#F99'
			var add = guy.dead ? guy.sizeX : 0
			gPen.fillRect(guy.x-add, guy.y-add, guy.sizeX+add*2, guy.sizeY+add*2)
			gPen.fillText('💣', guy.x+guy.sizeX/2, guy.y+guy.sizeY/2)
		} else if(guy.kind == 'wall') {
			gPen.fillStyle = '#999'
			if(guy.hp < 3)
				gPen.fillStyle = '#D73'
			gPen.fillRect(guy.x, guy.y, guy.sizeX, guy.sizeY)
			if(guy.hp < 2) {
				gPen.strokeStyle = '#000'
				for(var i=0; i<30; i++) {
					if(i%3>0) {
						x+=addX
						y+=addX
					} else {
						var x = guy.x+gRandomFake(i+33)*(guy.sizeX-20)+10
						var y = guy.y+gRandomFake(i*2+99)*(guy.sizeY-20)+10
					}
					var addX = (gRandomFake(i+155)-.5)*20
					var addY = (gRandomFake(i+255)-.5)*20
					gLineDraw(x,y,x+addX,y+addY)
				}
			} else if(guy.hp > 2) {
				gPen.fillStyle = '#777'
				for(var i=0; i<guy.sizeX*.1; i++) {
					var x = guy.x+gRandomFake(i+33)*(guy.sizeX-20)+5
					var y = guy.y+gRandomFake(i*2+99)*(guy.sizeY-10)+3
					var sizeX = 9+gRandomFake(i+155)*3
					var sizeY = 4+gRandomFake(i+255)*2
					gPen.fillRect(x,y,sizeX,sizeY)
				}
			}
		} else if(guy.kind == 'ball') {
			gPen.fillStyle = gPen.strokeStyle = '#33F'
			var angle = gAngleTo(0,0,guy.speedX,guy.speedY)
			var x = guy.x+guy.sizeX/2
			var y = guy.y+guy.sizeX/2
			gLineDraw(x, y, x-Math.cos(angle)*guy.sizeY, y-Math.sin(angle)*guy.sizeY, guy.sizeX)
			//gCircleDraw(x+size/2, y+size/2, size/2)
			//gBallDraw(guy.x, guy.y, guy.speedX, guy.speedY, guy.sizeX)
			gPen.fillStyle = gPen.strokeStyle = '#57F'
			gPen.fillRect(guy.x,guy.y,guy.sizeX,guy.sizeX)
		} else {
			gPen.fillStyle = '#0F0'
			if(guy.got) {
				gPen.globalAlpha = 1-guy.got/11
			}
			gPen.fillRect(guy.x, guy.y, guy.sizeX, guy.sizeY)
			gPen.fillText('👽', guy.x+guy.sizeX/2, guy.y+guy.sizeY/2)
			gPen.globalAlpha = 1
		}
		
	}
	
	gPen.restore()
	if(gState == 'input' || gState == 'aim') {
		if((gin.clicking && gin.clicking.dragWay) || gin.clickReleasedDraw) {

			if(gState != 'aim') {
				gStateSet('aim')
			}
			
			var size = gYou.sizeX
			gYou.x = gin.clickStartX-gGameX-size/2
			gYou.y = gin.clickStartY-gGameY-size/2
			//gPen.fillStyle = '#F00'
			//gCircleDraw(gin.clickStartX+size/2, gin.clickStartY+size/2, size/2)
	
			var angle = gAngleTo(gin.clickStartX, gin.clickStartY, gin.mouseX, gin.mouseY)
			
			gYou.speedX = Math.cos(angle)
			gYou.speedY = Math.sin(angle)
			
			gPen.strokeStyle = '#FF0'
			gLineDraw(gin.clickStartX+Math.cos(angle)*size/2, gin.clickStartY+Math.sin(angle)*size/2, gin.mouseX, gin.mouseY,5)
			if(gin.clickReleasedDraw) {
				gYou.x = gin.clickStartX - gGameX-size/2
				gYou.y = gin.clickStartY - gGameY-size/2
				var speed = 9
				gYou.speedX = -Math.cos(angle) * speed
				gYou.speedY = -Math.sin(angle) * speed
				gStateSet('go')
			}
		}
	}

	gPen.fillStyle = '#FF0'
	gPen.font = '20px arial'
	gPen.fillText("Bounces: "+gHits, gScreenSizeX/2, 20)

	if(gState == 'win') {
		gPen.fillText("You win!", gScreenSizeX/2, 45)
		var hitsScore = Math.floor(1000/gHits)
		var starsScore = Math.floor(100*gStarsGot)
		gPen.fillText("Bounce Score: 1000÷"+gHits+" = 🏆"+hitsScore, gScreenSizeX/2, 70)
		gPen.fillText("Star Score: 100×"+gStarsGot+" = 🏆"+starsScore, gScreenSizeX/2, 95)
		gPen.font = '36px arial'
		gPen.fillText("🏆"+(hitsScore+starsScore), gScreenSizeX/2, 135)
		gPen.font = '20px arial'
	}
	
	gin.clickReleasedDraw = 0
	
		/*
		gPen.save()
		gPen.translate(gin.clickStartX, gin.clickStartY)
		gPen.rotate(gAngleTo())
		gPen.fillRect(0, 0, 33, 7)
		gPen.restore()
		*/
	/*
	var bodies = Composite.allBodies(engine.world)
	
	gPen.fillStyle = '#fff'
	gPen.fillRect(0, 0, gCanvas.width, gCanvas.height)

	gPen.beginPath()

	for(var body of bodies) {
		var vertices = body.vertices

		gPen.moveTo(vertices[0].x, vertices[0].y)

		for(var v of vertices) {
			gPen.lineTo(v.x, v.y)
		}

		gPen.lineTo(vertices[0].x, vertices[0].y)
	}

	gPen.lineWidth = 1
	gPen.strokeStyle = '#999'
	gPen.stroke()
	*/
}

function gResize(recur) {
	gScreenSizeX = innerWidth
	gScreenSizeY = innerHeight
	gCanvas.setAttribute('width',gScreenSizeX)
	gCanvas.setAttribute('height',gScreenSizeY)
	gCanvas.style.width = gScreenSizeX+'px'
	gCanvas.style.height = gScreenSizeY+'px'
	
	gGameX = (gScreenSizeX - gGameSizeX) >> 1
	gGameY = (gScreenSizeY - gGameSizeY) >> 1
	
	scrollTo(0,0)
	if(!recur) {
		setTimeout(() => scrollTo(0,0), 999)
		setTimeout(() => gResize(1), 111)
	}
	gPen = gCanvas.getContext('2d')
	gPen.textAlign = 'center'
	gPen.textBaseline = 'middle'
}

window.onload = () => {
	gCanvas = document.createElement('canvas')
	document.body.appendChild(gCanvas)
	window.onresize = gResize
	gResize()
	
	gReset()
	
	gloop.start(gUpdate, gDraw, 60)
	
}

function gAngleTo(x, y, targetX, targetY) {
	var angle = Math.atan2(targetY-y, targetX-x)
	return angle
}

function gCircleDraw(x, y, r) {
	gPen.beginPath()
	gPen.arc(x, y, r, 0, 2*Math.PI)
	gPen.fill()
}

function gLineDraw(x1,y1,x2,y2,thickness) {
	gPen.lineCap = 'butt'
	gPen.beginPath()
	gPen.lineWidth = thickness||1
	gPen.moveTo(x1,y1)
	gPen.lineTo(x2,y2)
	gPen.stroke()
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

/*
// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite

// create an engine
var engine = Engine.create()

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine
})

// create two boxes and a ground
var boxA = Bodies.rectangle(400, 200, 80, 80)
var boxB = Bodies.rectangle(420, 0, 80, 80)
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })

// add all of the bodies to the world
Composite.add(engine.world, [boxA, boxB, ground])

// run the renderer
Render.run(render)

// create runner
var runner = Runner.create()

// run the engine
Runner.run(runner, engine)
*/
