const WIDTH_CANVAS = 640
const HEIGHT_CANVAS = 480

const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

const RED = 0;
const GREEN = 1;
const BLUE = 2;

let config = {
  type: Phaser.AUTO,
  width: WIDTH_CANVAS,
  height: HEIGHT_CANVAS,
  backgroundColor: '#bfcc00',
  parent: 'phaser-example',
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  physics: {
    default: "matter",
    matter: {
      // debug: true
    }
  }
};

let hero
let enemy
let cursors
let totalScore = 0
let alive = true
let endText
let scoreTxt

let game = new Phaser.Game(config);
let distanceGap = 14


function preload() {
  this.load.image('hero', 'assets/hero.png')
  this.load.image('hero1', 'assets/1.png') // BLUE
  this.load.image('hero2', 'assets/2.png') // RED
  this.load.image('hero3', 'assets/3.png') // GREEN
  this.load.image('hero4', 'assets/4.png')
  this.load.image('hero5', 'assets/5.png')
  this.load.image('enemy1', 'assets/18.png') // RED
  this.load.image('enemy2', 'assets/19.png') // GREEN
  this.load.image('enemy3', 'assets/20.png') // BLUE
  this.load.image('enemy4', 'assets/21.png')
  this.load.image('enemy5', 'assets/22.png')
}

