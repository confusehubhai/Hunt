const gameArea = document.getElementById('game-area');
const star = document.getElementById('star');
const catcher = document.getElementById('catcher');  // Changed from basket
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');
const livesElement = document.getElementById('lives');

const fallingObjects = [
    '🍕', // pizza
    '🌮', // taco
    '🍔', // burger
    '🍦', // ice cream
    '🍪', // cookie
    '🥐', // croissant
    '🍩', // donut
    '🧀', // cheese
    '🥨', // pretzel
    '🍫'  // chocolate
];

let score = 0;
let isGameRunning = false;
let animationFrameId;
let starY = 0;
let catcherX = 200;  // Changed from basketX
let fallSpeed = 2;
let lives = 3;

function initGame() {
    score = 0;
    lives = 3;
    starY = 0;
    fallSpeed = 2;
    scoreElement.textContent = `Score: ${score}`;
    updateLivesDisplay();
    star.style.top = starY + 'px';
    resetStarPosition();
    gameOverElement.classList.add('hidden');
    startButton.classList.add('hidden');
    resizeGame();
}

function updateLivesDisplay() {
    livesElement.textContent = `Lives: ${'❤️'.repeat(lives)}`;
}

function resetStarPosition() {
    starY = 0;
    star.style.top = starY + 'px';
    star.style.left = Math.random() * (gameArea.offsetWidth - 20) + 'px';
    star.textContent = fallingObjects[Math.floor(Math.random() * fallingObjects.length)];
}

function updateGame() {
    if (!isGameRunning) return;

    starY += fallSpeed;
    star.style.top = starY + 'px';

    const starRect = star.getBoundingClientRect();
    const catcherRect = catcher.getBoundingClientRect();  // Changed from basketRect

    if (starY + star.offsetHeight >= gameArea.offsetHeight) {
        lives--;
        updateLivesDisplay();
        
        if (lives <= 0) {
            gameOver();
            return;
        }
        
        resetStarPosition();
    }

    if (isColliding(starRect, catcherRect)) {  // Changed from basketRect
        score++;
        scoreElement.textContent = `Score: ${score}`;
        fallSpeed += 0.2;
        resetStarPosition();
    }

    animationFrameId = requestAnimationFrame(updateGame);
}

function isColliding(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}

function gameOver() {
    isGameRunning = false;
    finalScoreElement.textContent = score;
    gameOverElement.classList.remove('hidden');
    cancelAnimationFrame(animationFrameId);
    document.getElementById('gameover-sound').play().catch(() => {});
}

function handleKeyPress(e) {
    if (!isGameRunning) return;

    const MOVE_DISTANCE = 20;
    const CATCHER_WIDTH = catcher.offsetWidth;  // Changed from BASKET_WIDTH

    if (e.key === 'ArrowLeft' && catcherX > 0) {  // Changed from basketX
        catcherX = Math.max(0, catcherX - MOVE_DISTANCE);  // Changed from basketX
    } else if (e.key === 'ArrowRight' && catcherX < gameArea.offsetWidth) {  // Changed from basketX
        catcherX = Math.min(gameArea.offsetWidth, catcherX + MOVE_DISTANCE);  // Changed from basketX
    }

    catcher.style.left = catcherX + 'px';  // Changed from basketX
}

// Add touch controls
let touchStartX = 0;
const TOUCH_SENSITIVITY = 0.5;

function handleTouchStart(e) {
    if (!isGameRunning) return;
    touchStartX = e.touches[0].clientX;
}

function handleTouchMove(e) {
    if (!isGameRunning) return;
    e.preventDefault();
    
    const touchX = e.touches[0].clientX;
    const diffX = (touchX - touchStartX) * TOUCH_SENSITIVITY;
    
    catcherX = Math.max(0, Math.min(gameArea.offsetWidth, catcherX + diffX));  // Changed from basketX
    catcher.style.left = catcherX + 'px';  // Changed from basketX
    
    touchStartX = touchX;
}

// Add responsive sizing
function resizeGame() {
    const gameWidth = Math.min(400, window.innerWidth * 0.95);
    const gameHeight = Math.min(500, window.innerHeight * 0.7);
    
    gameArea.style.width = `${gameWidth}px`;
    gameArea.style.height = `${gameHeight}px`;
    
    // Adjust catcher position if needed
    catcherX = Math.min(catcherX, gameWidth - catcher.offsetWidth);  // Changed from basketX
    catcher.style.left = catcherX + 'px';  // Changed from basketX
}

// Add event listeners for touch and resize
gameArea.addEventListener('touchstart', handleTouchStart, { passive: false });
gameArea.addEventListener('touchmove', handleTouchMove, { passive: false });
window.addEventListener('resize', resizeGame);

// Initialize game size
resizeGame();

// Add smooth animation for catcher movement
function updateCatcherPosition() {  // Changed from updateBasketPosition
    catcher.style.left = catcherX + 'px';  // Changed from basketX
    if (isGameRunning) {
        requestAnimationFrame(updateCatcherPosition);  // Changed from updateBasketPosition
    }
}

// Modify start game listener
startButton.addEventListener('click', () => {
    isGameRunning = true;
    initGame();
    updateGame();
    updateCatcherPosition();  // Changed from updateBasketPosition
});

restartButton.addEventListener('click', () => {
    isGameRunning = true;
    initGame();
    updateGame();
    updateCatcherPosition();  // Changed from updateBasketPosition
});

document.addEventListener('keydown', handleKeyPress);

// Initial catcher position
catcher.style.left = catcherX + 'px';  // Changed from basketX
