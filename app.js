const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//getContext() 會回傳canvas的drawing context
//drawing context可以用來再canvas內畫圖
const unit = 20;
const row = canvas.height / unit; // 480 / 20
const column = canvas.width / unit; // 720 / 20

let snake = []; //array中的每個元素都是一個物件
//物件的工作是儲存身體的xy座標

function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overlapping = false;
    let newX;
    let newY;

    function checkOverlap(newX, newY) {
      for (let i = 0; i < snake.length; i++) {
        if (newX == snake[i].x && newY == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      newX = Math.floor(Math.random() * column) * unit;
      newY = Math.floor(Math.random() * row) * unit;
      checkOverlap(newX, newY);
    } while (overlapping);

    this.x = newX;
    this.y = newY;
  }
}

//初始設定
createSnake();
let myFruit = new Fruit();
let myFruit2 = new Fruit();
let myFruit3 = new Fruit();

window.addEventListener("keydown", changeDirection);

let d = "right";

function changeDirection(e) {
  if ((e.key == "ArrowDown" || e.key == "s") && d != "up") {
    d = "down";
  } else if ((e.key == "ArrowUp" || e.key == "w") && d != "down") {
    d = "up";
  } else if ((e.key == "ArrowRight" || e.key == "d") && d != "left") {
    d = "right";
  } else if ((e.key == "ArrowLeft" || e.key == "a") && d != "right") {
    d = "left";
  } else {
    console.log("error!");
  }

  //每次按上下左右鍵之後,在下一禎被畫出來之前,不接受任何keydown事件
  //可以防止蛇在邏輯上自殺
  document.removeEventListener("keydown", changeDirection);
}

let highestScore;
loadHighestScore();
let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數: " + score;
document.getElementById("myHighestScore").innerHTML =
  "最高分數: " + highestScore;

function draw() {
  //每次畫圖前,確認蛇的頭跟身體有沒有重疊
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      clearInterval(myGame);
      alert("Game over!");
      return;
    }
  }

  //背景全部設定為黑色
  ctx.fillStyle = "#232323";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //畫水果
  myFruit.drawFruit();
  myFruit2.drawFruit();
  myFruit3.drawFruit();

  //畫蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "green";
    } else {
      ctx.fillStyle = "lightgreen";
    }
    //設定snake身體外框
    ctx.strokeStyle = "white";

    //設定蛇超出canvas邊界會穿牆到另一邊
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    } else if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    } else if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    } else if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }

    //參數分別為x,y,width,height 功能為填滿一個方形
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  //以目前的d方向來決定，蛇的下一禎要放在哪個座標
  let snakeX = snake[0].x; //snake是一個物件,但snake.x是一個number
  let snakeY = snake[0].y;

  if (d == "right") {
    snakeX += unit;
  } else if (d == "up") {
    snakeY -= unit;
  } else if (d == "down") {
    snakeY += unit;
  } else if (d == "left") {
    snakeX -= unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //確認蛇是否有吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    myFruit.pickALocation(); //重新選定一個新的隨機位置，畫出新果實

    //更新分數
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數: " + score;
    document.getElementById("myHighestScore").innerHTML =
      "最高分數: " + highestScore;
  } else if (snake[0].x == myFruit2.x && snake[0].y == myFruit2.y) {
    myFruit2.pickALocation();
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數: " + score;
    document.getElementById("myHighestScore").innerHTML =
      "最高分數: " + highestScore;
  } else if (snake[0].x == myFruit3.x && snake[0].y == myFruit3.y) {
    myFruit3.pickALocation();
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數: " + score;
    document.getElementById("myHighestScore").innerHTML =
      "最高分數: " + highestScore;
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 50);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
