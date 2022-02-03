var canvas;
var backgroundImage, tiger_img, monkey_img, horse_img, lion_img;
var powerCoinImage, lifeImage, resetButton;
var obstacle1Image, obstacle2Image;
var database, gameState;
var form, player, playerCount;
var allPlayers, tiger, lion,monkey,horse, fuels, powerCoins, obstacles;
var players = [];

function preload() {
  backgroundImage = loadImage("assets/background.jpg");
  lion_img = loadAnimation("assets/lion1.png","assets/lion2.png","assets/lion3.png","assets/lion4.png","assets/lion5.png","assets/lion6.png","assets/lion7.png");
  horse_img = loadAnimation("assets/horse1.png","assets/horse2.png","assets/horse3.png","assets/horse4.png","assets/horse5.png","assets/horse6.png","assets/horse7.png","assets/horse8.png");
  monkey_img = loadAnimation("assets/monkey1.png","assets/monkey2.png","assets/monkey3.png","assets/monkey4.png","assets/monkey5.png","assets/monkey6.png","assets/monkey7.png","assets/monkey8.png");
  tiger_img = loadAnimation("assets/tiger1.png","assets/tiger2.png","assets/tiger3.png","assets/tiger4.png","assets/tiger5.png","assets/tiger6.png","assets/tiger7.png","assets/tiger8.png","assets/tiger9.png","assets/tiger10.png");
  powerCoinImage = loadImage("assets/coin.png");
  obstacle1Image=loadImage("assets/treelog.png");
  obstacle2Image=loadImage("assets/stone.png");
  restartButton=loadImage("assets/restart button.png");
 }

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();
}

function draw() {
  background(backgroundImage);
  if (playerCount === 4) {
    game.update(1);
  }

  if (gameState === 1) {
    game.play();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