function create() {
  scoreTxt = this.add.text(0, 0, `Score: ${totalScore}`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
  endText = this.add.text(WIDTH_CANVAS / 3, HEIGHT_CANVAS - 400, ``, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
  this.triggeredEnemy = false

  let Enemy = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize: function Enemy(scene) {
      const xPos = Math.floor(Math.random() * WIDTH_CANVAS / distanceGap);
      const yPos = Math.floor(Math.random() * HEIGHT_CANVAS / distanceGap);
      Phaser.GameObjects.Image.call(this, scene)
      this.spawnEnemy(scene, xPos, yPos)
        // this.total = 0
    },

    eat: function() {
      this.total++
    },

    spawnEnemy: function(scene, x, y) {
      console.log(x)
      console.log(y)
      console.log(this)
      const colorRandom = Math.floor(Math.random() * 2);
      if (colorRandom === RED) {
        this.setTexture('enemy1')
      } else if (colorRandom === GREEN) {
        this.setTexture('enemy2')
      } else if (colorRandom === BLUE) {
        this.setTexture('enemy3')
      }

      this.setPosition(x * distanceGap, y * distanceGap)
      this.setOrigin(0)
      scene.children.add(this)
    }

  });

  let Hero = new Phaser.Class({

    initialize:

      function Hero(scene, x, y) {
      this.headPosition = new Phaser.Geom.Point(x, y)
      this.heros = scene.add.group()
      this.head = this.heros.create(x * distanceGap, y * distanceGap, 'hero1')
        // this.heros.create(50 * distanceGap, 50 * distanceGap, 'hero2')
        // this.heros.create(100, 50, 'hero3')
        // this.heros.create(150, 50, 'hero4')
        // this.heros.create(200, 50, 'hero5')
      this.head.setOrigin(0)
      this.speed = 100
      this.moveTime = 0
      this.tail = new Phaser.Geom.Point(x, y)
      this.heading = RIGHT
      this.direction = RIGHT
    },

    update: function(time) {
      if (time >= this.moveTime) {
        return this.move(time);
      }
    },

    faceLeft: function() {
      if (this.direction === UP || this.direction === DOWN) {
        this.heading = LEFT;
      }
    },

    faceRight: function() {
      if (this.direction === UP || this.direction === DOWN) {
        this.heading = RIGHT;
      }
    },

    faceUp: function() {
      if (this.direction === LEFT || this.direction === RIGHT) {
        this.heading = UP;
      }
    },

    faceDown: function() {
      if (this.direction === LEFT || this.direction === RIGHT) {
        this.heading = DOWN;
      }
    },

    move: function(time) {
      switch (this.heading) {
        case LEFT:
          this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, WIDTH_CANVAS / distanceGap);
          break
        case RIGHT:
          this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, WIDTH_CANVAS / distanceGap)
          break
        case UP:
          this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, HEIGHT_CANVAS / distanceGap)
          break
        case DOWN:
          this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, HEIGHT_CANVAS / distanceGap)
          break
      }
      let a = Phaser.Actions.ShiftPosition(this.heros.getChildren(), this.headPosition.x * distanceGap, this.headPosition.y * distanceGap, 1, this.tail);
      // Phaser.Actions.ShiftPosition(this.body.getChildren(), this.headPosition.x * 16, this.headPosition.y * 16, 1, this.tail);

      // console.log(a)
      // var hitBody = Phaser.Actions.GetFirst(this.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

      this.direction = this.heading;
      this.moveTime = time + this.speed;
      return true;
    },

    grow: function() {
      let newPart = this.heros.create(this.tail.x, this.tail.y, 'hero2');
      newPart.setOrigin(0);
    },

    fightEnemy: function(enemy) {
      if (!this.triggeredEnemy) {
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.heros.getChildren()[0].getBounds(), enemy.getBounds())) {
          console.log("Fight !")
          this.triggeredEnemy = true
          this.fightCalculation(this.heros.getChildren()[0], enemy)
          return true
        } else {
          return false
        }
      }

      // if (this.head.x === enemy.x && this.head.y === enemy.y) {
      //   this.grow()
      //   enemy.eat()

      //   return true
      // } else {
      //   return false
      // }
    },

    spawnHero: function() {
      const colorRandom = Math.floor(Math.random() * 2);
      if (colorRandom === RED) {
        console.log("Spawn Hero Red")
      } else if (colorRandom === GREEN) {
        console.log("Spawn Hero Green")
      } else if (colorRandom === BLUE) {
        console.log("Spawn Hero Blue")
      }
    },

    fightCalculation: function(hero, enemy) {
      const keyHero = hero.texture.key
      const keyEnemy = enemy.texture.key
      if (keyHero === "hero1" && keyEnemy === "enemy1") {
        // win/
        this.youWin(enemy)
      } else if (keyHero === "hero1" && keyEnemy === "enemy2") {
        this.youLose()
          // lose
      } else if (keyHero === "hero1" && keyEnemy === "enemy3") {
        // draw
      } else if (keyHero === "hero2" && keyEnemy === "enemy1") {
        // draw
      } else if (keyHero === "hero2" && keyEnemy === "enemy2") {
        this.youWin(enemy)
          // win
      } else if (keyHero === "hero2" && keyEnemy === "enemy3") {
        // lose
      } else if (keyHero === "hero3" && keyEnemy === "enemy1") {
        // lose
      } else if (keyHero === "hero3" && keyEnemy === "enemy2") {
        // draw
      } else if (keyHero === "hero3" && keyEnemy === "enemy3") {
        this.youWin(enemy)
          // win
      } else {
        console.log("No condition")
      }
      //   แดง ชนะ เขียว
      // - เขียว ชนะ นํา้เงนิ
      // - นํา้เงนิ ชนะ แดง
    },
    youLose: function() {
      console.log("lose")
      const heros = this.heros.getChildren()
      if (heros.length === 1) {
        EndGame()
      }
    },
    youWin: function(enemy) {
      enemy.destroy()
      this.triggeredEnemy = false
      console.log("win")
      totalScore += 1
      this.speed -= 1
      scoreTxt.setText(`Score: ${totalScore}`)
      this.grow()
    }

  });

  enemy = new Enemy(this)
  hero = new Hero(this, 8, 8)

  cursors = this.input.keyboard.createCursorKeys();
}

function update(time, delta) {
  if (!alive) {
    return
  }

  if (cursors.left.isDown) {
    hero.faceLeft()
  } else if (cursors.right.isDown) {
    hero.faceRight()
  } else if (cursors.up.isDown) {
    hero.faceUp()
  } else if (cursors.down.isDown) {
    hero.faceDown()
  }

  if (hero.update(time)) {
    if (hero.fightEnemy(enemy)) {
      const xPos = Math.floor(Math.random() * WIDTH_CANVAS / distanceGap);
      const yPos = Math.floor(Math.random() * HEIGHT_CANVAS / distanceGap);
      enemy.setPosition(xPos * distanceGap, yPos * distanceGap)
      enemy.setOrigin(0)
    }
  }
}

function EndGame() {
  alive = false
  endText.setText(`End Game Score : ${totalScore}`)
}