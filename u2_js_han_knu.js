"use strict";

/**
 * @param {number} score              Player's score
 * @param {object} scoreText          H2-element which displays player's score
 * @param {number} chestWithTreasure  Index of chest with treasure
 * @param {object} photoArray         Array of URLs of photos
 */

let score = 0;
let scoreText;
let chestWithTreasure;
let photoArray = [];

// Runs three functions when the HTML page has finished loading
document.addEventListener("DOMContentLoaded", function() {
  createScoreBoard();
  updateScoreBoard();
  initRefreshButton();
  init();
});

// Initialization, runs on start, and after clicking 'Try again' 
function init(){
  initChests();
  initChestEventListener();
  placeTreasure();
  getImagesFromPexels();
}

// Creates the score board, a H2 element
function createScoreBoard(){
  scoreText = document.createElement("h2");
  scoreText.style.margin = "auto";
  scoreText.style.color = "white";
  scoreText.style.paddingTop = "10px";
  document.getElementById("game-wrapper").appendChild(scoreText);
}

// Updates the scoreboard
function updateScoreBoard(){
  scoreText.innerHTML = `Score: ${score}`;
}

// Runs init() when 'Try again' button has been clicked
function initRefreshButton(){
  document.getElementById("refresh-button").addEventListener("click", init);
}

// Displays images of three closed chests in div with id chests
// The chests are given the id:s 0, 1 and 2
function initChests(){
  document.getElementById("chests").innerHTML =
  `<img src="images/chest-closed.png" id="0" style="padding: 10px;">
  <img src="images/chest-closed.png" id="1" style="padding: 10px;">
  <img src="images/chest-closed.png" id="2" style="padding: 10px;">`;
}

// Runs controlChestClicked() when element with id chests has been clicked
function initChestEventListener(){
  document.getElementById("chests").addEventListener("click", controlChestClicked);
}

// Assigns chestWithTreasure the value 0, 1 or 2
function placeTreasure(){
  chestWithTreasure = randomNumber(3);
}

/**
 * @desc Gets array of URL:s from pexels.com
 * Search word is 'gems'
 * 1 page = maximum 15 URL:s
 * 
 * Checks length of data = number of images
 * and copies this to an array (photoArray)
 * 
 * Copies the smallest images available (tiny)
 * 
 * @param {object} xhr  The XMLHttpRequest object
 * @param {object} data Downloaded data from Pexels
 */
function getImagesFromPexels(){
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.pexels.com/v1/search?query=gems&per_page=15&page=1", true);
  xhr.setRequestHeader("Authorization", "563492ad6f91700001000001e74ce58377b24ed0898be9003241c7ff");
  xhr.addEventListener("load", function(){
    if (xhr.readyState == 4 && xhr.status == 200){
      let data = JSON.parse(this.responseText);
      for (let i = 0; i < data.photos.length - 1; i++){
        photoArray[i] = data.photos[i].src.tiny;
      }
    }
  });
  xhr.send();
}

/**
 * @desc Checks if id of clicked chest is equal to
 * chest with treasure.
 * If values match, run function win() with parameter e.srcElement.id
 * If not, run function lose() with parameter e.srcElement.id
 * 
 * @param {number}  chestWithTreasure   Earlier given the number 0, 1 or 2
 * @param {object}  e                   uses .srcElement.id which is 0, 1 or 2 
 */
function controlChestClicked(e){
  if (e.srcElement.id == chestWithTreasure){
    score += 5;
    win(e.srcElement.id);
  } else {
    lose(e.srcElement.id);
  }
}

/**
 * @desc Opens chest with treasure
 * Gets a random photo from the photoArray
 * 
 * Runs functions updateScoreBoard() and removeEvents()
 * 
 * @param {number} chestIdWithTreasure 0, 1 or 2. For chosing correct chest to
 * open
 */
function win(chestIdWithTreasure){
  updateScoreBoard();
  removeEvents();

  document.getElementById(chestIdWithTreasure).src =
  photoArray[randomNumber(photoArray.length)];

  document.getElementById(chestIdWithTreasure).style.width = "200px";
  document.getElementById(chestIdWithTreasure).style.heigth = "150px";
  document.getElementById(chestIdWithTreasure).alt = "Oh no! Something terrible has occured! Here your treasure should have been revealed!";
}

/**
 * @desc Displays open chest at id chestIdWithoutTreasure if wrong chest has been clicked 
 * @param {number} chestIdWithoutTreasure 
 */
function lose(chestIdWithoutTreasure){
  removeEvents();
  document.getElementById(chestIdWithoutTreasure).src = "images/chest-open.png";
}

/**
 * @desc Returns random number
 * @param {number} max Parameter which is the maximum number - 1 to be retrieved
 * @returns {number} a number from 0 to (max - 1)
 */
function randomNumber(max){
  return Math.floor(Math.random() * max);
}

// Removes mouse click event on div with id chests
function removeEvents(){
  document.getElementById("chests").removeEventListener("click", controlChestClicked);
}