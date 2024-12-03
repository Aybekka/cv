const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startGameButton");
const snakeGameSection = document.getElementById("snake-game-section");

const gridSize = 20;
let snake = [{ x: 100, y: 100 }];
let food = spawnFood();
let direction = { x: gridSize, y: 0 };
let isGameRunning = false;

startButton.addEventListener("click", startGame);
document.addEventListener("keydown", changeDirection);
document.addEventListener("keydown", preventArrowScroll);

let score = 0;

function updateScore() {
  document.getElementById("scoreDisplay").innerText = `Skor: ${score}`;
}
function startGame() {
  isGameRunning = true;
  score = 0;
  updateScore();
  startButton.style.display = "none";
  canvas.style.display = "block";
  snakeGameSection.scrollIntoView({ behavior: "smooth" });
  
  // Başlangıç animasyonu
  let scale = 0.1;
  let interval = setInterval(() => {
    if (scale >= 1) {
      clearInterval(interval);
      gameLoop();
    }
    ctx.save();
    ctx.scale(scale, scale);
    clearCanvas();
    drawSnake();
    ctx.restore();
    scale += 0.1;
  }, 50);
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
  let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#f4e4c1");
  gradient.addColorStop(1, "#e3b081");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = "#3e2723";
  ctx.shadowColor = "#8d6e63";
  ctx.shadowBlur = 10;
  snake.forEach(part => {
    ctx.beginPath();
    ctx.roundRect(part.x, part.y, gridSize, gridSize, 5); // Yuvarlak köşe
    ctx.fill();
  });
  ctx.shadowBlur = 0; // Gölgeyi sadece yılan için etkinleştir
}



function moveSnake() {
  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Duvarlardan geçiş
  if (head.x < 0) head.x = canvas.width - gridSize;
  else if (head.x >= canvas.width) head.x = 0;
  if (head.y < 0) head.y = canvas.height - gridSize;
  else if (head.y >= canvas.height) head.y = 0;

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = spawnFood();
    score++; // Skoru artır
    updateScore();
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
  ctx.shadowColor = "#3e2723";
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
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
  score = 0;
  updateScore();
  startButton.style.display = "block";
  canvas.style.display = "none";
}
