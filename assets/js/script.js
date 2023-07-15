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
  let restartButton = document.getElementById('restartButton');
  let pauseButton = document.getElementById('pauseButton');
  let playButton = document.getElementById('playButton');
  let pauseText = document.getElementById('pauseText');
  let playText = document.getElementById('playText');
  let timerElement = document.querySelector('.timer');
  let shuffledImages;
  let allCards;
  let duplicatedCards;
  let isPaused = false;
  let instructionsIcon = document.querySelector('.instructions');
  const popupContainer = document.getElementById('popupContainer');
  const closePopup = document.getElementById('closePopup');
  const overlay = document.getElementById('overlay');
  const popupContainer2 = document.getElementById('popupContainer2');
  const closePopup2 = document.getElementById('closePopup2');

  // Function to start the timer
  function startTimer() {
    if (timerActive) {
      return;
    }
    let secondsLeft = isPaused ? remainingSeconds : matchTimeout;

    updateTimerDisplay(timerElement, secondsLeft);

    timerActive = true;

    if (isPaused) {
      secondsLeft = remainingSeconds; // Use the remaining seconds if game was paused
    } else {
      remainingSeconds = secondsLeft; // Store the initial seconds when starting the timer
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

  // Function to update the timer display
  function updateTimerDisplay(element, seconds) {
    element.textContent = formatTime(seconds);
  }

  // Function to format time in MM:SS format
  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
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

  // Function to create the grid and place the cards
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

  // Function to flip a card
  function flipCard(card) {
    console.log('Flipping card:', card);
    if (card.classList.contains('matched')) {
      return;
    }
    card.classList.toggle('flipped');
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

    } else {
      setTimeout(() => {
        if (!card1.classList.contains('matched')) {
          flipCard(card1);
        }
        if (!card2.classList.contains('matched')) {
          flipCard(card2);
        }
        flippedCards = [];
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
      const playAgain = confirm('Do you want to play again?');
      if (playAgain) {
        startRound(score);
      } else {
        alert('Game over');
      }
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
    // Check if it's round one
    if (round === 1) {
      // Code block to execute only for round one
      console.log("Round one special code block");
      // ***REMOVED***
      resumeGame();
    }
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

  // Function to open the new popup
  function openPopup2() {
    const roundNumberElement = document.getElementById('roundNumber');
    roundNumberElement.textContent = round;

    // Show the popup container
    popupContainer2.style.display = 'block';
  }

  // Function to close the new popup
  function handleClosePopup2() {
    popupContainer2.style.display = 'none';
    startRound(score);
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
});