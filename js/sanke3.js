const WIDTH_CANVAS = 628
const HEIGHT_CANVAS = 452
var game = new Phaser.Game(WIDTH_CANVAS, HEIGHT_CANVAS, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

var G
var grounds
var heros
var enemies
let endText
var enemiesCount = 0
var roninsCount = 0
var RIGHT_KEY = 0
var DOWN_KEY = 1
var LEFT_KEY = 2
var UP_KEY = 3
var headDirection = 0
var alive = true

var ROW_GRID = 18
var COL_GRID = 13
var SPEED = 1000

var totalScore = 0

var gridPos = []
var headingPos = {
  "row": 0,
  "col": 0
}

var heroMoveTime


function preload() {
  game.load.image('ground', 'assets/ground.png');
  game.load.image('hero1', 'assets/1.png') // BLUE
  game.load.image('hero2', 'assets/2.png') // RED
  game.load.image('hero3', 'assets/3.png') // GREEN
  game.load.image('enemy1', 'assets/18.png') // RED
  game.load.image('enemy2', 'assets/19.png') // GREEN
  game.load.image('enemy3', 'assets/20.png') // BLUE
}
// create group
function create() {
  grounds = game.add.group()
  heros = game.add.group()
  ronins = game.add.group()
  enemies = game.add.group()

  // create a sprite that be reuse with the grid
  function drawGround() {
    var sprite = game.add.sprite(0, 0, 'ground')
    sprite.width = 30
    sprite.height = 30
    return sprite
  }

  // create a grid 
  G = []
  for (var row = 0; row < ROW_GRID; row++) {
    G[row] = []
    for (var col = 0; col < COL_GRID; col++) {
      G[row][col] = drawGround()
      G[row][col].x = row * 35
      G[row][col].y = col * 35
      grounds.add(G[row][col])
    }
  }

  //move the group here and the grid
  grounds.x = 0
  grounds.y = 0

  // init position
  for (var row = 0; row < ROW_GRID; row++) {
    gridPos[row] = []
    for (var col = 0; col < COL_GRID; col++) {
      data = {
        "x": row * 35,
        "y": col * 35,
        "chessType": "",
        "obj": null
      }
      gridPos[row][col] = data
    }
  }

  // init hero
  var hero = heros.create(82, 82, 'hero1')
  hero.width = 30
  hero.height = 30
  hero.name = "hero"
  addChessToGrid(hero, 0, 0)

  heroMoveTime = game.time.events.loop(SPEED, moveHeros, this)

  timerSpwan = game.time.create(false)
  timerSpwan.loop(500, SpawnChess, this)
  timerSpwan.start()
  scoreTxt = this.add.text(0, 0, `Score: ${totalScore}`, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fill: "#ffffff", font: '18px courier' })
  endText = this.add.text(WIDTH_CANVAS / 3, HEIGHT_CANVAS - 300, ``, { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif', fill: "#fff", font: '28px courier' })
}

function update() {
  if (!alive) return true
  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    if (headDirection != RIGHT_KEY) {
      headDirection = LEFT_KEY
    }
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    if (headDirection != LEFT_KEY) {
      headDirection = RIGHT_KEY
    }
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
    if (headDirection != DOWN_KEY) {
      headDirection = UP_KEY
    }
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
    if (headDirection != UP_KEY) {
      headDirection = DOWN_KEY
    }
  }
}

function moveHeros() {
  if (!alive) return true
  if (headDirection === RIGHT_KEY) {
    heros.children.forEach((child, item) => {
      if (headingPos.row >= ROW_GRID - 1) {
        headingPos.row = -1
      }
      headingPos.row += 1
      ColliderHeading(headingPos.row, headingPos.col)
      addChessToGrid(child, headingPos.row, headingPos.col)
    })
  } else if (headDirection === DOWN_KEY) {
    heros.children.forEach((child, item) => {
      if (headingPos.col >= COL_GRID - 1) {
        headingPos.col = -1
      }
      headingPos.col += 1
      ColliderHeading(headingPos.row, headingPos.col)
      addChessToGrid(child, headingPos.row, headingPos.col)
    })
  } else if (headDirection === LEFT_KEY) {
    heros.children.forEach((child, item) => {
      if (headingPos.row <= 0) {
        headingPos.row = ROW_GRID
      }
      headingPos.row -= 1
      ColliderHeading(headingPos.row, headingPos.col)
      addChessToGrid(child, headingPos.row, headingPos.col)
    })
  } else if (headDirection === UP_KEY) {
    heros.children.forEach((child, item) => {
      if (headingPos.col <= 0) {
        headingPos.col = COL_GRID
      }
      headingPos.col -= 1
      ColliderHeading(headingPos.row, headingPos.col)
      addChessToGrid(child, headingPos.row, headingPos.col)
    })
  }
}

function SpawnChess() {
  if (!alive) return true
  const row = Math.floor(Math.random() * (ROW_GRID - 1))
  const col = Math.floor(Math.random() * (COL_GRID - 1))

  let valiadateGrid = validateGridLocation(row, col)
  if (!valiadateGrid) {
    return
  }

  const typeChess = Math.floor(Math.random() * 1) // 2 for hero
  if (typeChess === 0) {
    randomSpawnEnemy(row, col)
  } else if (typeChess === 1) {
    randomSpawnHero(row, col)
  }

}

function ColliderHeading(row, col) {
  if (gridPos[headingPos.row][headingPos.col].chessType == "enemy") {
    let resultCombat = combatSystem(gridPos[headingPos.row][headingPos.col].obj)
    if (resultCombat === 1) {
      enemies.remove(gridPos[headingPos.row][headingPos.col].obj, true)
      totalScore++
      if (SPEED >= 200) {
        SPEED -= 100
        heroMoveTime.delay -= 100;
      }
      scoreTxt.setText(`Score: ${totalScore}`)
    } else if (resultCombat === 2) {
      heros.remove(heros.children[0], true)
    } else if (resultCombat === 3) {
      enemies.remove(gridPos[headingPos.row][headingPos.col].obj, true)
      heros.remove(heros.children[0], true)
    }
  } else if (gridPos[headingPos.row][headingPos.col].chessType == "ronin") {
    // var ronin = gridPos[headingPos.row][headingPos.col].obj
    // ronins.remove(ronin, true)
    // var hero = heros.create(82, 82, ronin.key)
    // hero.width = 30
    // hero.height = 30
    // hero.name = "hero"
    // hero.number = herosCount
  }

  if (heros.children.length == 0) {
    EndGame()
  }
}

function addChessToGrid(chess, row, col) {
  chess.x = gridPos[row][col].x
  chess.y = gridPos[row][col].y
  gridPos[row][col].chessType = chess.name
  gridPos[row][col].obj = chess
}

function addNewHero(hero) {
  if (headDirection === RIGHT_KEY) {
    var row = headingPos.row
    var col = headingPos.col
    if (headingPos.row - 1 < 0) {
      row = ROW_GRID - 1
      addChessToGrid(hero, row, col)
    }
  }
}

function validateGridLocation(row, col) {
  let currentGrid = gridPos[row][col]
  if (currentGrid.obj != null) {
    return false
  }
  return true
}

function combatSystem(enemy) {
  const keyHero = heros.children[0].key
  const keyEnemy = enemy.key
  if (keyHero === "hero1" && keyEnemy === "enemy1") {
    return 1
  } else if (keyHero === "hero1" && keyEnemy === "enemy2") {
    return 2
  } else if (keyHero === "hero1" && keyEnemy === "enemy3") {
    return 3
  }
}

function randomSpawnEnemy(row, col) {
  const enemyType = Math.floor(Math.random() * 3)
  let enemyTxt = "enemy1"
  if (enemyType === 0) {
    enemyTxt = "enemy1"
  } else if (enemyType === 1) {
    enemyTxt = "enemy2"
  } else if (enemyType === 2) {
    enemyTxt = "enemy3"
  }
  var enemy = enemies.create(82, 82, enemyTxt)
  enemiesCount++
  enemy.width = 30
  enemy.height = 30
  enemy.name = "enemy"
  enemy.number = enemiesCount
  addChessToGrid(enemy, row, col)
}

function randomSpawnHero(row, col) {
  const roninType = Math.floor(Math.random() * 3)
  let roninTxt = "hero1"
  if (roninType === 0) {
    roninTxt = "hero1"
  } else if (roninType === 1) {
    roninTxt = "hero2"
  } else if (roninType === 2) {
    roninTxt = "hero3"
  }
  var ronin = ronins.create(82, 82, roninTxt)
  roninsCount++
  ronin.width = 30
  ronin.height = 30
  ronin.name = "ronin"
  ronin.number = roninsCount
  addChessToGrid(ronin, row, col)
}

function EndGame() {
  alive = false
  endText.setText(`End Game Score : ${totalScore}`)
}