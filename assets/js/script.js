/**
 * Game JS 
 */

// Declaring variables for scoring & timer
let moves = 0; // Number of moves made by the player
let score = 0; // Player's score
let timer; // Timer variable for the countdown
const matchTimeout = 60; // Time limit in seconds for each round
let round = 1; // Variable to track the current round

// Define the number of cards
const numberOfCards = 8;

function startTimer() {
  const timerElement = document.querySelector('.timer');
  let secondsLeft = matchTimeout;

  timer = setInterval(() => {
    secondsLeft--; // Decrement the number of seconds left by 1
    timerElement.textContent = ' ' + secondsLeft; // Update the timer element with the remaining time

    if (secondsLeft <= 0) { // If the time runs out
      clearInterval(timer); // Stop the timer
      endRound(); // Call the function to handle the end of the round
    }
  }, 1000); // Run the timer function every 1 second (1000 milliseconds)
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Shuffle function using sort()
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Array of unique image paths
const uniqueImages = [
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

// Shuffle the array of images randomly
const shuffledImages = shuffle(uniqueImages);

// Store flipped cards and matched pairs count
let flippedCards = [];
let matchedPairs = 0;

// Get the container for the card grid
const gridContainer = document.querySelector('.grid-game-container');
// Create the card elements dynamically and assign the shuffled images
function createCards(images) {
  const cards = [];
  for (let i = 0; i < 4; i++) { // Limiting the loop to create only 4 cards
    const card = document.createElement('div');
    card.classList.add('card');
    // Get the filename from the image source
    const imageName = images[i].split('/').pop();

    // Assign a custom class to the card element based on the image filename
    card.classList.add(`card-image-${imageName}`);

    // Creates a new div element and assigns it to the cardInner variable
    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    // Creates the back side of a card by creating a div and adding one img
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    const frontImage = document.createElement('img');
    frontImage.src = 'assets/images/card.jpg';
    frontImage.alt = 'Card Front Image';
    cardFront.appendChild(frontImage);

    // Creates the front side of a card by creating a div with an img and then retrieves one of the images from the shuffled images array
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    const backImage = document.createElement('img');
    backImage.src = images[i];
    backImage.alt = 'Card Back Image';
    cardBack.appendChild(backImage);

    // Creates a card with distinct front and back sides, within the outer card container using appendChild().
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    cards.push(card);
  }
  return cards;
}

function createGrid(cards) {
  const rowContainers = document.querySelectorAll('.grid-game-row');

  if (rowContainers.length === 0) {
    // Create two row containers if they don't exist
    const rowContainer1 = document.createElement('div');
    rowContainer1.classList.add('grid-game-row');

    const rowContainer2 = document.createElement('div');
    rowContainer2.classList.add('grid-game-row');

    // Place half of the shuffled cards in each row container
    for (let i = 0; i < cards.length; i++) {
      if (i < cards.length / 2) {
        rowContainer1.appendChild(cards[i]);
      } else {
        rowContainer2.appendChild(cards[i]);
      }
    }

    // Adds grid structure into the DOM
    gridContainer.appendChild(rowContainer1);
    gridContainer.appendChild(rowContainer2);
  } else {
    // Replace the cards in the existing row containers
    const rowContainer1 = rowContainers[0];
    const rowContainer2 = rowContainers[1];

    while (rowContainer1.firstChild) {
      rowContainer1.removeChild(rowContainer1.firstChild);
    }

    while (rowContainer2.firstChild) {
      rowContainer2.removeChild(rowContainer2.firstChild);
    }

    // Place half of the shuffled cards in each row container
    for (let i = 0; i < cards.length; i++) {
      if (i < cards.length / 2) {
        rowContainer1.appendChild(cards[i]);
      } else {
        rowContainer2.appendChild(cards[i]);
      }
    }
  }
}

// Card click event listener
gridContainer.addEventListener('click', handleCardClick);
//retrieves the clicked card element
function handleCardClick(event) {
  const clickedCard = event.target.closest('.card');

  // Ignore clicks on already flipped cards or non-card elements
  if (!clickedCard || clickedCard.classList.contains('flipped')) {
    return;
  }
  //If the clicked card is valid and not already flipped,
  flipCard(clickedCard);
  flippedCards.push(clickedCard);

  //After flipping the card and adding it to the array, 
  //it checks if two cards are currently flipped.
  //If two cards are flipped, it calls the checkMatchfunction to check if they match.
  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function flipCard(card) {
  console.log('Flipping card:', card);
  // Check if the card is already matched
  if (card.classList.contains('matched')) {
    return; // If the card is matched, do nothing and return
  }
  // Toggle the 'flipped' class to flip the card
  card.classList.toggle('flipped');
}

function checkMatch() {
  // Get the references to the flipped cards
  const card1 = flippedCards[0];
  const card2 = flippedCards[1];

  // Extract the class name containing the image name for each card
  const card1ImageName = Array.from(card1.classList).find(className =>
    className.startsWith('card-image-')
  );
  const card2ImageName = Array.from(card2.classList).find(className =>
    className.startsWith('card-image-')
  );

  // Check if the image names of the two cards match
  if (card1ImageName === card2ImageName) {
    // Match
    // Add the "matched" class to the cards to visually indicate a match
    card1.classList.add('matched');
    card2.classList.add('matched');
    // Award 1 point for each match
    score++;
    console.log('Score:', score);
    displayScore();
    // Increment the count of matched pairs
    matchedPairs++;
    // Clear the flippedCards array since the cards are now matched
    flippedCards = [];
    // Check if all pairs have been matched and the game is completed
    if (matchedPairs === numberOfCards / 2) {
      // Game completed
      // Display final score and option to restart
      console.log('All matches found!');
      setTimeout(() => {
        endRound(); // Start the next round after a delay
      }, 1000); // Delay of 1 second (1000 milliseconds)
      return; // Exit the function early
    }

    // Update the score display
    displayScore();

  } else {
    // No match
    // Wait for 1 second and then flip back the cards that didn't match
    setTimeout(() => {
      // If the first card is not already matched, flip it back
      if (!card1.classList.contains('matched')) {
        flipCard(card1);
      }
      // If the second card is not already matched, flip it back
      if (!card2.classList.contains('matched')) {
        flipCard(card2);
      }
      // Clear the flippedCards array since the cards didn't match
      flippedCards = [];
    }, 1000);
  }
}

// Function to start a round
function startRound(previousScore = 0) {
  console.log('Starting round...');
  // Reset game state and variables
  moves = 0;
  score = previousScore; // Use the previous score as the starting score for the new round
  matchedPairs = 0;
  flippedCards = [];

  // Shuffle the images and create the cards
  const shuffledImages = shuffle(uniqueImages);
  const allCards = createCards(shuffledImages);

  // Duplicate the created cards to create pairs
  const duplicatedCards = allCards.map(card => {
    const clone = card.cloneNode(true);
    return clone;
  });

  // Combine the original and duplicated cards
  const combinedCards = shuffle(allCards.concat(duplicatedCards));

  // Create the grid and place the cards
  createGrid(combinedCards);

  // Start the timer
  startTimer();

  // Display the current round and score
  displayScore();
}

function endRound() {
  console.log('Ending round...');
  // Stop the timer
  clearInterval(timer);

  if (score === numberOfCards / 2) {
    // All cards matched
    console.log('Congratulations! You completed the round!');
    round++; // Increment the round number

    setTimeout(() => {
      // Show a popup to inform the user about progressing to the next round
      alert(`Round ${round} coming up! Get ready for the next round.`);
      startRound(score); // Start a new round with the current score
    }, 1000); // Delay of 1 second (1000 milliseconds)
  } else {
    // Time ran out
    console.log('Time ran out! Try again.');
    // Prompt the user to try again
    const playAgain = confirm('Do you want to play again?');
    if (playAgain) {
      startRound(score); // Start the next round and pass the current score
    } else {
      console.log('Game over'); // Game over message or other actions
    }
  }
  // Update the score display
  displayScore();
}

function displayScore() {
  const scoreElement = document.querySelector('.score-display');
  if (scoreElement) {
    scoreElement.textContent = score;
  }
}

// Start the initial round
startRound();