/*
 * PID AUTO DRIVING SIMULATOR!!!!
 *
 * Welcome to the world's most realistic auto-driving sim.
 *
 * In this game, you are a programmer for a self driving car
 * that will be driving critically bleeding patients to the hospital.
 * The further off the line you are, the harsher the terrain,
 * and the faster your patient bleeds out.
 *
 * Try to get to the finish line with as much blood in your patient
 * as possible!
 */

// Here is how you tell the car how to turn!
// The car has an x and y attribute you can check.
// You want to be as close to the roadY as you can!
//
// Return a number of degrees to turn.
// The car has a limit of how hard it can turn!
function decideTurnAngle(car) {
  if (car.y < roadY) {
    return 1
  } else {
    return -1
  }
}

// Parameters: Tune your difficulty here!
var height = 600
var width = 800
var startingOffset = 30
var carSpeed = 2
var roadY = height / 2
var totalBlood = 3000
var hardestTurn = 45


//////////////////////////////////
// PRIVATE INTERNAL LOGIC ZONE////
/////// DO NOT ENTER!!!!!!!///////
//////////////////////////////////
var Raphael = require('raphael')
var body = document.querySelector('body')
var lifeEl = document.createElement('p')
var distanceEl = document.createElement('p')
body.appendChild(lifeEl)
body.appendChild(distanceEl)

var lifeRemaining = totalBlood
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
  if (turnAngle > hardestTurn) {
    turnAngle = hardestTurn
  } else if (turnAngle < (-1 * hardestTurn)) {
    turnAngle = (-1 * hardestTurn)
  }

  car.shape.rotate(turnAngle)
  car.shape.translate(carSpeed)

  var x = car.getX()
  var y = car.getY()
  if (x < -10 || y < -10 || x > width || y > height || lifeRemaining <= 0) {
    // Game over
  } else {
   	window.requestAnimationFrame(run)
  }

}

function updateScore(car) {
  var distanceFromLine = Math.abs(car.y - roadY)
  lifeRemaining -= distanceFromLine
  lifeEl.innerText = 'Blood remaining: ' + lifeRemaining

  var distanceFromEnd = width - car.x
  distanceEl.innerText = 'Distance from hospital: ' + distanceFromEnd
}
