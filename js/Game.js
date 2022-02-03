class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leadeboardTitle = createElement("h2");

    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.leader3 = createElement("h2");
    this.leader4 = createElement("h2");

    this.playerMoving = false
  }

  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    lion = createSprite(10, height - 200);
    lion.addAnimation("lion", lion_img);
    lion.scale = 1.5;

    horse = createSprite(30, height - 150);
    horse.addAnimation("horse", horse_img);
    horse.scale = 1.5;

      monkey = createSprite(45, height - 250);
    monkey.addAnimation("monkey", monkey_img);
    monkey.scale = 1.5;

    tiger = createSprite(46, height - 100);
    tiger.addAnimation("tiger", tiger_img);
    tiger.scale = 2.1;


    players = [horse, lion, monkey, tiger];

    
    powerCoins = new Group();

    obstacles = new Group();

    var obstaclesPositions = [
      { x: width + 2 + 4000, y: height - 10, image: obstacle2Image },
      { x: width + 2 - 3500, y: height - 20, image: obstacle1Image },
      { x: width + 2 + 2500, y: height - 37, image: obstacle1Image },
      { x: width + 2 - 3000, y: height - 80, image: obstacle2Image },
      { x: width + 2 + 3900, y: height - 20, image: obstacle2Image },
      { x: width + 2 - 3500, y: height - 15, image: obstacle1Image },
      { x: width + 2 + 4000, y: height - 10, image: obstacle2Image },
      { x: width + 2 + 2000, y: height - 23, image: obstacle2Image },
      { x: width + 2 - 4500, y: height - 16, image: obstacle1Image },
      { x: width + 2 + 1200, y: height - 13, image: obstacle2Image },
      { x: width + 2 - 4000, y: height - 14, image: obstacle1Image },
      { x: width + 2 - 4500, y: height - 17, image: obstacle2Image },
      { x: width + 2 + 2200, y: height - 19, image: obstacle2Image },
      { x: width + 2 - 3000, y: height - 20, image: obstacle1Image },
      ];

    
    // Adding coin sprite in the game
    this.addSprites(powerCoins, 18, powerCoinImage, 0.5);

    //Adding  sprite in the game
    this.addSprites(
      obstacles,
      obstaclesPositions.length,
      obstacle1Image,
      0.3,
      obstaclesPositions
    );

    this.addSprites(
      obstacles,
      obstaclesPositions.length,
      obstacle2Image,
      0.3,
      obstaclesPositions
    );
  }
  addSprites(spriteGroup, numberOfSprites, spriteImage, scale, positions = []) {
    for (var i = 0; i < numberOfSprites; i++) {
      var x, y;

      //C41 //SA
      if (positions.length > 0) {
        x = positions[i].x;
        y = positions[i].y;
        spriteImage = positions[i].image;
      } else {
        x = random(-width *2, width*6 - 400);
        y = random(height-10, height-60);
      }
      var sprite = createSprite(x, y);
      sprite.addImage("sprite", spriteImage);

      sprite.scale = scale;
      spriteGroup.add(sprite);
      sprite.setCollider("circle",0,0,90)
      sprite.debug=true
    }
  }

  handleElements() {
    form.hide();
    //form.titleImg.position(40, 50);
    //form.titleImg.class("gameTitleAfterEffect");

    //C39
    this.resetTitle.html("Reset Game");
    this.resetTitle.class("resetText");
    this.resetTitle.position(width / 2 + 200, 40);

    this.resetButton.class("resetButton");
    this.resetButton.position(width / 2 + 230, 100);

    this.leadeboardTitle.html("Leaderboard");
    this.leadeboardTitle.class("resetText");
    this.leadeboardTitle.position(width / 3 - 60, 40);

    this.leader1.class("leadersText");
    this.leader1.position(width / 3 - 50, 80);

    this.leader2.class("leadersText");
    this.leader2.position(width / 3 - 50, 130);

    this.leader3.class("leadersText");
    this.leader3.position(width / 3 - 50, 180);

    this.leader4.class("leadersText");
    this.leader4.position(width / 3 - 50, 230);
  }

  play() {
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getAnimalsAtEnd();

    if (allPlayers !== undefined) {
      image( backgroundImage, -width * 5, height , width*6, height);

      
     /* this.showLife();*/
      this.showLeaderboard();

      //index of the array
      var index = 0;
      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        players[index - 1].position.x = x;
        players[index - 1].position.y = y;
              
        if (index === player.index) {
        /*  stroke(10);
          fill("red");
          ellipse(x, y, 20, 20);*/

           this.handlePowerCoins(index);

          // Changing camera position in y direction
          camera.position.x = players[index - 1].position.x;
        }
      }
      if(this.playerMoving){
        player.positionX+=5
        player.update()
      }

      // handling keyboard events
      this.handlePlayerControls();
this.handlePowerCoins(index)

      // Finshing Line
      const finshLine = width * 4 - 100;

      if (player.positionX > finshLine) {
        gameState = 2;
        player.rank += 1;
        Player.updateAnimalsAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      drawSprites();
    }
  }

  handleResetButton() {
    this.resetButton.mousePressed(() => {
      database.ref("/").set({
        playerCount: 0,
        gameState: 0,
        players: {},
        animalsAtEnd: 0
      });
      window.location.reload();
    });
  }

  /*showLife() {
    push();
    image(lifeImage, width / 2 - 130, height - player.positionY - 300, 20, 20);
    fill("white");
    rect(width / 2 - 100, height - player.positionY - 300, 185, 20);
    fill("#f50057");
    rect(width / 2 - 100, height - player.positionY - 300, player.life, 20);
    noStroke();
    pop();
  }*/

  

  showLeaderboard() {
    var leader1, leader2, leader3, leader4;
    var players = Object.values(allPlayers);
    if (
      (players[0].rank === 0 && players[1].rank === 0 && players[2].rank === 0 && players[3].rank === 0) ||
      players[0].rank === 1
    ) {
      // &emsp;    This tag is used for displaying four spaces.
      leader1 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader2 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader3 =
        players[2].rank +
        "&emsp;" +
        players[2].name +
        "&emsp;" +
        players[2].score;

      leader4 =
        players[3].rank +
        "&emsp;" +
        players[3].name +
        "&emsp;" +
        players[3].score;
    }

    if (players[1].rank === 1) {
      leader1 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader3 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader4 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;
    }

    if (players[2].rank === 1) {
      leader1 =
        players[2].rank +
        "&emsp;" +
        players[2].name +
        "&emsp;" +
        players[2].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader3 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader4 =
        players[3].rank +
        "&emsp;" +
        players[3].name +
        "&emsp;" +
        players[3].score;
    }

    if (players[3].rank === 1) {
      leader1 =
        players[3].rank +
        "&emsp;" +
        players[3].name +
        "&emsp;" +
        players[3].score;

      leader2 =
        players[0].rank +
        "&emsp;" +
        players[0].name +
        "&emsp;" +
        players[0].score;

      leader3 =
        players[1].rank +
        "&emsp;" +
        players[1].name +
        "&emsp;" +
        players[1].score;

      leader4 =
        players[2].rank +
        "&emsp;" +
        players[2].name +
        "&emsp;" +
        players[2].score;
    }

    this.leader1.html(leader1);
    this.leader2.html(leader2);
    this.leader3.html(leader3);
    this.leader4.html(leader4);
  }

  handlePlayerControls() {
    if (keyWentUp("space")) {
      player.positionY -= 100;
      
      player.update();
      this.playerMoving = true
    }if (keyWentDown("space")) {
      player.positionY += 100;
      
      player.update();
      this.playerMoving = true
    }

   /* if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) {
      player.positionX -= 5;
      player.update();
    }*/

    if (keyIsDown(RIGHT_ARROW) ) {
      player.positionX += 5;
      player.update();
    }
  }

 
  handlePowerCoins(index) {
    players[index - 1].overlap(powerCoins, function(collector, collected) {
      player.score += 21;
      player.update();
      //collected is the sprite in the group collectibles that triggered
      //the event
      collected.remove();
    });
  }

  showRank() {
    swal({
      title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`,
      text: "You reached the finish line successfully",
      imageUrl:
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok"
    });
  }

  gameOver() {
    swal({
      title: `Game Over`,
      text: "Oops you lost the race....!!!",
      imageUrl:
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Thanks For Playing"
    });
  }
}
