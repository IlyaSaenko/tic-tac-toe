const playerNameInput = document.querySelector('#player-name');
const markerRadios = document.querySelectorAll('input[name="marker"]');
const startBtn = document.querySelector('#start-btn');
const restartBtn = document.querySelector('#restart-btn');

const initialScreen = document.querySelector('#initial-screen');
const gameScreen = document.querySelector('#game-screen');

const board = document.querySelector('#board');
const currentTurn = document.querySelector('#current-turn');

let playerName = '';
let playerMarker = '';
let computerMarker = '';
let boardState = Array(9).fill('');
let cells = [];
let isPlayerTurn = true;

//startGame
const startGame = () => {
  playerName = playerNameInput.value.trim() || 'Игрок';

  const selectedRadio = Array.from(markerRadios).find(radio => radio.checked);
  playerMarker = selectedRadio ? selectedRadio.value : 'X';
  computerMarker = playerMarker === 'X' ? 'O' : 'X';

  initialScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  createBoard();

  isPlayerTurn = true;
  currentTurn.textContent = `Ходит: ${playerName} (${playerMarker})`;
}

//createBoard
const createBoard = () => {
  board.innerHTML = '';
  boardState = Array(9).fill('');
  cells = [];

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', () => handleCellClick(i), { once: true });
    board.appendChild(cell);
    cells.push(cell);
  };
};

//handleCellClick
const handleCellClick = (index) => {
  if (!isPlayerTurn || boardState[index] !== '') return;

  boardState[index] = playerMarker;
  cells[index].textContent = playerMarker;

  const winCombo = checkWin(playerMarker);
  if (winCombo) {
    highlightWinningCells(winCombo);
    currentTurn.textContent = `${playerName} победил! 🎉`;
    disableBoard();
    return;
  }

  if (isBoardFull()) {
    currentTurn.textContent = 'Ничья 🤝';
    disableBoard();
    return;
  }

  isPlayerTurn = false;
  currentTurn.textContent = 'Ход компьютера...';
  setTimeout(computerMove, 500);
}

//computerMove
const computerMove = () => {
  const emptyIndices = boardState
    .map((v, i) => v === '' ? i : null)
    .filter(i => i !== null);
  if (emptyIndices.length === 0) return;

  let moveIndex = null;

  for (let i of emptyIndices) {
    boardState[i] = computerMarker;
    if (checkWin(computerMarker)) {
      moveIndex = i;
      boardState[i] = '';
      break;
    }
    boardState[i] = '';
  }

  if (moveIndex === null) {
    for (let i of emptyIndices) {
      boardState[i] = playerMarker;
      if (checkWin(playerMarker)) {
        moveIndex = i;
        boardState[i] = '';
        break;
      }
      boardState[i] = '';
    }
  }

  if (moveIndex === null) {
    moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  boardState[moveIndex] = computerMarker;
  cells[moveIndex].textContent = computerMarker;

  const winCombo = checkWin(computerMarker);
  if (winCombo) {
    highlightWinningCells(winCombo);
    currentTurn.textContent = `Компьютер (${computerMarker}) победил 🤖`;
    disableBoard();
    return;
  }

  if (isBoardFull()) {
    currentTurn.textContent = 'Ничья 🤝';
    disableBoard();
    return;
  }

  isPlayerTurn = true;
  currentTurn.textContent = `Ходит: ${playerName} (${playerMarker})`;
};

//checkWin
const checkWin = (marker) => {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const findWinningPattern = () => {
    const foundPattern = winPatterns
      .find(pattern => pattern.every(index => boardState[index] === marker));
    return foundPattern || null;
  }

  return findWinningPattern();
};

//highlightWinningCells
const highlightWinningCells = (combo) => {
  if (!combo) return;
  combo.forEach(i => cells[i].classList.add('win'));
};

//isBoardFull
const isBoardFull = () => boardState.every(cell => cell !== '');

//disableBoard
const disableBoard = () => {
  cells.forEach(cell => {
    const newCell = cell.cloneNode(true);
    cell.replaceWith(newCell);
  })
}

//restartGame
const restartGame = () => {
  gameScreen.classList.add('hidden');
  initialScreen.classList.remove('hidden');
  playerNameInput.value = '';
  currentTurn.textContent = '';
  markerRadios.forEach((r, i) => {
    r.checked = i === false;
  })
  board.innerHTML = '';
  boardState = Array(9).fill('');
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
