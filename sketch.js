//Create variables here
var dog, happyDog, hungryDog, foodS, foodStockRef, database;
var frameCountNow = 0;
var fedTime, lastFed, foodObject, currentTime;
var milk, input, name;
var gameState = "hungry";
var gameStateRef;
var bedroomImage, gardenImage, washroomImage, sleepImage, runImage;
var feed, addFood;
var input, button;

function preload()
{
	//load images here
hungryDog = loadImage("Images/dogImg.png");
happyDog = loadImage("Images/dogImg1.png");
bedroomImage = loadImage("Images/Bed Room.png");
gardenImage = loadImage("Images/Garden.png");
washroomImage = loadImage("Images/Wash Room.png");
sleepImage = loadImage("Images/Lazy.png");
runImage = loadImage("Images/running.png");
}

function setup() {
  createCanvas(1200, 500);
  database = firebase.database();

  foodObject = new Food();

  dog = createSprite(width/2+250,height/2,10,10);
  dog.addAnimation("hungry",hungryDog);
  dog.addAnimation("happy",happyDog);
  dog.addAnimation("sleeping",sleepImage);
  dog.addAnimation("run",runImage);
  dog.scale = 0.3;

  getGameState();

  feed=createButton("Feed The Dog");
feed.position(950,95);
feed.mousePressed(feedDog);

addFood=createButton("Add Food");
addFood.position(1050,95);
addFood.mousePressed(addFoods);

input = createInput("Pet name");
input.position(950,120);

button = createButton("confirm");
button.position(1000,145);
button.mousePressed(createName);
}

function draw() {  
  currentTime = hour();
if(currentTime === lastFed + 1) {
  gameState = "playing";
  updateGameState();
  foodObject.garden();
}
else if(currentTime === lastFed + 2){
  gameState = "sleeping";
  updateGameState();
  foodObject.bedroom();
}
else if(currentTime > lastFed + 2 && currentTime <= lastFed + 4){
  gameState = "bathing";
  updateGameState();
  foodObject.washroom();
}
else{
  gameState = "hungry";
  updateGameState();
  foodObject.display();
}
//console.log(gameState);

foodObject.getFoodStock();
//console.log(foodStock);
getGameState();

  fedTime = database.ref('feedTime');
  fedTime.on("value",function(data){
lastFed = data.val();
  })

if(gameState === "hungry"){
  feed.show();
  addFood.show();
  dog.addAnimation("hungry",happyDog);
}
else {
  feed.hide();
  addFood.hide();
  dog.remove();
}
  
  drawSprites();
  //add styles here
  textSize(32);
  fill("red");
  //text("Amount of Food: "+foodStock,width/2-150,50);
  textSize(20);
  text("Last fed: "+lastFed+":00",300,95);
  //text("Press the up arrow Key to feed the dog!",width/2-200,100);
  text("Time since last fed: "+(currentTime - lastFed),300,125);
}

function feedDog(){
  foodObject.deductFood();
  foodObject.updateFoodStock();
  dog.changeAnimation("happy", happyDog);
  gameState = "happy";
  updateGameState();
}

function addFoods(){
  foodObject.addFood();
  foodObject.updateFoodStock();
}

async function hour(){
  var site = await fetch("http://worldtimeapi.org/api/timezone/america/new_york");
  var siteJSON = await site.json();
  var datetime = siteJSON.datetime;
  var hourTime = datetime.slice(11,13);
  return hourTime;
}

function createName(){
  input.hide();
  button.hide();

  name = input.value();
  var greeting = createElement('h3');
  greeting.html("pet's name: "+name);
  greeting.position(width/2+850,height/2+200);
}

function getGameState(){
  gameStateRef = database.ref('gameState');
  gameStateRef.on("value",function(data){
gameState = data.val();
//console.log(gameState);
  });
};

function updateGameState(){
  database.ref('/').update({
    gameState: gameState
  })
}







