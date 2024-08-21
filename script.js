const board = document.getElementById('board');
const scoreElement = document.getElementById('score');
const newGameButton = document.getElementById('new-game');

let score = 0;
let tiles = [];

function createBoard() {
    board.innerHTML = '';
    tiles = [];
    for (let i = 0; i < 16; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.innerText = '';
        board.appendChild(tile);
        tiles.push(tile);
    }
    addNewTile();
    addNewTile();
    updateBoard();
}

function addNewTile() {
    const emptyTiles = tiles.filter(tile => tile.innerText === '');
    if (emptyTiles.length === 0) return;
    const randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    randomTile.innerText = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
    tiles.forEach(tile => {
        const value = parseInt(tile.innerText);
        tile.style.backgroundColor = value ? getTileColor(value) : '#cdc1b4';
        tile.style.color = value > 4 ? '#f9f6f2' : '#776e65';
    });
    scoreElement.innerText = score;
}

function getTileColor(value) {
    switch (value) {
        case 2: return '#eee4da';
        case 4: return '#ede0c8';
        case 8: return '#f2b179';
        case 16: return '#f59563';
        case 32: return '#f67c5f';
        case 64: return '#f65e3b';
        case 128: return '#edcf72';
        case 256: return '#edcc61';
        case 512: return '#edc850';
        case 1024: return '#edc53f';
        case 2048: return '#edc22e';
        default: return '#3c3a32';
    }
}

function moveTiles(direction) {
    let moved = false;
    let merged = false;

    if (direction === 'left' || direction === 'right') {
        for (let row = 0; row < 4; row++) {
            let line = [];
            for (let col = 0; col < 4; col++) {
                let index = row * 4 + (direction === 'left' ? col : 3 - col);
                line.push(parseInt(tiles[index].innerText) || 0);
            }
            let newLine = mergeLine(line);
            for (let col = 0; col < 4; col++) {
                let index = row * 4 + (direction === 'left' ? col : 3 - col);
                if (tiles[index].innerText != newLine[col]) moved = true;
                tiles[index].innerText = newLine[col] === 0 ? '' : newLine[col];
            }
        }
    } else if (direction === 'up' || direction === 'down') {
        for (let col = 0; col < 4; col++) {
            let line = [];
            for (let row = 0; row < 4; row++) {
                let index = (direction === 'up' ? row : 3 - row) * 4 + col;
                line.push(parseInt(tiles[index].innerText) || 0);
            }
            let newLine = mergeLine(line);
            for (let row = 0; row < 4; row++) {
                let index = (direction === 'up' ? row : 3 - row) * 4 + col;
                if (tiles[index].innerText != newLine[row]) moved = true;
                tiles[index].innerText = newLine[row] === 0 ? '' : newLine[row];
            }
        }
    }

    if (moved) {
        addNewTile();
        updateBoard();
    }
}

function mergeLine(line) {
    let mergedLine = line.filter(value => value);
    for (let i = 0; i < mergedLine.length - 1; i++) {
        if (mergedLine[i] === mergedLine[i + 1]) {
            mergedLine[i] *= 2;
            score += mergedLine[i];
            mergedLine[i + 1] = 0;
        }
    }
    mergedLine = mergedLine.filter(value => value);
    while (mergedLine.length < 4) mergedLine.push(0);
    return mergedLine;
}

document.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        moveTiles(event.key.replace('Arrow', '').toLowerCase());
    }
});

newGameButton.addEventListener('click', () => {
    score = 0;
    createBoard();
});

createBoard();
