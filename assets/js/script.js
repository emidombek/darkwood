//Visual Effects not part of actual game
/**
 * Fade In Fade out effect taken from a selection of Stack Overflow Posts
 *for the JS plus this page: https: //www.geeksforgeeks.org/how-to-create-fade-in-effect-on-page-load-using-css/,
 * https://dev.to/tiaeastwood/super-simple-css-animation-for-fade-in-on-page-load-2p8m, 
 * https://youtu.be/-lGpL6_7H3M  
 */
// This sets up an event listener for the onload event of the window, which triggers when the window has finished loading.
window.onload = function () {
  // FadeElement and entryLink variables are defined.
  let fadeElement = document.getElementById("fade");
  let entryLink = document.getElementById("entry-link");

  // Animationend event listener for fadeElement adds the hidden class to fadeElement once its animation ends. This triggers the fade-in animation for the entryLink element since it was initially hidden.
  fadeElement.addEventListener("animationend", function () {
    fadeElement.classList.add("hidden");
    entryLink.classList.remove("hidden");
  });
  // Click event listener for entryLink remains the same, logging a message to the console and redirecting the page to the specified URL when the link is clicked.
  entryLink.addEventListener("click", function (event) {
    // Logs message to browser.
    console.log("Link clicked!");
    window.location.href = entryLink.href;

  });
  // Touch event listener
  entryLink.addEventListener("touchend", function (event) {
    event.preventDefault();
    // Logs message to browser.
    console.log("Link touched!");
    window.location.href = entryLink.href;
  });
};

/**
 * Firefly background animation taken from https: //github.com/owentr1369/animated-background-fireflies-youtube and modified slightly
 */
/**
 * Class constuctor that creates individual firefly instances 
 * with randomized positions (w,h), sizes , angles, and velocities.
 */
class Firefly {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.s = Math.random() * 2;
    this.ang = Math.random() * 2 * Math.PI;
    this.v = (this.s * this.s) / 4;
  }

  // The move() method of the Firefly class. It represents movement behavior of a firefly object.
  move() {
    // Update the x position by adding the horizontal movement component
    this.x += this.v * Math.cos(this.ang);
    // Update the y position by adding the vertical movement component
    this.y += this.v * Math.sin(this.ang);
    // Randomly change the angle of movement within a certain range
    this.ang += (Math.random() * 20 * Math.PI) / 180 - (10 * Math.PI) / 180;
  }


  show(c) {
    // Begin a new path for drawing
    c.beginPath();
    // Create an arc (circle) at the specified position with the given radius
    c.arc(this.x, this.y, this.s, 0, 2 * Math.PI);
    // Set the fill color for the firefly
    c.fillStyle = "#DFF8EB";
    // Fill the firefly shape with the specified fill color
    c.fill();
  }
}

/**
 *Create an empty array to store fireflies
 */

let f = [];

/**
 *Variables
 *for canvas, context, canvas width(w), and canvas height(h)
 */
let canvas, context, w, h;

/**
 *Creates a simulation of fireflies flying around on a canvas, 
 *and it keeps adding new fireflies as long as there's space for them and removes any that go outside the canvas.
 */
function draw() {
  // Check if there are less than 100 fireflies in the array
  if (f.length < 100) {
    // Add 10 new Firefly objects to the array
    for (let j = 0; j < 10; j++) {
      f.push(new Firefly(w, h));
    }
  }

  // Animation loop for each firefly
  for (let i = 0; i < f.length; i++) {
    // Move the firefly to update its position
    f[i].move();

    // Show/render the firefly on the canvas
    f[i].show(context);

    // Check if the firefly is outside the canvas boundaries
    if (f[i].x < 0 || f[i].x > w || f[i].y < 0 || f[i].y > h) {
      // Remove the firefly from the array
      f.splice(i, 1);
    }
  }
}
/**
 * Initializes a canvas element and its drawing context, 
 * sets its size to match the window, 
 * and fills it with a light green color.
 * It returns the context, allowing drawing operations on the canvas.
 */
function init(elemid) {
  // Get the canvas element by its ID
  canvas = document.getElementById(elemid);

  // Get the 2D drawing context for the canvas
  context = canvas.getContext("2d");

  // Set the width and height of the canvas to match the window size
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;

  // Set the fill style of the context to a light green color
  context.fillStyle = "rgba(152, 255, 191, 1)";

  // Fill the entire canvas with the specified fill style
  context.fillRect(0, 0, w, h);

  // Return the context to be used for drawing operations
  return context;
}
/**
 * Sets up an animation loop that repeatedly clears the canvas and calls the draw
 * function to render the animation on the canvas.
 */
function loop() {
  // Request the browser to call the loop() function before the next repaint
  window.requestAnimationFrame(loop);

  // Clear the entire canvas to prepare for the next frame
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Call the draw() function to update and render the animation
  draw();
}

/**
 * Listens
 * for window resize events, 
 * updates the canvas size accordingly, 
 * reinitializes the canvas, 
 * and restarts the animation loop to reflect the changes on the canvas.
 */

window.addEventListener("resize", function () {
  // Update the width and height of the canvas to match the new window size
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;

  // Reinitialize the canvas with the updated size
  init("myCanvas");

  // Restart the animation loop to reflect the changes
  loop();
});
/**
 * Initialize the canvas and start the animation loop to display the animation on the canvas
 */
init("myCanvas");
loop();
//Card game code

// Array of unique image paths
const uniqueImages = [
  '../images/dazbog_card.jpg',
  '../images/dola_card.jpg',
  '../images/dziewanna_card.jpg',
  '../images/lada_card.jpg',
  '../images/leszy_card.jpg',
  '../images/mokosz_card.jpg',
  '../images/morana_card.jpg',
  '../images/perun_card.jpg',
  '../images/rod_card.jpg',
  '../images/swietowit_card.jpg',
  '../images/veles_card.jpg',
  '../images/zywia_card.jpg',
];

// Duplicate the unique images for pairs using spread operator
const allImages = [...uniqueImages, ...uniqueImages];

// Shuffle the array of images randomly
const shuffledImages = shuffle(allImages);

// Get the container for the card grid
const gridContainer = document.querySelector('.grid-game-container');

// Create the card elements dynamically and assign the shuffled images
// For loop runs 8 times, creating 8 <div> elements with the 'card' class
for (let i = 0; i < 8; i++) {
  const card = document.createElement('div');
  card.classList.add('card');
  // Creates a new  div element and assigns it to the cardInner variable
  const cardInner = document.createElement('div');
  cardInner.classList.add('card-inner');