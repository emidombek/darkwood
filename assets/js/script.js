/**
 * Fade In Fade out effect taken from a mishmash of Stack Overflow Posts
 for the JS plus this page: https: //www.geeksforgeeks.org/how-to-create-fade-in-effect-on-page-load-using-css/, https://dev.to/tiaeastwood/super-simple-css-animation-for-fade-in-on-page-load-2p8m, https://youtu.be/-lGpL6_7H3M  
 */
window.onload = function () {
  // This sets up an event listener for the onload event of the window, which triggers when the window has finished loading.
  let fadeElement = document.getElementById("fade");
  let entryLink = document.getElementById("entry-link");
  // FadeElement and entryLink variables are defined outside the event listeners to retrieve the respective elements with their IDs.

  fadeElement.addEventListener("animationend", function () {
    fadeElement.classList.add("hidden");
    entryLink.classList.remove("hidden");
    // Animationend event listener for fadeElement adds the hidden class to fadeElement once its animation ends. This triggers the fade-in animation for the entryLink element since it was initially hidden.
  });

  entryLink.addEventListener("click", function (event) {
    console.log("Link clicked!");
    // Logs message to browser.
    window.location.href = entryLink.href;
    // Click event listener for entryLink remains the same, logging a message to the console and redirecting the page to the specified URL when the link is clicked.

  });
};

/**
 * Firefly background animation taken from https: //github.com/owentr1369/animated-background-fireflies-youtube and modified slightly
 */
/**
 * Class constuctor that creates individual firefly instances with randomized positions (w,h), sizes , angles, and velocities.
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
 *Creates a simulation of fireflies flying around on a canvas, and it keeps adding new fireflies as long as there's space for them and removes any that go outside the canvas.
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