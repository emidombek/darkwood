/** 
 * Event listener when the DOM content is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Array of unique image paths
  let uniqueImages = [
    'assets/images/dazbog_card.jpg',
    'assets/images/dola_card.jpg',
    'assets/images/dziewanna_card.jpg',
    'assets/images/lada_card.jpg',
    'assets/images/leszy_card.jpg',
    'assets/images/mokosz_card.jpg',
    'assets/images/morana_card.jpg',
    'assets/images/perun_card.jpg',
    'assets/images/rod_card.jpg',
    'assets/images/swietowit_card.jpg',
    'assets/images/veles_card.jpg',
    'assets/images/zywia_card.jpg',
  ];

  let score = 0; // Player's score
  let timer; // Timer reference
  let matchTimeout = 60; // Timeout for each round
  let remainingSeconds = matchTimeout; // Set the initial remaining seconds to the match timeout value (60 seconds)
  let timerActive = false; // Flag to track if the timer is active
  const numberOfCards = 8; // Number of cards in the game
  let round = 1; // Current round number
  let flippedCards = []; // Array to store flipped cards
  let matchedPairs = 0; // Number of matched card pairs
  let gridContainer = document.querySelector('.grid-game-container'); // Container for the grid of cards
  let combinedCards; // Array to store combined cards (original and duplicated)
  const restartButton = document.getElementById('restartButton'); // Button to restart the game
  const pauseButton = document.getElementById('pauseButton'); // Button to pause the game
  const playButton = document.getElementById('playButton'); // Button to resume the game
  const pauseText = document.getElementById('pauseText'); // Text for pause button
  const playText = document.getElementById('playText'); // Text for play button
  const timerElement = document.querySelector('.timer'); // Element to display the timer
  let shuffledImages; // Array to store shuffled images
  let allCards; // Array to store all card elements
  let duplicatedCards; // Array to store duplicated card elements
  let isPaused = false; // Flag to track if the game is paused
  const instructionsIcon = document.querySelector('.instructions'); // Instructions icon element
  const popupContainer = document.getElementById('popupContainer'); // Popup container element
  const closePopup = document.getElementById('closePopup'); // Close button for popup
  const overlay = document.getElementById('overlay'); // Overlay element
  const popupContainer2 = document.getElementById('popupContainer2'); // Popup container for round completion
  const closePopup2 = document.getElementById('closePopup2'); // Close button for round completion popup
  const popupContainer3 = document.getElementById('popupContainer3'); // Popup container for game over
  const restartgameButton = document.getElementById('restartgameButton'); // Button to restart the game after game over
  const endgameButton = document.getElementById('endgameButton'); // Button to end the game after game over
  let eventListenersActive = true; // Flag to check if eventlisteners are active

  /** 
   * Function to start the timer
   * Idea is based on this timer: https: //codepen.io/awkay/pen/ExzGea 
   */
  function startTimer() {
    if (timerActive) {
      return;
    }
    let secondsLeft = isPaused ? remainingSeconds : matchTimeout;

    updateTimerDisplay(timerElement, secondsLeft);

    timerActive = true;

    if (isPaused) {
      // Use the remaining seconds if game was paused
      secondsLeft = remainingSeconds;
    } else {
      // Store the initial seconds when starting the timer
      remainingSeconds = secondsLeft;
    }

    updateTimerDisplay(timerElement, secondsLeft);

    timer = setInterval(() => {
      secondsLeft--;

      if (secondsLeft <= 0) {
        clearInterval(timer);
        endRound();
      }

      updateTimerDisplay(timerElement, secondsLeft);

    }, 1000);
  }
  /** 
   * Function to update the timer
   * Based on this timer: https: //codepen.io/awkay/pen/ExzGea
   */
  function updateTimerDisplay(element, seconds) {
    element.textContent = formatTime(seconds);
  }
  /** 
   * Function to format the time in MM:SS with leading 0 is nessecary 
   * Format minutes and remaining seconds
   * 
   */
  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;

    // this is my own code based on an SQL query I wrote and converted into JS see readme resources for query
    return minutes > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` : `${remainingSeconds}`;
  }
  /** 
   * Function to shuffle an array
   * Used method 2 from here: https: //www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
   * Also seen in this video: https: //youtu.be/-tlb4tv4mC4
   */
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  // Shuffle the array of unique images
  shuffle(uniqueImages);

  /** 
   * Function to create the card elements dynamically
   * Idea taken from here: https: //youtu.be/zIh16K8BN7k
   * Also seen here: https: //youtu.be/ZniVgo8U7ek
   */
  function createCards(images) {
    let cards = [];
    for (let i = 0; i < 4; i++) {
      let card = document.createElement('div');
      card.classList.add('card');
      const imageName = images[i].split('/').pop();

      card.classList.add(`card-image-${imageName}`);

      let cardInner = document.createElement('div');
      cardInner.classList.add('card-inner');

      let cardFront = document.createElement('div');
      cardFront.classList.add('card-front');
      let frontImage = document.createElement('img');
      frontImage.src = 'assets/images/card.jpg';
      frontImage.alt = 'Card Front Image';
      cardFront.appendChild(frontImage);

      let cardBack = document.createElement('div');
      cardBack.classList.add('card-back');
      let backImage = document.createElement('img');
      backImage.src = images[i];
      backImage.alt = 'Card Back Image';
      cardBack.appendChild(backImage);

      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      card.appendChild(cardInner);

      cards.push(card);
    }
    return cards;
  }

  /** Function to create the grid and place the cards
   * Idea for this was based on several tutorials: https://youtu.be/zIh16K8BN7k 
   * https://www.w3schools.com/js/js_loop_while.asp, https://youtu.be/tjyDOHzKN0w
   */
  function createGrid(cards) {
    let rowContainers = document.querySelectorAll('.grid-game-row');

    if (rowContainers.length === 0) {
      let rowContainer1 = document.createElement('div');
      rowContainer1.classList.add('grid-game-row');

      let rowContainer2 = document.createElement('div');
      rowContainer2.classList.add('grid-game-row');

      for (let i = 0; i < cards.length; i++) {
        if (i < cards.length / 2) {
          rowContainer1.appendChild(cards[i]);
        } else {
          rowContainer2.appendChild(cards[i]);
        }
      }

      gridContainer.appendChild(rowContainer1);
      gridContainer.appendChild(rowContainer2);
    } else {
      let rowContainer1 = rowContainers[0];
      let rowContainer2 = rowContainers[1];

      while (rowContainer1.firstChild) {
        rowContainer1.removeChild(rowContainer1.firstChild);
      }

      while (rowContainer2.firstChild) {
        rowContainer2.removeChild(rowContainer2.firstChild);
      }

      for (let i = 0; i < cards.length; i++) {
        if (i < cards.length / 2) {
          rowContainer1.appendChild(cards[i]);
        } else {
          rowContainer2.appendChild(cards[i]);
        }
      }
    }
  }

  /** Function to flip a card
   * Idea for this was based on https://youtu.be/tjyDOHzKN0w
   */
  function flipCard(card) {
    if (card.classList.contains('matched')) {
      return;
    }
    card.classList.toggle('flipped');
  }

  /** Function to check if the flipped cards match
   *  Idea for this was based on shttps://youtu.be/tjyDOHzKN0w
   */
  function checkMatch() {
    let card1 = flippedCards[0];
    let card2 = flippedCards[1];

    let card1ImageName = Array.from(card1.classList).find(className =>
      className.startsWith('card-image-')
    );
    let card2ImageName = Array.from(card2.classList).find(className =>
      className.startsWith('card-image-')
    );

    // Disable card click event listeners during the flip-back animation
    gridContainer.removeEventListener('click', handleCardClick);

    if (card1ImageName === card2ImageName) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      score++;
      displayScore();
      matchedPairs++;
      flippedCards = [];

      if (matchedPairs === numberOfCards / 2) {
        setTimeout(() => {
          endRound();
        }, 1000);
        return;
      }

      displayScore();

      //Re-enable card click event listeners after a brief delay
      setTimeout(() => {
        gridContainer.addEventListener('click', handleCardClick);
      }, 1000);
    } else {
      setTimeout(() => {
        if (!card1.classList.contains('matched')) {
          flipCard(card1);
        }
        if (!card2.classList.contains('matched')) {
          flipCard(card2);
        }
        flippedCards = [];
        // Re-enable card click event listeners after a brief delay
        setTimeout(() => {
          gridContainer.addEventListener('click', handleCardClick);
        }, 1000);
      }, 1000);
    }
  }

  /** Function to start a round
   * Based on this and modified: https://forum.freecodecamp.org/t/rock-paper-scissors-round-tracker/608515
   */
  function startRound(previousScore = 0) {
    score = previousScore;
    matchedPairs = 0;
    flippedCards = [];
    timerActive = false;
    timer = null;
    remainingSeconds = 0;

    shuffledImages = shuffle(uniqueImages);
    allCards = createCards(shuffledImages);
    duplicatedCards = allCards.map(card => {
      let clone = card.cloneNode(true);
      return clone;
    });

    combinedCards = shuffle(allCards.concat(duplicatedCards));

    createGrid(combinedCards);

    startTimer();

    displayScore();
    gridContainer.addEventListener('click', handleCardClick);
  }

  /** Function to end the round
   *Based on this and modified: https://forum.freecodecamp.org/t/rock-paper-scissors-round-tracker/608515
   */
  function endRound() {
    clearInterval(timer);

    if (matchedPairs === numberOfCards / 2) {
      round++;
      setTimeout(() => {
        openPopup2();
      }, 1000);
    } else {
      openPopup3();
    }

    displayScore();
  }

  // Function to display the current score
  function displayScore() {
    let scoreElement = document.querySelector('.score-display');
    if (scoreElement) {
      scoreElement.textContent = score;
    }
  }

  // Start the round intially 
  startRound();
  // Pause the game to wait for user click
  pauseGame();

  // Function to start the game intially 
  function startGame() {
    overlay.style.display = 'none'; // Hide the overlay
    resumeGame();
  }

  /** Function to toggle the play/pause button
   * code taken from here and modified:
   *  https://stackoverflow.com/questions/27368778/how-to-toggle-audio-play-pause-with-one-button-or-link
   */
  function togglePlayPauseButton(isPaused) {
    if (isPaused) {
      pauseButton.style.display = 'none';
      playButton.style.display = 'inline-block';
      pauseText.style.display = 'none';
      playText.style.display = 'inline-block';
    } else {
      pauseButton.style.display = 'inline-block';
      playButton.style.display = 'none';
      pauseText.style.display = 'inline-block';
      playText.style.display = 'none';
    }
  }

  /** Function to restart the game
   * idea and code taken from here: 
   * https://stackoverflow.com/questions/28744682/the-best-way-to-reset-your-javascript-game-after-gameover-and-how
   */
  function restartGame() {
    if (isPaused) {
      isPaused = true;
      togglePlayPauseButton(true);
    }

    isPaused = false;
    // Clear any existing timers
    clearInterval(timer);
    // Reset timerActive to false 
    timerActive = false;
    matchedPairs = 0;
    flippedCards = [];
    score = 0;
    round = 1;
    remainingSeconds = matchTimeout;
    // Remove the glow from the "Restart" button
    restartButton.classList.remove('restart-glow');

    // Check if the event listeners are active before adding them
    if (!eventListenersActive) {
      pauseButton.addEventListener('click', handlePauseButton);
      playButton.addEventListener('click', handlePlayButton);
      eventListenersActive = true;
    }

    updateTimerDisplay(timerElement, matchTimeout);

    startRound();

    displayScore();

  }

  /** Function to pause the game
   * Idea taken from here: 
   * https://www.geeksforgeeks.org/how-to-pause-and-play-a-loop-in-javascript-using-event-listeners/
   */
  function pauseGame() {

    if (!timerActive) {
      return; // Exit early if the game is already paused
    }
    timerActive = false;
    clearInterval(timer);
    gridContainer.removeEventListener('click', handleCardClick);
    togglePlayPauseButton(true);
    remainingSeconds = timerElement.textContent; // Store the remaining seconds when pausing the game
    playButton.classList.add('play-glow');
  }

  /** Function to unpause the game
   * Idea taken from here:
   *  https://www.geeksforgeeks.org/how-to-pause-and-play-a-loop-in-javascript-using-event-listeners
   */
  function resumeGame() {
    if (timerActive) {
      // If the timer is already active, exit early and don't resume the game again
      return;
    }
    timerActive = false;
    startTimer();
    gridContainer.addEventListener('click', handleCardClick);
    togglePlayPauseButton(false);
    playButton.classList.remove('play-glow');
  }

  /** Function to open the Instructions pop-up
   * This tutorial was used 
   * https://www.freecodecamp.org/news/how-to-build-a-modal-with-javascript/#:~:text=This%20pop%2Dup%20window%20is,%2Daction%20elements%2C%20and%20more.
   */
  function openPopup() {
    popupContainer.style.display = 'block';
    overlay.style.display = 'none'; // Hide the overlay
    if (timerActive) {
      pauseGame();
    }
  }

  // Function to close the pop-up
  function closePopupHandler() {
    popupContainer.style.display = 'none';
    isPaused = true;
  }


  /** Function to open the Successful Round popup
   * This tutorial was used 
   * https://www.freecodecamp.org/news/how-to-build-a-modal-with-javascript/#:~:text=This%20pop%2Dup%20window%20is,%2Daction%20elements%2C%20and%20more.
   */
  function openPopup2() {
    const roundNumberElement = document.getElementById('roundNumber');
    roundNumberElement.textContent = round;
    popupContainer2.style.display = 'block';
  }

  // Function to close the popup2
  function handleClosePopup2() {
    popupContainer2.style.display = 'none';
    startRound(score);
  }

  /** Function to open the Unsuccessful Round popup
   * This tutorial was used
   *  https://www.freecodecamp.org/news/how-to-build-a-modal-with-javascript/#:~:text=This%20pop%2Dup%20window%20is,%2Daction%20elements%2C%20and%20more.
   */
  function openPopup3() {
    popupContainer3.style.display = 'block';
  }

  /** Function to handle restart game button on Unsuccessful Round popup
   * This tutorial was used 
   * https://www.freecodecamp.org/news/how-to-build-a-modal-with-javascript/#:~:text=This%20pop%2Dup%20window%20is,%2Daction%20elements%2C%20and%20more.
   */
  function handlerestartgameButton() {
    popupContainer3.style.display = 'none';
    restartGame();
  }

  // Function to handle endgame button on Unsuccessful Round popup
  function handleendgameButton() {
    popupContainer3.style.display = 'none';
    pauseButton.removeEventListener('click', handlePauseButton);
    playButton.removeEventListener('click', handlePlayButton);
    // Make the "Restart" button glow
    restartButton.classList.add('restart-glow');
  }

  /** Handle event listener for card click
   * Idea based on: https://youtu.be/tjyDOHzKN0w
   */
  function handleCardClick(event) {

    let clickedCard = event.target.closest('.card');

    if (!clickedCard || clickedCard.classList.contains('flipped')) {
      return;
    }

    flipCard(clickedCard);
    flippedCards.push(clickedCard);
    if (flippedCards.length === 2) {
      checkMatch();
    }
  }

  // Event listeners

  // Add click event listener to the overlay
  overlay.addEventListener('click', startGame);

  // Card click event listener
  gridContainer.addEventListener('click', handleCardClick);

  // Restart game icon click event listener
  restartButton.addEventListener('click', restartGame);

  // Pause game button click event listener
  pauseButton.addEventListener("click", function () {
    if (!isPaused) {
      pauseGame();
      togglePlayPauseButton(true);
    } else {
      resumeGame();
      togglePlayPauseButton(false);
    }
    isPaused = !isPaused;
  });
  // Start game button click event listener
  playButton.addEventListener("click", function () {
    if (isPaused) {
      resumeGame();
      togglePlayPauseButton(false);
    }
    isPaused = false;
  });

  //Instructions icon open click pop-up listener
  instructionsIcon.addEventListener('click', openPopup);

  //Instructions close button click pop-up listener
  closePopup.addEventListener('click', closePopupHandler);

  //Successful round pop-up close button listener
  closePopup2.addEventListener('click', handleClosePopup2);

  //Unsuccessful round pop-up restart round button listener
  restartgameButton.addEventListener('click', handlerestartgameButton);

  //Unsuccessful round pop-up end game button listener
  endgameButton.addEventListener('click', handleendgameButton);

});