// Constants
const GRID_SIZE = 4;
let grid = [];

// Initialize the grid with zeros
function initializeGrid() {
    grid = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => 0));
    addNewTile();
    addNewTile();
    updateGridUI();
}

// Add a new tile (2 or 4) to a random empty cell
function addNewTile() {
    const emptyCells = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }
    if (emptyCells.length > 0) {
        const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[row][col] = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4
    }
}

// Update the UI based on the current grid state
function updateGridUI() {
    const gridContainer = document.getElementById('grid-container');
    gridContainer.innerHTML = '';
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const tileValue = grid[i][j];
            const tileDiv = document.createElement('div');
            tileDiv.classList.add('tile');
            if (tileValue !== 0) {
                tileDiv.textContent = tileValue;
            }
            gridContainer.appendChild(tileDiv);
        }
    }
}

// Merge adjacent tiles of the same value
function mergeTiles(row) {
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
        }
    }
    row = row.filter(cell => cell !== 0); // Remove zeros
    return row;
}

// Move tiles left
function moveLeft() {
    for (let i = 0; i < GRID_SIZE; i++) {
        let row = grid[i].filter(cell => cell !== 0); // Remove zeros
        row = mergeTiles(row); // Merge tiles
        while (row.length < GRID_SIZE) {
            row.push(0); // Pad with zeros to maintain grid size
        }
        grid[i] = row;
    }
    addNewTile();
    updateGridUI();
}

// Move tiles right
function moveRight() {
    for (let i = 0; i < GRID_SIZE; i++) {
        let row = grid[i].filter(cell => cell !== 0).reverse(); // Remove zeros and reverse
        row = mergeTiles(row); // Merge tiles
        while (row.length < GRID_SIZE) {
            row.push(0); // Pad with zeros to maintain grid size
        }
        row.reverse(); // Reverse back to original order
        grid[i] = row;
    }
    addNewTile();
    updateGridUI();
}

// Move tiles up
function moveUp() {
    for (let j = 0; j < GRID_SIZE; j++) {
        let col = [];
        for (let i = 0; i < GRID_SIZE; i++) {
            if (grid[i][j] !== 0) {
                col.push(grid[i][j]);
            }
        }
        col = mergeTiles(col); // Merge tiles
        for (let i = 0; i < GRID_SIZE; i++) {
            grid[i][j] = col[i] !== undefined ? col[i] : 0;
        }
    }
    addNewTile();
    updateGridUI();
}

// Move tiles down
function moveDown() {
    for (let j = 0; j < GRID_SIZE; j++) {
        let col = [];
        for (let i = GRID_SIZE - 1; i >= 0; i--) {
            if (grid[i][j] !== 0) {
                col.push(grid[i][j]);
            }
        }
        col = mergeTiles(col); // Merge tiles
        for (let i = GRID_SIZE - 1, k = 0; i >= 0; i--, k++) {
            grid[i][j] = col[k] !== undefined ? col[k] : 0;
        }
    }
    addNewTile();
    updateGridUI();
}

// Check for game over (no more moves possible)
function isGameOver() {
    // Game over if no empty cells and no adjacent cells with same value
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            if (grid[i][j] === 0) {
                return false;
            }
            if (i !== GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) {
                return false;
            }
            if (j !== GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) {
                return false;
            }
        }
    }
    return true;
}

// Start a new game
function startGame() {
    initializeGrid();
    document.getElementById('message').textContent = '';
}

// Handle keyboard input for arrow keys
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        moveLeft();
    } else if (event.key === 'ArrowRight') {
        moveRight();
    } else if (event.key === 'ArrowUp') {
        moveUp();
    } else if (event.key === 'ArrowDown') {
        moveDown();
    }

    if (isGameOver()) {
        document.getElementById('message').textContent = 'Game Over!';
    }
});
