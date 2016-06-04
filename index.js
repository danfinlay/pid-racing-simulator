var Raphael = require('raphael')

module.exports = DrivingSim

function DrivingSim(element) {
  var _this = this
  this.element = element

  // Set up text displays:
  this.lifeEl = document.createElement('p')
  this.distanceEl = document.createElement('p')
  this.timeEl = document.createElement('p')
  element.appendChild(this.lifeEl)
  element.appendChild(this.distanceEl)
  element.appendChild(this.timeEl)

  // Set up drawing context:
  var paper = Raphael(element)
  this.paper = paper

  this.car = {
    x: 0,
    y: 0,
    getX: function() {
      this.x = this.shape.getBBox().x
      return this.x
    },
    getY: function() {
      this.y = this.shape.getBBox().y
      return this.y
    },
    getRotation: function() {
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
    reset: function(opts) {
      this.x = 0
      this.y = (opts.height / 2) + opts.startingOffset
      this.shape = paper.rect(this.x, this.y, 20, 10)
      this.shape.attr('fill', '#FF0000')
    },
  }
}

DrivingSim.prototype.startDrive = function(opts, decideTurnAngle) {
  this.opts = opts
  var car = this.car
  this.car.reset(opts)

  var lifeRemaining = opts.totalBlood

  this.centerLine = this.paper.rect(0, opts.height / 2, opts.width, 2)
  var startTime = Date.now()
  window.requestAnimationFrame(run.bind(this))
  function run() {

    car.update()
    this.updateScore(car)
    var turnAngle = decideTurnAngle(car)
    if (turnAngle > opts.hardestTurn) {
      turnAngle = opts.hardestTurn
    } else if (turnAngle < (-1 * opts.hardestTurn)) {
      turnAngle = (-1 * opts.hardestTurn)
    }

    car.shape.rotate(turnAngle)
    car.shape.translate(opts.carSpeed)

    var x = car.getX()
    var y = car.getY()
    if (x < -10 || y < -10 || x > opts.width || y > opts.height || lifeRemaining <= 0) {
      // Game over
      console.log('game over')
      var endTime = Date.now()
      var totalTime = endTime - startTime
      this.timeEl.innerText = 'Total time was ' + (totalTime / 1000).toFixed(2) + ' seconds'
   } else {
      window.requestAnimationFrame(run.bind(this))
    }
  }

  this.updateScore = function(car) {
    var distanceFromLine = Math.abs(car.y - opts.roadY)
    lifeRemaining -= distanceFromLine * opts.bloodLossPerPixelAwayPerFrame
    lifeRemaining -= opts.bloodLossPerFrame
    this.lifeEl.innerText = 'Blood remaining: ' + lifeRemaining.toFixed(2) + ' pints'

    var distanceFromEnd = opts.width - car.x
    this.distanceEl.innerText = 'Distance from hospital: ' + distanceFromEnd.toFixed(2)
  }
}

