const c = document.getElementById("myCanvas");
const canvasHeight = c.height;
const canvasWidth = c.width;
const ctx = c.getContext("2d");
let circle_x = 250;
let circle_y = 250;
let radius = 20;
let xSpeed = 10; //對角線向下
let ySpeed = 10; //對角線向下
let ground_x = 100;
let ground_y = 500;
let ground_height = 5;
let brickArray = [];
let count = 0;

//min, max
function getRandomArbitrary(min, max) {
  return min + Math.floor(Math.random() * (max - min));
}

class Brick {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    brickArray.push(this);
    this.visible = true;
  }

  drawBrick() {
    ctx.fillStyle = "white";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  touchingBall(ballX, ballY) {
    return (
      ballX >= this.x - radius &&
      ballX <= this.x + this.width + radius &&
      ballY <= this.y + this.height + radius &&
      ballY >= this.y - radius
    );
  }
}

//製作所有的Brick
for (let i = 0; i < 10; i++) {
  new Brick(getRandomArbitrary(0, 950), getRandomArbitrary(0, 450));
}

window.addEventListener("keydown", moveDirection);
function moveDirection(e) {
  console.log("x = " + ground_x);
  if (e.key == "ArrowRight" && ground_x <= 800) {
    ground_x += 100;
  } else if (e.key == "ArrowLeft" && ground_x >= 100) {
    ground_x -= 100;
  }
}

function drawCircle() {
  //確認球是否有碰到磚塊
  brickArray.forEach((brick) => {
    if (brick.visible && brick.touchingBall(circle_x, circle_y)) {
      count++;
      brick.visible = false;
      //改變x, y方向速度，並且將brick從brickArray中移除
      //從下方撞擊
      if (circle_y >= brick.y + brick.height) {
        ySpeed *= -1;
      }
      // 從上方撞擊
      else if (circle_y <= brick.y) {
        ySpeed *= -1;
      }
      //從左方撞擊
      else if (circle_x <= brick.x) {
        xSpeed *= -1;
      }
      //從右方撞擊
      else if (circle_x >= brick.x + brick.width) {
        xSpeed *= -1;
      }

      if (count == 10) {
        alert("全破關囉!!!");
        clearInterval(game);
      }
    }
  });

  //確認球是否碰到地板
  if (
    circle_x >= ground_x - radius &&
    circle_x <= ground_x + 150 + radius &&
    circle_y >= ground_y - radius &&
    circle_y <= ground_y + radius
  ) {
    //施加彈力，解決在地板中間震動的現象
    if (ySpeed > 0) {
      circle_y -= 40;
    } else {
      circle_y += 40;
    }
    ySpeed *= -1;
  }

  //確認球有沒有碰到邊界
  //確認右邊邊界
  if (circle_x >= canvasWidth - radius) {
    xSpeed *= -1;
    console.log(circle_x, circle_y);
  }
  //確認下邊邊界
  if (circle_y >= canvasHeight - radius) {
    ySpeed *= -1;
    console.log(circle_x, circle_y);
  }
  //確認上邊邊界
  if (circle_y <= radius) {
    ySpeed *= -1;
    console.log(circle_x, circle_y);
  }
  //確認左邊邊界
  if (circle_x <= radius) {
    xSpeed *= -1;
    console.log(circle_x, circle_y);
  }
  //更動圓的座標
  circle_x += xSpeed;
  circle_y += ySpeed;
  ctx.fillStyle = "skyblue";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  brickArray.forEach((brick) => {
    if (brick.visible) {
      brick.drawBrick();
    }
  });

  //move floor
  ctx.fillStyle = "khaki";
  ctx.fillRect(ground_x, ground_y, 150, ground_height);
  ctx.beginPath();
  ctx.arc(circle_x, circle_y, radius, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle = "lightpink";
  ctx.fill();
}

let game = setInterval(drawCircle, 25);
