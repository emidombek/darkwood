/**
 * Game JS
 */

// Shuffle function using sort()
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Array of unique image paths
const uniqueImages = [
  '../images/dazbog_card.jpg',
  '../images/dola_card.jpg',
  '../images/dziewanna_card.jpg',
  '../images/lada_card.jpg',
  '../images/leszy_card.jpg',
  '../images/mokosz_card.jpg',
  '../images/morana_card.jpg',
  '../images/perun_card.jpg',
  '../images/rod_card.jpg',
  '../images/swietowit_card.jpg',
  '../images/veles_card.jpg',
  '../images/zywia_card.jpg',
];

// Duplicate the unique images for pairs using spread operator
const allImages = [...uniqueImages, ...uniqueImages];

// Shuffle the array of images randomly
const shuffledImages = shuffle(allImages);

// Get the container for the card grid
const gridContainer = document.querySelector('.grid-game-container');

// Create the card elements dynamically and assign the shuffled images
// For loop runs 8 times, creating 8 <div> elements with the 'card' class
for (let i = 0; i < 8; i++) {
  const card = document.createElement('div');
  card.classList.add('card');

  // Creates a new  div element and assigns it to the cardInner variable
  const cardInner = document.createElement('div');
  cardInner.classList.add('card-inner');

  // Creates the front side of a card by creating a div with an img and then retrieves one of the images from the shuffled images array 
  const cardFront = document.createElement('div');
  cardFront.classList.add('card-front');
  const frontImage = document.createElement('img');
  frontImage.src = shuffledImages[i];
  frontImage.alt = 'Card Image';
  cardFront.appendChild(frontImage);

  // Creates the back side of a card by created a div and adding one img
  const cardBack = document.createElement('div');
  cardBack.classList.add('card-back');
  const backImage = document.createElement('img');
  backImage.src = '../images/card.jpg';
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