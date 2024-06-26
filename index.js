// Context Canvas Größen 

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576
const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height / 4,
}


// Collision Block Objekt erstellen

const floorCollisions2D = []
for (let i = 0; i < floorCollisions.length; i += 36) {
    floorCollisions2D.push(floorCollisions.slice(i, i + 36))
}

const collisionBlocks = []
floorCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if(symbol === 202 ) {
            console.log('collision block!')
            collisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16,
                    },
                })
            )
        }
    })
})

const platformCollisions2D = []
for (let i = 0; i < platformCollisions.length; i += 36) {
    platformCollisions2D.push(platformCollisions.slice(i, i + 36))
}

const platformCollisionBlocks = []
platformCollisions2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if(symbol === 202 ) {
            platformCollisionBlocks.push(
                new CollisionBlock({
                    position: {
                        x: x * 16,
                        y: y * 16,
                    },
                    height: 4,
                })
            )
        }
    })
})


const gravity = 0.4

// Player Objekt erstellen

const player = new Player({ 
    position: {
        x: 100,
        y: 300,
    },

    // collisionblocks und platformcollisionblocks

    collisionBlocks,
    platformCollisionBlocks,

     // Animationen und animationenwechsel
    imageSrc: './img/warrior/Idle.png',
    frameRate: 8,
    animations: {
        Idle: {
            imageSrc: './img/warrior/Idle.png',
            frameRate: 8,
            frameBuffer: 4
        },
        IdleLeft: {
            imageSrc: './img/warrior/IdleLeft.png',
            frameRate: 8,
            frameBuffer: 4
        },
        Run: {
            imageSrc: './img/warrior/Run.png',
            frameRate: 8,
            frameBuffer: 5
        },
        RunLeft: {
            imageSrc: './img/warrior/RunLeft.png',
            frameRate: 8,
            frameBuffer: 5
        },
        Jump: {
            imageSrc: './img/warrior/Jump.png',
            frameRate: 2,
            frameBuffer: 5
        },
        JumpLeft: {
            imageSrc: './img/warrior/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 5
        },
        Fall: {
            imageSrc: './img/warrior/Fall.png',
            frameRate: 2,
            frameBuffer: 5
        },
        FallLeft: {
            imageSrc: './img/warrior/FallLeft.png',
            frameRate: 2,
            frameBuffer: 5
        },
    },
})

// check ob tasten gedrückt sind

const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    }
}

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: './img/background.png',
})

const backgroundImageHeight = 432

const camera = {
    position: {
        x: 0,
        y: -432 + scaledCanvas.height,
    },
}
// Animation Loop Player Box

function animate() {
    window.requestAnimationFrame(animate)

    // Canvas Background refresh
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.save()
    context.scale(4, 4)
    context.translate(camera.position.x, camera.position.y)
    background.update()
    // collisionBlocks.forEach((collisionBlock) => {
    //     collisionBlock.update()
    // })

    // platformCollisionBlocks.forEach((block) => {
    //     block.update()
    // })

    player.checkForHorizontalCanvasCollision()
    player.update()

    // Spieler Velocity und Switchsprite nach letzter richtung 

    player.velocity.x = 0
    if(keys.d.pressed) {
        player.switchSprite('Run')
        player.velocity.x = 2
        player.lastDirection = 'right'
        player.shouldPanCameraToTheLeft({ canvas, camera })
    }   else if (keys.a.pressed) {
        player.switchSprite ('RunLeft')
        player.velocity.x = -2
        player.lastDirection = 'left'
        player.shouldPanCameraToTheRight({ canvas, camera })
    }   else if (player.velocity.y === 0) {

        if (player.lastDirection === 'right') player.switchSprite('Idle')
            else player.switchSprite('IdleLeft')
    }

    if (player.velocity.y < 0) {
        player.shouldPanCameraToTheDown({ canvas, camera })
        if (player.lastDirection === 'right') player.switchSprite('Jump')
        else player.switchSprite('JumpLeft')
    }   else if (player.velocity.y > 0) {
        player.shouldPanCameraToTheUp({ canvas, camera })
        if (player.lastDirection === 'right') player.switchSprite('Fall')
        else player.switchSprite('FallLeft')
    }

    context.restore()
}

animate()

// Player Movement

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            break
        case 'a':
            keys.a.pressed = true
            break
        case 'w':
            player.velocity.y = -7
            break
        case ' ':
            player.velocity.y = -7
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }
})