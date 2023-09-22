const gameContainer = document.getElementById("game");
let clickedCard1;
let clickedCard2;
let cardFlipCount = 0;
let matchedCards = 0;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}
// function dedicated to resetting 
function flipCardsBack(){
  //set timeout to flip the backgroundColor back to default after 1 second
  setTimeout(function() {
    clickedCard1.style.backgroundColor = null;
    clickedCard2.style.backgroundColor = null;
    cardFlipCount = 0;
    clickedCard1 = null;
    clickedCard2 = null;
  }, 1000);
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  if (event.target.classList.contains("matched")){
    return;
  }else if (event.target === clickedCard1){
    return;
  }else{
    if (cardFlipCount < 2){
      event.target.style.backgroundColor = event.target.className
      cardFlipCount = ++cardFlipCount;
      console.log(`card flip count: ${cardFlipCount}`);
      if (cardFlipCount === 1){
        clickedCard1 = event.target;
      }else if (cardFlipCount === 2){
        clickedCard2 = event.target;
        if (clickedCard1.className === clickedCard2.className){
          cardFlipCount = 0;
          //remove the classNames from the matched elements
          clickedCard1.classList.add("matched");
          matchedCards++;
          clickedCard2.classList.add("matched");
          matchedCards++;
          clickedCard1 = null;
          clickedCard2 = null;
        }else{
          flipCardsBack()
        }
      }
    }
    if(matchedCards === COLORS.length){
      console.log("DONE!");
    }
  }
}

// when the DOM loads
createDivsForColors(shuffledColors);
