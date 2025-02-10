const images = ['assets/images/puzzle1.jpg', 'assets/images/puzzle2.jpg', 'assets/images/puzzle3.jpg'];
let currentImageIndex = 0;
let timerInterval;
let startTime;
let elapsedTime = 0;
let currentGame;

class ClickSlideGame {
    constructor(containerId, imageSrc, size = 3) {
        this.container = document.getElementById(containerId);
        this.imageSrc = imageSrc;
        this.size = size;
        this.tiles = [];
        this.emptyTile = { row: size - 3, col: size - 2 };
        this.init();
    }

    async init() {
        this.container.innerHTML = '';
        this.container.style.setProperty('--size', this.size);
        this.container.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
        this.container.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
        this.createTiles();
        await this.shuffleTiles();
        this.startTimer();
    }

    createTiles() {
        let index = 0;
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (row === this.emptyTile.row && col === this.emptyTile.col) continue;

                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.style.backgroundImage = `url(${this.imageSrc})`;
                tile.style.backgroundSize = `${this.size * 100}% ${this.size * 100}%`;
                tile.style.backgroundPosition = `${-col * 100 / (this.size - 1)}% ${-row * 100 / (this.size - 1)}%`;
                tile.style.left = `${col * 100 / this.size}%`;
                tile.style.top = `${row * 100 / this.size}%`;
                tile.dataset.row = row;
                tile.dataset.col = col;
                tile.dataset.correctIndex = index++;

                tile.addEventListener('click', () => {
                    this.moveTile(parseInt(tile.dataset.row), parseInt(tile.dataset.col));
                });

                this.container.appendChild(tile);
                this.tiles.push({ element: tile, row: row, col: col });
            }
        }
    }

    async shuffleTiles() {
        for (let i = 0; i < this.size * 10; i++) {
            const neighbors = this.getMovableTiles();
            const randomTile = neighbors[Math.floor(Math.random() * neighbors.length)];
            this.moveTile(randomTile.row, randomTile.col, false);
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    getMovableTiles() {
        return this.tiles.filter(tile => {
            return (Math.abs(tile.row - this.emptyTile.row) === 1 && tile.col === this.emptyTile.col) ||
                (Math.abs(tile.col - this.emptyTile.col) === 1 && tile.row === this.emptyTile.row);
        });
    }

    moveTile(row, col, checkWin = true) {
        if (!this.isMovable(row, col)) return;

        const tile = this.tiles.find(t => t.row === row && t.col === col);
        if (!tile) return;

        const tempRow = tile.row;
        const tempCol = tile.col;
        tile.row = this.emptyTile.row;
        tile.col = this.emptyTile.col;
        this.emptyTile.row = tempRow;
        this.emptyTile.col = tempCol;

        tile.element.style.left = `${tile.col * 100 / this.size}%`;
        tile.element.style.top = `${tile.row * 100 / this.size}%`;
        tile.element.dataset.row = tile.row;
        tile.element.dataset.col = tile.col;

        if (checkWin) this.checkWin();
    }

    isMovable(row, col) {
        return (Math.abs(row - this.emptyTile.row) === 1 && col === this.emptyTile.col) ||
            (Math.abs(col - this.emptyTile.col) === 1 && row === this.emptyTile.row);
    }

    checkWin() {
        let isCorrect = this.tiles.every(tile => {
            return tile.row * this.size + tile.col == tile.element.dataset.correctIndex;
        });

        if (isCorrect) {
            this.stopTimer();
            setTimeout(() => {
                document.getElementById('win-time').textContent = formatTime(elapsedTime);
                document.getElementById('win-overlay').style.display = 'flex';
            }, 300);
        }
    }

    startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(() => {
            elapsedTime = Date.now() - startTime;
            updateTimer();
        }, 10);
    }

    stopTimer() {
        clearInterval(timerInterval);
    }
}

function formatTime(time) {
    const milliseconds = parseInt((time % 1000) / 10);
    const seconds = parseInt((time / 1000) % 60);
    const minutes = parseInt((time / (1000 * 60)) % 60);
    const hours = parseInt((time / (1000 * 60 * 60)) % 24);

    return hours.toString().padStart(2, '0') + ':' +
        minutes.toString().padStart(2, '0') + ':' +
        seconds.toString().padStart(2, '0') + '.' +
        milliseconds.toString().padStart(2, '0');
}

function updateTimer() {
    const formattedTime = formatTime(elapsedTime);
    const timerElement = document.getElementById('timer');
    timerElement.innerHTML = '';

    for (const char of formattedTime) {
        const img = document.createElement('img');
        if (char === ':') {
            img.src = 'assets/cyferki/colon.gif';
        } else if (char === '.') {
            img.src = 'assets/cyferki/dot.gif';
        } else {
            img.src = `assets/cyferki/c${char}.gif`;
        }
        timerElement.appendChild(img);
    }
}

function startGame(size) {
    if (currentGame) currentGame.stopTimer();
    currentGame = new ClickSlideGame('game-board', images[currentImageIndex], size);
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    document.getElementById('preview').src = images[currentImageIndex];
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    document.getElementById('preview').src = images[currentImageIndex];
}

function closeOverlay() {
    document.getElementById('win-overlay').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    // No need to start the game initially
});