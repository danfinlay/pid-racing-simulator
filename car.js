module.exports = Car

function Car(opts) {
  this.opts = opts
  this.name = opts.name || 'Untitled car'
  this.decider = opts.decideTurnAngle
  this.color = opts.color
  this.blood = opts.totalBlood
  this.scoreLabel = document.createElement('p')

  this.updateScore = function() {
    var blood = this.blood || 0
    this.scoreLabel.innerText = this.name + " blood remaining: " + blood.toFixed(3) + " pints."
    this.scoreLabel.style.color = this.color
  }
  this.updateScore()

  this.x = 0,
  this.y = 0,

  this.getX = function() {
    this.x = this.shape.getBBox().x
    return this.x
  }

  this.getY = function() {
    this.y = this.shape.getBBox().y
    return this.y
  }

  this.getRotation = function() {
    var rotation
    try {
      rotation = this.shape.transform().match(/(?:r).[0-9]+/)[0].substr(1)
    } catch (e) {
      rotation = 0
    }
    this.rotation = parseInt(rotation)
  }

  this.update = function() {
    this.getX()
    this.getY()
    this.getRotation()
  }

  this.reset = function(opts, paper) {
    this.blood = opts.totalBlood
    this.x = 0
    this.y = (opts.height / 2) + opts.startingOffset
    this.shape = paper.rect(this.x, this.y, 20, 10)
    this.shape.attr('fill', this.color || '#FF0000')
  }

  this.useScoreboard = function(element) {
    element.appendChild(this.scoreLabel)
  }
}

Car.prototype.isDone = function(length) {
  var bloodDrained = this.blood <= 0
  var toHospital = this.x >= length
  return bloodDrained || toHospital
}
