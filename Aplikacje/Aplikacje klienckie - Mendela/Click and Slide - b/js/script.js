const images = ['assets/images/puzzle1.jpg', 'assets/images/puzzle2.jpg', 'assets/images/puzzle3.jpg'];
let currentImageIndex = 0;
let timerInterval;
let startTime;
let elapsedTime = 0;
let tiles = [];
let emptyTile = { row: 0, col: 1 };
let size = 3;

function startGame(newSize) {
    size = newSize;
    elapsedTime = 0;
    clearInterval(timerInterval);
    document.getElementById('game-board').innerHTML = '';
    document.getElementById('game-board').style.setProperty('--size', size);
    document.getElementById('game-board').style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    document.getElementById('game-board').style.gridTemplateRows = `repeat(${size}, 1fr)`;
    tiles = [];
    emptyTile = { row: size - 3, col: size - 2 };
    createTiles();
    shuffleTiles();
    startTimer();
}

function createTiles() {
    let index = 0;
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (row === emptyTile.row && col === emptyTile.col) continue;

            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.style.backgroundImage = `url(${images[currentImageIndex]})`;
            tile.style.backgroundSize = `${size * 100}% ${size * 100}%`;
            tile.style.backgroundPosition = `${-col * 100 / (size - 1)}% ${-row * 100 / (size - 1)}%`;
            tile.style.left = `${col * 100 / size}%`;
            tile.style.top = `${row * 100 / size}%`;
            tile.dataset.row = row;
            tile.dataset.col = col;
            tile.dataset.correctIndex = index++;
            tile.addEventListener('click', () => moveTile(row, col));

            document.getElementById('game-board').appendChild(tile);
            tiles.push({ element: tile, row, col });
        }
    }
}

function shuffleTiles() {
    for (let i = 0; i < size * 10; i++) {
        const neighbors = tiles.filter(tile => isMovable(tile.row, tile.col));
        const randomTile = neighbors[Math.floor(Math.random() * neighbors.length)];
        moveTile(randomTile.row, randomTile.col, false);
    }
}

function isMovable(row, col) {
    return (Math.abs(row - emptyTile.row) === 1 && col === emptyTile.col) ||
        (Math.abs(col - emptyTile.col) === 1 && row === emptyTile.row);
}

function moveTile(row, col, animate = true) {
    if (!isMovable(row, col)) return;

    const tile = tiles.find(t => t.row === row && t.col === col);
    if (!tile) return;

    const tempRow = emptyTile.row;
    const tempCol = emptyTile.col;

    emptyTile.row = row;
    emptyTile.col = col;

    tile.row = tempRow;
    tile.col = tempCol;

    tile.element.style.left = `${tempCol * 100 / size}%`;
    tile.element.style.top = `${tempRow * 100 / size}%`;
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        // Update timer display logic here
    }, 1000);
}

// Event listeners for buttons
document.getElementById('btn3x3').addEventListener('click', () => startGame(3));
document.getElementById('btn4x4').addEventListener('click', () => startGame(4));
document.getElementById('btn5x5').addEventListener('click', () => startGame(5));
document.getElementById('btn6x6').addEventListener('click', () => startGame(6));

// Start the initial game
startGame(size);