const WIDTH_CANVAS = 640
const HEIGHT_CANVAS = 480

var game = new Phaser.Game(WIDTH_CANVAS, HEIGHT_CANVAS, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render })

function preload() {

  // game.load.spritesheet('gameboy', 'assets/sprites/gameboy_seize_color_40x60.png', 40, 60)
  // game.load.image('atari', 'assets/sprites/atari130xe.png')
  game.load.image('hero1', 'assets/1.png') // BLUE
  game.load.image('hero2', 'assets/2.png') // RED
  game.load.image('hero3', 'assets/3.png') // GREEN
  game.load.image('enemy1', 'assets/18.png') // RED
  game.load.image('enemy2', 'assets/19.png') // GREEN
  game.load.image('enemy3', 'assets/20.png') // BLUE
}

var sprite
var sprite2
var sprite3
var heros
var speed = 4
var velocitySpeed = 150

var RIGHT_KEY = 0
var DOWN_KEY = 1
var LEFT_KEY = 2
var UP_KEY = 3
var PRESS_KEY = 0
var directionHead = 0

var positionCurve = { x: 0, y: 0 }

function create() {

  game.physics.setBoundsToWorld();
  game.physics.startSystem(Phaser.Physics.ARCADE)
  game.stage.backgroundColor = '#124184'

  heros = game.add.group()
  heros.enableBody = true
  heros.physicsBodyType = Phaser.Physics.ARCADE
  heros.checkWorldBounds = true;

  //   var alien = aliens.create(200 + x * 48, y * 50, 'alien');
  hero1 = heros.create(300, 200, 'hero1')
  hero1.name = 'hero1'
  game.physics.enable(hero1, Phaser.Physics.ARCADE)
  hero1.checkWorldBounds = true;
  hero1.events.onOutOfBounds.add(herosOut, this);


  sprite2 = game.add.sprite(350, 400, 'enemy1', 2)
  game.physics.enable(sprite2, Phaser.Physics.ARCADE);


}

function update() {

  game.physics.arcade.overlap(heros, sprite2, collisionHandler, null, this);


  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    if (PRESS_KEY != RIGHT_KEY) {
      PRESS_KEY = LEFT_KEY
    }
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    if (PRESS_KEY != LEFT_KEY) {
      PRESS_KEY = RIGHT_KEY
    }
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
    if (PRESS_KEY != DOWN_KEY) {
      PRESS_KEY = UP_KEY
      for (let i = 0; i < heros.children.length; i++) {
        if (i === 0) {
          continue
        }
        game.physics.arcade.moveToXY(heros.children[i], positionCurve.x, positionCurve.y, velocitySpeed, 1000);
      }
    } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
      if (PRESS_KEY != UP_KEY) {
        PRESS_KEY = DOWN_KEY
      }
    }

    if (PRESS_KEY === LEFT_KEY) {
      // hero1.x -= speed
      // heros.children[0].x -= speed
      // heros.children[0].body.velocity.x = -velocitySpeed
      // heros.children[0].body.velocity.y = 0
      // repositionHeros()
      heros.children.forEach((child, item) => {
          // child.x -= speed\
          child.body.velocity.x = -velocitySpeed
          child.body.velocity.y = 0
        })
        // heros.setAll('body.velocity.x', -speed);
    } else if (PRESS_KEY === RIGHT_KEY) {
      PRESS_KEY = RIGHT_KEY
      heros.children[0].body.velocity.x = +velocitySpeed
      heros.children[0].body.velocity.y = 0
        // heros.children[0].x += speed
        // repositionHeros()
        //   heros.children.forEach((child, item) => {
        //       // child.x += speed
        //       child.body.velocity.x = +velocitySpeed
        //       child.body.velocity.y = 0
        //     })
        // hero1.x += speed
    } else if (PRESS_KEY === UP_KEY) {
      PRESS_KEY = UP_KEY
      positionCurve.x = heros.children[0].x
      positionCurve.y = heros.children[0].y
      heros.children[0].body.velocity.y = -velocitySpeed
      heros.children[0].body.velocity.x = 0
        // heros.children[0].y -= speed
        // repositionHeros()
      heros.children.forEach((child, item) => {
        // child.body.velocity.y = -velocitySpeed
        // child.body.velocity.x = 0
        // child.y -= speed
      })

      // game.physics.arcade.moveToObject(heros.children[i], heros.children[i - 1], velocitySpeed);
    }
    // hero1.y -= speed
  } else if (PRESS_KEY === DOWN_KEY) {
    PRESS_KEY = DOWN_KEY
      // heros.children[0].y += speed
      //heros.children[0].body.velocity.y = +velocitySpeed
      //heros.children[0].body.velocity.x = 0
      // repositionHeros()
    heros.children.forEach((child, item) => {
        child.body.velocity.y = +velocitySpeed
        child.body.velocity.x = 0
          // child.y += speed
      })
      // hero1.y += speed
  }

}

function render() {

  //   game.debug.bodyInfo(sprite, 16, 24)

  // game.debug.body(sprite)
  // game.debug.body(sprite2)

}

function repositionHeros(direction) {
  for (let i = 0; i < heros.children.length; i++) {
    if (i === 0) {
      continue
    }
    // game.physics.arcade.moveToObject(heros.children[i], heros.children[i - 1], velocitySpeed);
  }

  //   heros.forEach(game.physics.arcade.moveToPointer, game.physics.arcade, false, 200);
  // if(direction === RIGHT_KEY) {
  //     heros.children.forEach(child => {
  //         child.y += speed
  //     })
  // }
}

function herosOut(hero) {
  if (hero.x < 0) {
    // heros.children.forEach((child, index) => {
    //   child.reset(WIDTH_CANVAS, child.y);
    // })
    hero.reset(WIDTH_CANVAS, hero.y);
  } else if (hero.x > WIDTH_CANVAS) {
    // heros.children.forEach((child, index) => {
    //     child.reset(0, child.y);
    //   })
    hero.reset(0, hero.y);
  } else if (hero.y < 0) {
    // heros.children.forEach((child, index) => {
    //     child.reset(hero.x, HEIGHT_CANVAS);
    //   })
    hero.reset(hero.x, HEIGHT_CANVAS);
  } else if (hero.y > HEIGHT_CANVAS) {
    // heros.children.forEach((child, index) => {
    //     child.reset(child.x, 0);
    //   })
    hero.reset(hero.x, 0);
  }
  //  Move the alien to the top of the screen again

}

function collisionHandler(enemy, hero) {
  enemy.kill()

  const xPos = Math.floor(Math.random() * WIDTH_CANVAS)
  const yPos = Math.floor(Math.random() * HEIGHT_CANVAS)
  sprite2 = game.add.sprite(xPos, yPos, 'enemy1', 2)
  game.physics.enable(sprite2, Phaser.Physics.ARCADE);
  addChildHeros()
}

function addChildHeros() {
  var lastHero = heros.children[heros.children.length - 1]
  var newHero
  if (PRESS_KEY === RIGHT_KEY) {
    newHero = heros.create(lastHero.x - 30, lastHero.y, 'hero2')
  } else if (PRESS_KEY === LEFT_KEY) {
    newHero = heros.create(lastHero.x + 30, lastHero.y, 'hero2')
  } else if (PRESS_KEY === UP_KEY) {
    newHero = heros.create(lastHero.x, lastHero.y + 30, 'hero2')
  } else if (PRESS_KEY === DOWN_KEY) {
    newHero = heros.create(lastHero.x, lastHero.y - 30, 'hero2')
  }
  newHero.checkWorldBounds = true;
  newHero.events.onOutOfBounds.add(herosOut, this);

}