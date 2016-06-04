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
// The car has an x and y attribute you can check,
// as well as a rotation property.
// You want to be as close to the roadY as you can!
//
// Return a number of degrees to turn (added to your current turn)
// The car has a limit of how hard it can turn!
//
// Here's a very dumb driving function to get started:
function decideTurnAngle(car) {

  var p = (roadY - car.y) / 2
  var d = (car.rotation * -1) / 30
  
  return p + d
}

// Parameters: Tune your difficulty here!
var totalBlood = 9.48 // pints of blood in a 150lb human
var height = 600      // play area height (px)
var width = 800       // distance to hospital (px)
var startingOffset = 30 // How far from the road you start
var carSpeed = 2        // How many pixels you move per frame
var roadY = height / 2  
var hardestTurn = 45
var bloodLossPerFrame = 0.3
var bloodLossPerPixelAwayPerFrame = 0.1

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
  getRotation: function() {
    // sample rotation string:
    // "t-38.137297509093735,4.911377624547314r-10,0,0"
    var rotation
    try {
      rotation = this.shape.transform().match(/(?:r).[0-9]+/)[0].substr(1)
    } catch (e) {
      rotation = 0
    }
    this.rotation = parseInt(rotation)
  },
  update: function() {
    this.getX()
    this.getY()
    this.getRotation()
  },
}
car.shape = paper.rect(car.x, car.y, 20, 10)
car.shape.attr('fill', '#FF0000')

var startTime = Date.now()
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
    var endTime = Date.now()
    var totalTime = endTime - startTime
    var timeEl = document.createElement('p')
    timeEl.innerText = 'Total time was ' + (totalTime / 1000).toFixed(2) + ' seconds'
		body.appendChild(timeEl)
  } else {
   	window.requestAnimationFrame(run)
  }

}

function updateScore(car) {
  var distanceFromLine = Math.abs(car.y - roadY)
  lifeRemaining -= distanceFromLine * bloodLossPerPixelAwayPerFrame
  lifeRemaining -= bloodLossPerFrame
  lifeEl.innerText = 'Blood remaining: ' + (lifeRemaining / 100).toFixed(2)

  var distanceFromEnd = width - car.x
  distanceEl.innerText = 'Distance from hospital: ' + distanceFromEnd.toFixed(2)
}