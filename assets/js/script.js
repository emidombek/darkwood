/**
 * Fade In Fade out effect taken from a mishmash of Stack Overflow Posts
 for the JS plus this page: https: //www.geeksforgeeks.org/how-to-create-fade-in-effect-on-page-load-using-css/, https://dev.to/tiaeastwood/super-simple-css-animation-for-fade-in-on-page-load-2p8m, https://youtu.be/-lGpL6_7H3M  
 */
window.onload = function () {
  // This sets up an event listener for the onload event of the window, which triggers when the window has finished loading.
  let fadeElement = document.getElementById("fade");
  // retrieves the element with the ID "fade" from the document.
  fadeElement.addEventListener("animationend", function () {
    // This adds an event listener to the animationend event of the fadeElement. The code inside the function will be executed when the animation on fadeElement ends.
    let entryLink = document.getElementById("entry-link");
    // This retrieves the element with the ID "entry-link" from the document.
    entryLink.classList.remove("hidden");
    //  This removes the CSS class "hidden" from the entryLink element. 
    entryLink.addEventListener("click", function (event) {
      //This adds an event listener to the click event of the entryLink element. The code inside the function will be executed when the element is clicked. 
      console.log("Link clicked!");
      // Logs message to browser
      window.location.href = entryLink.href;
      // This changes the current URL of the window to the value of entryLink.href in this case game.html, effectively redirecting the page to the specified URL
    });
  });
};