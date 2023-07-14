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
  const matchTimeout = 60;
  const numberOfCards = 8;
  let round = 1;
  let flippedCards = [];
  let matchedPairs = 0;
  let gridContainer = document.querySelector('.grid-game-container');
  let combinedCards;
  let openPopupButton = document.getElementById('openPopup');
  let closePopupButton = document.getElementById('closePopup');
  let popupContainer = document.getElementById('popupContainer');
  let restartButton = document.getElementById('restartButton');
  let pauseButton = document.getElementById('pauseButton');
  let playButton = document.getElementById('playButton');
  let pauseText = document.getElementById('pauseText');
  let playText = document.getElementById('playText');
  let timerElement = document.querySelector('.timer');
  let isPaused = false;

  // Function to start the timer
  function startTimer() {
    let secondsLeft = matchTimeout;

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
      const card = document.createElement('div');
      card.classList.add('card');
      const imageName = images[i].split('/').pop();

      card.classList.add(`card-image-${imageName}`);

      const cardInner = document.createElement('div');
      cardInner.classList.add('card-inner');

      const cardFront = document.createElement('div');
      cardFront.classList.add('card-front');
      const frontImage = document.createElement('img');
      frontImage.src = 'assets/images/card.jpg';
      frontImage.alt = 'Card Front Image';
      cardFront.appendChild(frontImage);

      const cardBack = document.createElement('div');
      cardBack.classList.add('card-back');
      const backImage = document.createElement('img');
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
    const rowContainers = document.querySelectorAll('.grid-game-row');

    if (rowContainers.length === 0) {
      const rowContainer1 = document.createElement('div');
      rowContainer1.classList.add('grid-game-row');

      const rowContainer2 = document.createElement('div');
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
      const rowContainer1 = rowContainers[0];
      const rowContainer2 = rowContainers[1];

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
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];

    const card1ImageName = Array.from(card1.classList).find(className =>
      className.startsWith('card-image-')
    );
    const card2ImageName = Array.from(card2.classList).find(className =>
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

    const shuffledImages = shuffle(uniqueImages);
    const allCards = createCards(shuffledImages);
    const duplicatedCards = allCards.map(card => {
      const clone = card.cloneNode(true);
      return clone;
    });

    combinedCards = shuffle(allCards.concat(duplicatedCards));

    createGrid(combinedCards);

    startTimer();

    displayScore();
  }

  // Function to end the round
  function endRound() {
    console.log('Ending round...');
    clearInterval(timer);

    if (score === numberOfCards / 2) {
      console.log('Congratulations! You completed the round!');
      round++;

      setTimeout(() => {
        alert(`Round ${round} coming up! Get ready for the next round.`);
        startRound(score);
      }, 1000);
    } else {
      console.log('Time ran out! Try again.');
      const playAgain = confirm('Do you want to play again?');
      if (playAgain) {
        startRound(score);
      } else {
        console.log('Game over');
      }
    }

    displayScore();
  }

  // Function to display the current score
  function displayScore() {
    const scoreElement = document.querySelector('.score-display');
    if (scoreElement) {
      scoreElement.textContent = score;
    }
  }

  // Start the initial round
  startRound();

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
    let secondsLeft = matchTimeout;

    updateTimerDisplay(secondsLeft);

    timer = setInterval(() => {
      secondsLeft--;

      if (secondsLeft <= 0) {
        clearInterval(timer);
        endRound();
      }

      updateTimerDisplay(secondsLeft);
    }, 1000);
  }

  // Function to pause the game
  function pauseGame() {
    console.log('Game paused.');
    clearInterval(timer);
    gridContainer.removeEventListener('click', handleCardClick);
    togglePlayPauseButton(true);
  }

  // Function to restart the game
  function resumeGame() {
    console.log('Game resumed.');
    startTimer();
    gridContainer.addEventListener('click', handleCardClick);
    togglePlayPauseButton(false);
  }

  // Event listener for card click
  function handleCardClick(event) {
    const clickedCard = event.target.closest('.card');

    if (!clickedCard || clickedCard.classList.contains('flipped')) {
      return;
    }

    flipCard(clickedCard);
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
      checkMatch();
    }
  }

  function handleCardClick(event) {
    const clickedCard = event.target.closest('.card');

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
});