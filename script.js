const gameContainer = document.getElementById("game");
const startGameBtn = document.getElementById("startGame_btn");
const restartGameBtn = document.getElementById("restart_btn");
const scoreboard = document.getElementById("currentScore");
const bestScoreboard = document.getElementById("highscore");
const difficultyBtn = document.getElementById("diffSection");
const difficultyBoard = document.getElementById("diffBoard");
let COLORS = [];
let scoreToBeat = "[No High Score]";
let clickedCard1;
let clickedCard2;
let cardFlipCount = 0;
let matchedCards = 0;
let score = 0;
let difficulty = document.querySelector('input[name="diffSetting"]:checked').value;
let pairCount = 5;
let shuffledColors;

function setPairCount(){
  if (difficulty === "Easy"){
    pairCount = 5;
  }else if (difficulty === "Intermediate"){
    pairCount = 10;
  }else if (difficulty === "Hard"){
    pairCount = 15;
  }else{
    pairCount = 5;
    console.log("default pair count")
  }
}

function getHighScore(diff){
  if (diff === "Easy"){
    scoreToBeat = localStorage.getItem("highscoreEasy");
  }else if (diff === "Intermediate"){
    scoreToBeat = localStorage.getItem("highscoreInt");
  }else if (diff === "Hard"){
    scoreToBeat = localStorage.getItem("highscoreHard");
  }
}

function setHighScore(score){
  if (difficulty === "Easy"){
    scoreToBeat = localStorage.setItem("highscoreEasy",score);
  }else if (difficulty === "Intermediate"){
    scoreToBeat = localStorage.setItem("highscoreInt",score);
  }else if (difficulty === "Hard"){
    scoreToBeat = localStorage.setItem("highscoreHard",score);
  }
}

function createColorsArray(pairs){
  for (let i = 0; i<pairs; i++){
    //generate a random color
    let color = genRgbColor()
    //create pair of color cards in COLORS array
    COLORS.push(color);
    COLORS.push(color);
  }
  console.log(COLORS);
}

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

function genRgbColor(){
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);
  return `rgb(${r},${g},${b})`;
}

// TODO: Implement this function!
function handleCardClick(event) {
  // If you click on a card that's already been matched then do nothing
  if (event.target.classList.contains("matched")){
    return;
  //If you attempt to click on a card that you've already revealed on your first guest, do nothing
  }else if (event.target === clickedCard1){
    return;
  }else{
    if (cardFlipCount < 2){
      event.target.style.backgroundColor = event.target.className //change the color of the clicked card to the designated color (by class name)
      cardFlipCount = ++cardFlipCount;
      if (cardFlipCount === 1){
        clickedCard1 = event.target;
      }else if (cardFlipCount === 2){
        clickedCard2 = event.target;
        //increment the score by 1 and display
        score = ++score;
        scoreboard.innerHTML = `Score: ${score}`;
        if (clickedCard1.className === clickedCard2.className){
          cardFlipCount = 0;
          //add the "matched" class to the matched cards to prevent users from clicking it again
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
      //compare score against highscore
      if(scoreToBeat ==="[No High Score]" || score < +scoreToBeat){
        alert("New Best Score!");
        setHighScore(score);
      }
      getHighScore(difficulty);
      bestScoreboard.innerHTML = `Score to Beat: ${scoreToBeat}`;
      //display difficulty section
      difficultyBtn.hidden = false;
      //display restart button
      restartGameBtn.hidden = false;
      //empty out the array
      COLORS = [];
    }
  }
}

//display the best score stored in localStorage
bestScoreboard.innerHTML = `Score to Beat: ${scoreToBeat}`;

startGameBtn.addEventListener("click", function(){
  startGameBtn.hidden = true;
  difficultyBtn.hidden = true;
  createColorsArray(pairCount);
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  //set the scoreboard based on difficulty
  scoreboard.innerHTML = `Score: 0`;
  difficultyBoard.innerHTML = `difficulty: ${difficulty}`;
  getHighScore(difficulty);
  bestScoreboard.innerHTML = `Score to Beat: ${scoreToBeat}`;
  console.log(gameContainer.children);
})

difficultyBtn.addEventListener("click", function(e){
  //reassign difficulty setting based on the selected radio button
  difficulty = document.querySelector('input[name="diffSetting"]:checked').value;
  setPairCount();
  console.log(`${difficulty}: ${pairCount}`);
  getHighScore(difficulty);
  bestScoreboard.innerText = `Score to Beat: ${scoreToBeat}`;
}) 

restartGameBtn.addEventListener("click", function(){
  //remove all divs
  while (gameContainer.lastChild) {
    gameContainer.removeChild(gameContainer.lastChild);
  }
  //reset all counters
  cardFlipCount = 0;
  matchedCards = 0;
  score = 0;
  //reset the scoreboards
  scoreboard.innerHTML = `Score: 0`;
  getHighScore(difficulty);
  bestScoreboard.innerHTML = `Score to Beat: ${scoreToBeat}`;
  difficultyBoard.innerHTML = `difficulty: ${difficulty}`;
  //recreate the COLORS array and shuffle
  createColorsArray(pairCount);
  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  restartGameBtn.hidden = true;
  difficultyBtn.hidden = true;
})

// when the DOM loads
restartGameBtn.hidden = true;

//initialize high scores in local storage for first time players
if(localStorage.getItem("highscoreEasy")===null){
  localStorage.setItem("highscoreEasy","[No High Score]")
}
if(localStorage.getItem("highscoreInt")===null){
  localStorage.setItem("highscoreInt","[No High Score]")
}
if(localStorage.getItem("highscoreHard")===null){
  localStorage.setItem("highscoreHard","[No High Score]")
}

//initialize best score based on the fact that the default difficulty selected is "Easy"
getHighScore("Easy");
bestScoreboard.innerText = `Score to Beat: ${scoreToBeat}`;