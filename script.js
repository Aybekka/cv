const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startGameButton");

const gridSize = 20;
let snake = [{ x: 100, y: 100 }];
let food = spawnFood();
let direction = { x: gridSize, y: 0 };
let isGameRunning = false;

startButton.addEventListener("click", startGame);
document.addEventListener("keydown", changeDirection);
document.addEventListener("keydown", preventArrowScroll);

function startGame() {
  isGameRunning = true;
  startButton.style.display = "none";
  canvas.style.display = "block";
  gameLoop();
}

function gameLoop() {
  if (!isGameRunning) return;

  setTimeout(() => {
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    checkCollision();
    gameLoop();
  }, 100);
}

function clearCanvas() {
  ctx.fillStyle = "#f4e4c1";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "#3e2723";
  snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize, gridSize));
}

function moveSnake() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    food = spawnFood();
  } else {
    snake.pop();
  }
}

function changeDirection(event) {
  const keyPressed = event.keyCode;
  const goingUp = direction.y === -gridSize;
  const goingDown = direction.y === gridSize;
  const goingRight = direction.x === gridSize;
  const goingLeft = direction.x === -gridSize;

  if (keyPressed === 37 && !goingRight) direction = { x: -gridSize, y: 0 };
  else if (keyPressed === 38 && !goingDown) direction = { x: 0, y: -gridSize };
  else if (keyPressed === 39 && !goingLeft) direction = { x: gridSize, y: 0 };
  else if (keyPressed === 40 && !goingUp) direction = { x: 0, y: gridSize };
}

function preventArrowScroll(event) {
  const arrowKeys = [37, 38, 39, 40];
  if (arrowKeys.includes(event.keyCode)) {
    event.preventDefault();
  }
}

function drawFood() {
  ctx.fillStyle = "#8d6e63";
  ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function spawnFood() {
  const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
  const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
  return { x, y };
}

function checkCollision() {
  const head = snake[0];
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    snake.slice(1).some(part => part.x === head.x && part.y === head.y)
  ) {
    isGameRunning = false;
    alert("Oyun bitti! Yeniden başlatmak için 'Oyun Başlat' butonuna tıklayın.");
    resetGame();
  }
}

function resetGame() {
  snake = [{ x: 100, y: 100 }];
  direction = { x: gridSize, y: 0 };
  startButton.style.display = "block";
  canvas.style.display = "none";
}
