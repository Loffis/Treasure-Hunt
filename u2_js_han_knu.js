"use strict";

let score = 0;
let scoreText;
let chestWithTreasure;
let photoArray = [];

document.addEventListener("DOMContentLoaded", function() {
  createScoreBoard();
  updateScoreBoard();
  init();
});

function init(){
  initChests();
  initChestEventListener();
  initRefreshButton();
  placeTreasure();
  getImagesFromPexels();
}

function createScoreBoard(){
  scoreText = document.createElement("h2");
  scoreText.style.margin = "auto";
  scoreText.style.color = "white";
  scoreText.style.paddingTop = "10px";
  document.getElementById("game-wrapper").appendChild(scoreText);
}

function updateScoreBoard(){
  scoreText.innerHTML = `Score: ${score}`;
}

function initChests(){
  document.getElementById("chests").innerHTML = 
  `<img src="images/chest-closed.png" id="0" style="padding: 10px;">
  <img src="images/chest-closed.png" id="1" style="padding: 10px;">
  <img src="images/chest-closed.png" id="2" style="padding: 10px;">`;
}

function initChestEventListener(){
  document.getElementById("chests").addEventListener("click", controlChestClicked);
}

function initRefreshButton(){
  document.getElementById("refresh-button").addEventListener("click", init);
}

function placeTreasure(){
  chestWithTreasure = randomNumber(3);
  console.log(chestWithTreasure);
}

function getImagesFromPexels(){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://api.pexels.com/v1/search?query=gems&per_page=15&page=1", true);
  xhr.setRequestHeader('Authorization', '563492ad6f91700001000001e74ce58377b24ed0898be9003241c7ff');
  xhr.addEventListener("load", function(){
    if (xhr.readyState == 4 && xhr.status == 200){
      var data = JSON.parse(this.responseText);
      for (let i = 0; i < data.photos.length - 1; i++){
        photoArray[i] = data.photos[i].src.tiny;
      }
    }
  });
  xhr.send();  
}

function controlChestClicked(e){
  if (e.srcElement.id == chestWithTreasure){
    score += 5;
    win(e.srcElement.id);
  } else {
    lose(e.srcElement.id);
  }
}

function win(chestIdWithTreasure){
  updateScoreBoard();
  removeEvents();

  document.getElementById(chestIdWithTreasure).src =
  photoArray[randomNumber(photoArray.length)];

  document.getElementById(chestIdWithTreasure).style.width = "200px";
  document.getElementById(chestIdWithTreasure).style.heigth = "150px";
}

function lose(chestIdWithTreasure){
  removeEvents();
  document.getElementById(chestIdWithTreasure).src = "images/chest-open.png";
}

function randomNumber(max){
  return Math.floor(Math.random() * max);
}

function removeEvents(){
  document.getElementById("chests").removeEventListener("click", controlChestClicked);
}
