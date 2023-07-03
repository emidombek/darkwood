/**
 * Game JS 
 */

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
// For loop runs 4 times, creating 4 <div> elements with the 'card' class
for (let i = 0; i < 4; i++) {
  const card = document.createElement('div');
  card.classList.add('card');

  // Get the filename from the image source
  const imageName = shuffledImages[i].split('/').pop();

  // Assign a custom class to the card element based on the image filename
  card.classList.add(`card-image-${imageName}`);

  // Creates a new  div element and assigns it to the cardInner variable
  const cardInner = document.createElement('div');
  cardInner.classList.add('card-inner');

  // Creates the back side of a card by created a div and adding one img
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
  backImage.src = shuffledImages[i];
  backImage.alt = 'Card Back Image';
  cardBack.appendChild(backImage);

  // Creates a card with distinct front and back sides, within the outer card container usign appendChild().
  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);

  /* 
  /**If else statement that determines whether the card should be placed in the first row or 
   * the second row based on the value of i. 
   * If i is less than 4, it is placed in the first row, 
   * and if i is greater than or equal to 4, it is placed in the second row.
   */
  if (i < 4) {
    const firstGridRow = gridContainer.querySelector('.grid-game-row:first-child');
    firstGridRow.appendChild(card);
  } else {
    const secondGridRow = gridContainer.querySelector('.grid-game-row:last-child');
    secondGridRow.appendChild(card);
  }

}

// Duplicate the created cards to create pairs
const allCards = gridContainer.querySelectorAll('.card');
const duplicatedCards = Array.from(allCards).map(card => card.cloneNode(true));

// Combine the original and duplicated cards
const combinedCards = Array.from(allCards).concat(duplicatedCards);

// Shuffle the combined array of cards
const shuffledCards = shuffle(combinedCards);

// Get the total number of cards
const numberOfCards = shuffledCards.length;

// Create two row containers
const rowContainer1 = document.createElement('div');
rowContainer1.classList.add('grid-game-row');

const rowContainer2 = document.createElement('div');
rowContainer2.classList.add('grid-game-row');

// Place half of the shuffled cards in each row container
for (let i = 0; i < shuffledCards.length; i++) {
  if (i < shuffledCards.length / 2) {
    rowContainer1.appendChild(shuffledCards[i]);
  } else {
    rowContainer2.appendChild(shuffledCards[i]);
  }
}

gridContainer.appendChild(rowContainer1);
gridContainer.appendChild(rowContainer2);

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
  const card1 = flippedCards[0];
  const card2 = flippedCards[1];
  const card1ImageName = Array.from(card1.classList).find(className =>
    className.startsWith('card-image-')
  );
  const card2ImageName = Array.from(card2.classList).find(className =>
    className.startsWith('card-image-')
  );

  if (card1ImageName === card2ImageName) {
    // Match
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    flippedCards = [];

    if (matchedPairs === numberOfCards / 2) {
      // Game completed
      // Display final score and option to restart
      console.log('All matches found!');
    }
  } else {
    // No match
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