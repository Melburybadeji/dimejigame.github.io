const basket = document.getElementById("basket");
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("start-btn");

let score = 0;
let timeLeft = 30;
let gameInterval;
let fruitInterval;
let gameActive = false;
let basketX = 50;

// Start the game
startBtn.addEventListener("click", () => {
  if (gameActive) return;

  gameActive = true;
  score = 0;
  timeLeft = 30;

  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;

  resetGame();
  startGameLoop();
});

// Handle basket movement
document.addEventListener("keydown", (e) => {
  if (!gameActive) return;

  if (e.key === "ArrowLeft" && basketX > 5) {
    basketX -= 5;
  } else if (e.key === "ArrowRight" && basketX < 95) {
    basketX += 5;
  }
  basket.style.left = `${basketX}%`;
});

// Start the game loop
function startGameLoop() {
  gameInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft === 0) {
      endGame();
    }
  }, 1000);

  fruitInterval = setInterval(spawnFruit, 1000);
}

// Spawn a fruit
function spawnFruit() {
  const fruit = document.createElement("div");
  fruit.classList.add("fruit");
  const randomX = Math.random() * (gameArea.clientWidth - 40);
  fruit.style.left = `${randomX}px`;
  gameArea.appendChild(fruit);

  let fruitY = 0;
  const fruitSpeed = 4;

  const fruitMove = setInterval(() => {
    fruitY += fruitSpeed;
    fruit.style.top = `${fruitY}px`;

    // Check for collision with basket
    if (isCaught(fruit)) {
      clearInterval(fruitMove);
      fruit.remove();
      score++;
      scoreDisplay.textContent = score;
    }

    // Remove fruit if it goes out of bounds
    if (fruitY > gameArea.clientHeight) {
      clearInterval(fruitMove);
      fruit.remove();
    }
  }, 20);
}

// Check if fruit is caught
function isCaught(fruit) {
  const basketRect = basket.getBoundingClientRect();
  const fruitRect = fruit.getBoundingClientRect();

  return (
    fruitRect.bottom >= basketRect.top &&
    fruitRect.top <= basketRect.bottom &&
    fruitRect.right >= basketRect.left &&
    fruitRect.left <= basketRect.right
  );
}

// Reset the game
function resetGame() {
  const fruits = document.querySelectorAll(".fruit");
  fruits.forEach((fruit) => fruit.remove());
  basketX = 50;
  basket.style.left = `${basketX}%`;
}

// End the game
function endGame() {
  clearInterval(gameInterval);
  clearInterval(fruitInterval);
  gameActive = false;
  alert(`Game Over! Your final score: ${score}`);
}
