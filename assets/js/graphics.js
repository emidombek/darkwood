/**
 * Fade In Fade out effect taken from a selection of Stack Overflow Posts which are included in readme
 * for the JS plus this page: https: //www.geeksforgeeks.org/how-to-create-fade-in-effect-on-page-load-using-css/
 * EventListener on DOM load
 * Sets up an event listener for the onload event of the window, which triggers when the window has finished loading.
 * Add event listeners only if the elements exist.
 * This triggers the fade - in animation.
 * for the entryLink element since it was initially hidden.
 * Click event listener
 * for entryLink remains the same, logging a message to the console and redirecting the page to the specified URL when the link is clicked.
 */
document.addEventListener('DOMContentLoaded', () => {

  let fadeElement = document.getElementById("fade");
  let entryLink = document.getElementById("entry-link");

  if (fadeElement && entryLink) {
    fadeElement.addEventListener("animationend", function () {
      fadeElement.classList.add("hidden");
      entryLink.classList.remove("hidden");
    });

    entryLink.addEventListener("click", function (event) {
      window.location.href = entryLink.href;

    });

    // Touch event listener
    entryLink.addEventListener("touchend", function (event) {
      event.preventDefault();
      window.location.href = entryLink.href;
    });
  }

  /**
   * Firefly background animation taken from https://github.com/owentr1369/animated-background-fireflies-youtube and modified slightly
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

    /** The move() method of the Firefly class. It represents movement behavior of a firefly object.
     * Update the x position by adding the horizontal movement component
     * Update the y position by adding the vertical movement component
     * Randomly change the angle of movement within a certain range
     */
    move() {

      this.x += this.v * Math.cos(this.ang);
      this.y += this.v * Math.sin(this.ang);
      this.ang += (Math.random() * 20 * Math.PI) / 180 - (10 * Math.PI) / 180;
    }
    updateCanvasDimensions(width, height) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
    }

    /** Begin a new path for drawing
     * Create an arc(circle) at the specified position with the given radius
     * Set the fill color for the firefly
     * Fill the firefly shape with the specified fill color
     */
    show(c) {

      c.beginPath();
      c.arc(this.x, this.y, this.s, 0, 2 * Math.PI);
      c.fillStyle = "#DFF8EB";
      c.fill();
    }
  }

  // For canvas, context, canvas width(w), and canvas height(h)
  let canvas, context, w, h;
  // Create an empty array to store fireflies
  let f = [];
  /**
   * Creates a simulation of fireflies flying around on a canvas, 
   * and it keeps adding new fireflies as long as there's space for them and removes any that go outside the canvas.
   * Check if there are less than 100 fireflies in the array
   * Add 10 new Firefly objects to the array
   * Animation loop for each firefly
   * Move the firefly to update its position
   * Show / render the firefly on the canvas
   * Check if the firefly is outside the canvas boundaries
   * Remove the firefly from the array
   */
  function draw() {
    if (f.length < 100) {
      for (let j = 0; j < 10; j++) {
        f.push(new Firefly(w, h));
      }
    }
    for (let i = 0; i < f.length; i++) {
      f[i].move();
      f[i].show(context);

      if (f[i].x < 0 || f[i].x > w || f[i].y < 0 || f[i].y > h) {
        f.splice(i, 1);
      }
    }
  }
  /**
   * Initializes a canvas element and its drawing context, 
   * sets its size to match the window, 
   * and fills it with a light green color.
   * It returns the context, allowing drawing operations on the canvas.
   * Get the canvas element by its ID
   * Get the 2 D drawing context for the canvas
   * Set the width and height of the canvas to match the window size
   * Set the fill style of the context to a light green color
   * Fill the entire canvas with the specified fill style
   * Return the context to be used for drawing operations
   */
  function init(elemid) {
    canvas = document.getElementById(elemid);
    context = canvas.getContext("2d");

    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    context.fillStyle = "rgba(152, 255, 191, 1)";
    context.fillRect(0, 0, w, h);

    return context;
  }
  /**
   * Sets up an animation loop that repeatedly clears the canvas and calls the draw
   * function to render the animation on the canvas.
   * Request the browser to call the loop() function before the next repaint
   * Clear the entire canvas to prepare for the next frame
   * Call the draw() function to update and render the animation
   */
  function loop() {

    window.requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    draw();
  }

  /**
   * Listens
   * for window resize events, 
   * updates the canvas size accordingly, 
   * reinitializes the canvas, 
   * and restarts the animation loop to reflect the changes on the canvas.
   * Update the width and height of the canvas to match the new window size
   * Update the firefly positions based on the new canvas dimensions
   * Reinitialize the canvas with the updated size
   * Restart the animation loop to reflect the changes
   * 
   */

  window.addEventListener("resize", function () {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    for (let i = 0; i < f.length; i++) {
      f[i].updateCanvasDimensions(w, h);
    }

    init("myCanvas");

    loop();
  });

  //Initialize the canvas and start the animation loop to display the animation on the canvas
  init("myCanvas");
  loop();
});