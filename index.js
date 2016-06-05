var Raphael = require('raphael')
var Car = require('./car')

module.exports = DrivingSim

function DrivingSim(element) {
  var _this = this
  this.element = element

    // Set up drawing context:
  var paper = Raphael(element)
  this.paper = paper
}

DrivingSim.prototype.initScoreboard = function() {
  if (this.scoreboard) {
    this.element.removeChild(this.scoreboard)
  }

  // Set up text displays:
  this.scoreboard = document.createElement('div')
  this.scoreboard.style.position = 'absolute'
  this.scoreboard.style.top = '0px'
  this.scoreboard.style.right = '0px'
  this.element.appendChild(this.scoreboard)
}

DrivingSim.prototype.startDrive = function(opts, carsOpts) {
  var _this = this
  this.opts = opts

  this.initScoreboard()

  var cars = carsOpts.map(function(carOpts) {
    var car = new Car(carOpts)
    car.reset(opts, _this.paper)
    car.useScoreboard(_this.scoreboard)
    return car
  })
  this.cars = cars

  var lifeRemaining = opts.totalBlood

  this.centerLine = this.paper.rect(0, opts.roadY, opts.width, 2)
  var startTime = Date.now()

  this.run = function() {
    var _this = this
    this.cars.forEach(function(car) {
      if (!car.isDone(_this.opts.width)) {
        car.update()

        var opts = _this.opts
        var readOpts = JSON.parse(JSON.stringify(opts))
        var turnAngle = car.decider(car, readOpts)
        if (turnAngle > opts.hardestTurn) {
          turnAngle = opts.hardestTurn
        } else if (turnAngle < (-1 * opts.hardestTurn)) {
          turnAngle = (-1 * opts.hardestTurn)
        }

        car.shape.rotate(turnAngle)
        car.shape.translate(opts.carSpeed)
      }
    })

    var isDone = cars.filter(function(car) {
      return !car.isDone(_this.opts.width)
    }).length === 0

    this.updateScore()

    if (!isDone) {
      window.requestAnimationFrame(this.run.bind(this))
    } else {
      console.log("Game over")
    }
  }
  window.requestAnimationFrame(this.run.bind(this))

  this.updateScore = function() {
    var _this = this
    this.cars.filter(function(car) {
      return !car.isDone(_this.opts.width)
    }).forEach(function(car) {
      var distanceFromLine = Math.abs(car.y - opts.roadY)
      car.blood -= distanceFromLine * opts.bloodLossPerPixelAwayPerFrame
      car.blood -= opts.bloodLossPerFrame
      car.updateScore()
    })
  }
}

