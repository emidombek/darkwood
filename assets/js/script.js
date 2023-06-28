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
class Firefly {
  constructor(w, h) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.s = Math.random() * 2;
    this.ang = Math.random() * 2 * Math.PI;
    this.v = (this.s * this.s) / 4;
  }
  // class constuctor that creates individual firefly instances with randomized positions (w,h), sizes , angles, and velocities.