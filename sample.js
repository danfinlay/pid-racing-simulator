var DrivingSim = require('./')

/*
 * PID AUTO DRIVING SIMULATOR!!!!
 *
 * Welcome to the world's most "realistic" auto-driving simulator!
 *
 * In this game, you are a programmer for a self driving car
 * that will be driving a critically bleeding patient to the hospital!
 *
 * The further from the road you veer, the harsher the terrain,
 * and the faster your patient bleeds out!
 *
 * Try to get to the finish line with as much blood in your patient
 * as possible!
 *
 * You can try racing as many cars as you want!
 * Below you can see four different cars.
 *
 * See if you can make one that can beat all the other cars!
 *
 * Here is how you tell the car how to turn!
 * The car has an x and y attribute you can check,
 * as well as a rotation property.
 * You want to be as close to the roadY as you can!
 *
 * Return a number of degrees to turn (added to your current turn)
 * The car has a limit of how hard it can turn!
 *
 * Here's a very dumb driving function to get started:
 */

var cars = [
  {
    decideTurnAngle: function(car, opts) {
      if (opts.roadY > car.y) {
        return 2
      } else {
        return -2
      }
    },
    name: 'Bang Bang',
    color: '#0000FF',
  },
  {
    decideTurnAngle: function(car, opts) {
      return (opts.roadY - car.y) / 40
    },
    name: 'Propeller Man',
    color: '#00FF00',
  },
  {
    decideTurnAngle: function(car, opts) {
      var p = (opts.roadY - car.y) / 4
      var d = (car.rotation * -1) / 7

      return p + d
    },
    name: 'Peety Dandruff',
    color: '#FF0000',
  }
]

// Parameters: Tune your difficulty here!
var opts = {
  totalBlood: 9.48, // pints of blood in a 150lb human
  height: 600,      // play area height (px)
  width: 800,       // distance to hospital (px)
  startingOffset: 30, // How far from the road you start
  carSpeed: 2,        // How many pixels you move per frame
  roadY: 290,
  hardestTurn: 45,
  bloodLossPerFrame: 0.007,
  bloodLossPerPixelAwayPerFrame: 0.001,
}

var element = document.querySelector('body')
var drivingSim = new DrivingSim(element)

// Retry button
var retryButton = document.createElement('button')
retryButton.innerText = 'Start Over'
retryButton.addEventListener('click', function(event) {
  console.log("clicked")
  event.preventDefault()
  drivingSim.startDrive(opts, cars)
})
element.appendChild(retryButton)

drivingSim.startDrive(opts, cars)

