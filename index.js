var Raphael = require('raphael')
var body = document.querySelector('body')
var container = document.createElement('p')
body.appendChild(container)

// Parameters
var height = 600
var width = 800
var startingOffset = 30
var carSpeed = 2
var lineHeight = height / 2
var totalLife = 5000
function decideTurnAngle(car) {
  if (car.y < lineHeight) {
    return 1
  } else {
    return -1
  }
}


//////////////////////////////////
// PRIVATE INTERNAL LOGIC ZONE////
/////// DO NOT ENTER!!!!!!!///////
//////////////////////////////////
var lifeRemaining = totalLife
var paper = Raphael(0, 0, width, height)

var centerLine = paper.rect(0, height / 2, width, 2)

var car = {
  x: 0,
  y: (height / 2) + startingOffset,
  getX: function() {
    this.x = this.shape.getBBox().x
    return this.x
  },
  getY: function() {
    this.y = this.shape.getBBox().y
    return this.y
  },
  update: function() {
    this.getX()
    this.getY()
  },
}
car.shape = paper.rect(car.x, car.y, 20, 10)
car.shape.attr('fill', '#FF0000')


window.requestAnimationFrame(run)
function run() {

  car.update()
  updateScore(car)
  var turnAngle = decideTurnAngle(car)
  if (turnAngle > 45) {
    turnAngle = 45
  } else if (turnAngle < -45) {
    turnAngle = -45
  }

  car.shape.rotate(turnAngle)
  car.shape.translate(carSpeed)

  var x = car.getX()
  var y = car.getY()
  if (x < -10 || y < -10 || x > width || y > height || lifeRemaining <= 0) {
    console.dir({x:x, y:y})
    console.log("all done!")
  } else {
   	window.requestAnimationFrame(run)
  }

}

function updateScore(car) {
  var distanceFromLine = Math.abs(car.y - lineHeight)
  lifeRemaining -= distanceFromLine
  container.innerText = 'Life remaining: ' + lifeRemaining
}
