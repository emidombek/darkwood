/**
 * Game JS
 */
document.addEventListener('DOMContentLoaded', () => { // eventListener on screenload
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

  let score = 0;
  let timer;
  let matchTimeout = 60;
  let timerActive = false;
  const numberOfCards = 8;
  let round = 1;
  let flippedCards = [];
  let matchedPairs = 0;
  let gridContainer = document.querySelector('.grid-game-container');
  let combinedCards;
  const restartButton = document.getElementById('restartButton');
  const pauseButton = document.getElementById('pauseButton');
  const playButton = document.getElementById('playButton');
  const pauseText = document.getElementById('pauseText');
  const playText = document.getElementById('playText');
  const timerElement = document.querySelector('.timer');
  let shuffledImages;
  let allCards;
  let duplicatedCards;
  let isPaused = false;
  const instructionsIcon = document.querySelector('.instructions');
  const popupContainer = document.getElementById('popupContainer');
  const closePopup = document.getElementById('closePopup');
  const overlay = document.getElementById('overlay');
  const popupContainer2 = document.getElementById('popupContainer2');
  const closePopup2 = document.getElementById('closePopup2');
  const popupContainer3 = document.getElementById('popupContainer3');
  const restartgameButton = document.getElementById('restartgameButton');
  const endgameButton = document.getElementById('endgameButton');
  let isFlipping = false;


  // Function to start the timer
  function startTimer() {
    if (timerActive) { //if statement to check if timer is already running
      return;
    }
    let secondsLeft = isPaused ? remainingSeconds : matchTimeout;

    updateTimerDisplay(timerElement, secondsLeft);

    timerActive = true;

    if (isPaused) { // if statement to check if game if paused
      secondsLeft = remainingSeconds; // Use the remaining seconds if game was paused
    } else {
      remainingSeconds = secondsLeft; // Store the initial seconds when starting the timer
    }

    updateTimerDisplay(timerElement, secondsLeft);

    timer = setInterval(() => { //clear the timer 
      secondsLeft--;

      if (secondsLeft <= 0) {
        clearInterval(timer);
        endRound();
      }

      updateTimerDisplay(timerElement, secondsLeft);

    }, 1000);
  }

  // Function to update the timer display
  function updateTimerDisplay(element, seconds) {
    element.textContent = formatTime(seconds);
  }

  // Function to format time in MM:SS format
  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    // Format minutes and remaining seconds
    // Add leading zero to remaining seconds if it is a single digit
    return minutes > 0 ? `${minutes}:${remainingSeconds.toString().padStart(2, '0')}` : `${remainingSeconds}`;
  }

  // Function to shuffle an array using the Fisher-Yates algorithm
  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }
  // Shuffle the array of unique images
  shuffle(uniqueImages);

  // Function to create the card elements dynamically
  function createCards(images) {
    let cards = []; //array to store the cards

    for (let i = 0; i < 4; i++) { // for loop set to create 4 divs
      let card = document.createElement('div');
      card.classList.add('card');

      const imageName = images[i].split('/').pop(); // Extracting image filenames from the images array and assigning them to the 'imageName' variable
      card.classList.add(`card-image-${imageName}`); // Adding a CSS class to the 'card' element based on the 'imageName'

      let cardInner = document.createElement('div'); //Creating the cardInner element
      cardInner.classList.add('card-inner');

      let cardFront = document.createElement('div'); // Creating the cardFront element 
      cardFront.classList.add('card-front');

      let frontImage = document.createElement('img'); // Creating the card frontImage img element
      frontImage.src = 'assets/images/card.jpg';
      frontImage.alt = 'Card Front Image';
      cardFront.appendChild(frontImage); //Appending the frontImage element as a child of the cardFront element

      let cardBack = document.createElement('div'); // Creating the cardBack element
      cardBack.classList.add('card-back');
      backImage.src = images[i];
      backImage.alt = 'Card Back Image';
      cardBack.appendChild(backImage); // Appending the backImage element as a child of the cardBack element

      cardInner.appendChild(cardFront); // Append cardFront to cardInner
      cardInner.appendChild(cardBack); // Append cardBack to cardInner
      card.appendChild(cardInner); // Append cardInner to card

      cards.push(card); // push to the cards array
    }
    return cards; // return card array 
  }

  // Function to create the grid and place the cards
  function createGrid(cards) {
    let rowContainers = document.querySelectorAll('.grid-game-row');

    if (rowContainers.length === 0) { // Check if there are no existing row containers
      let rowContainer1 = document.createElement('div'); // Create a new <div> element to serve as the first row container
      rowContainer1.classList.add('grid-game-row');

      let rowContainer2 = document.createElement('div'); // Create a new <div> element to serve as the second row container
      rowContainer2.classList.add('grid-game-row');

      for (let i = 0; i < cards.length; i++) {
        if (i < cards.length / 2) {
          rowContainer1.appendChild(cards[i]); // Append the card to the first row container if its index is less than half of the total cards
        } else {
          rowContainer2.appendChild(cards[i]); // Append the card to the second row container if its index is equal to or greater than half of the total cards
        }
      }

      gridContainer.appendChild(rowContainer1); // Append the first row container to the grid container
      gridContainer.appendChild(rowContainer2); // Append the second row container to the grid container
    } else {
      let rowContainer1 = rowContainers[0]; // Retrieve the existing first row container from the 'rowContainers' array
      let rowContainer2 = rowContainers[1]; // Retrieve the existing second row container from the 'rowContainers' array

      while (rowContainer1.firstChild) { // While loops clearing the child elements from rowContainer1 and rowContainer2
        rowContainer1.removeChild(rowContainer1.firstChild);
      }

      while (rowContainer2.firstChild) {
        rowContainer2.removeChild(rowContainer2.firstChild);
      }

      for (let i = 0; i < cards.length; i++) { // Distributing the card elements between rowContainer1 and rowContainer2                                     
        if (i < cards.length / 2) { // based on their indices(based on their positions as they are recorded numerically) to create organized card rows
          rowContainer1.appendChild(cards[i]);
        } else {
          rowContainer2.appendChild(cards[i]);
        }
      }
    }
  }

  // Function to flip a card
  function flipCard(card) {
    console.log('Flipping card:', card);
    if (card.classList.contains('matched')) {
      return; // If the card has the 'matched' class, return without flipping the card
    }
    card.classList.toggle('flipped'); // Toggle the 'flipped' class of the card, adding it if it's not present and removing it if it's already present
  }

  // Function to check if the flipped cards match
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
      console.log('Score:', score);
      displayScore();
      matchedPairs++;
      flippedCards = [];

      if (matchedPairs === numberOfCards / 2) {
        console.log('All matches found!');
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

  // Function to start a round
  function startRound(previousScore = 0) {
    console.log('Starting round...');
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

    console.log('Grid created')

    startTimer();

    displayScore();
    gridContainer.addEventListener('click', handleCardClick);
  }

  // Function to end the round
  function endRound() {
    console.log('Ending round...');
    clearInterval(timer);

    if (matchedPairs === numberOfCards / 2) {
      console.log('Congratulations! You completed the round!');
      round++;
      console.log('Current round:', round);

      setTimeout(() => {
        openPopup2();
      }, 1000);
    } else {
      console.log('Time ran out! Try again.');
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

  startRound(); // Start the round intially 
  pauseGame(); // Pause the game to wait for user click

  // Function to start the game intially 
  function startGame() {
    overlay.style.display = 'none'; // Hide the overlay
    resumeGame();
  }

  // Function to toggle the play/pause button
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

  // Function to restart the game
  function restartGame() {
    console.log('Game restarted.');
    if (isPaused) {
      isPaused = true;
      togglePlayPauseButton(true);
    }

    isPaused = false
    clearInterval(timer); // Clear any existing timers
    timerActive = false; // Reset timerActive to false
    matchedPairs = 0;
    flippedCards = [];
    score = 0;
    round = 1;
    remainingSeconds = matchTimeout;

    updateTimerDisplay(timerElement, matchTimeout); // Update timer display

    startRound(); // Start a new round

    displayScore(); // Update the score display
  }

  // Function to pause the game
  function pauseGame() {
    timerActive = false;
    console.log('Game paused.');
    clearInterval(timer);
    gridContainer.removeEventListener('click', handleCardClick);
    togglePlayPauseButton(true);
    remainingSeconds = timerElement.textContent; // Store the remaining seconds when pausing the game
  }

  // Function to unpause the game
  function resumeGame() {
    timerActive = false;
    startTimer();
    gridContainer.addEventListener('click', handleCardClick);
    togglePlayPauseButton(false);
    console.log('Game resumed.');
  }

  // Function to open the pop-up
  function openPopup() {
    popupContainer.style.display = 'block';
    pauseGame();
  }

  // Function to close the pop-up
  function closePopupHandler() {
    popupContainer.style.display = 'none';
    resumeGame();
  }

  // Function to open the popup2
  function openPopup2() {
    const roundNumberElement = document.getElementById('roundNumber');
    roundNumberElement.textContent = round;

    // Show the popup container
    popupContainer2.style.display = 'block';
  }

  // Function to close the popup2
  function handleClosePopup2() {
    popupContainer2.style.display = 'none';
    startRound(score);
  }

  // Function to open the popup3
  function openPopup3() {
    // Show the popup container
    popupContainer3.style.display = 'block';
  }

  // Function to handle restart game button on popup3
  function handlerestartgameButton() {
    popupContainer3.style.display = 'none';
    restartGame();
  }

  // Function to handle endgame button on popup3
  function handleendgameButton() {
    popupContainer3.style.display = 'none';
  }

  // Handle event listener for card click function
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

  overlay.addEventListener('click', startGame); // Add click event listener to the overlay

  gridContainer.addEventListener('click', handleCardClick); // Card click event listener

  restartButton.addEventListener('click', restartGame); // Restart game icon click event listener

  pauseButton.addEventListener("click", function () { // Pause game button click event listener
    if (!isPaused) {
      pauseGame();
      togglePlayPauseButton(true);
    } else {
      resumeGame();
      togglePlayPauseButton(false);
    }
    isPaused = !isPaused;
  });

  playButton.addEventListener("click", function () { // Start game button click event listener
    if (isPaused) {
      resumeGame();
      togglePlayPauseButton(false);
    }
    isPaused = false;
  });

  instructionsIcon.addEventListener('click', openPopup);
  closePopup.addEventListener('click', closePopupHandler);
  closePopup2.addEventListener('click', handleClosePopup2);
  restartgameButton.addEventListener('click', handlerestartgameButton);
  endgameButton.addEventListener('click', handleendgameButton);

});