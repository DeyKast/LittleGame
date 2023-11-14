const playground = document.querySelector("#playground");
const gameGrid = document.querySelector(".gameGrid");

const startForm = document.querySelector(".startForm");
const rangeInput = document.querySelector("#rangeInput");
const rangeOutput = document.querySelector(".rangeOutputText");
const startButton = document.querySelector(".startButton");

const score = document.querySelector("#score");

const bestScore = document.querySelector("#bestScore");

const resetButton = document.querySelector(".resetButton");

let playerStats = {
  score: 0,
  touches: 0,
  bestScore: localStorage.getItem("bestScore") || 0,
  bestTouches: localStorage.getItem("bestTouches") || 0,
};

let startGame = null;

rangeOutput.textContent = rangeInput.value;
bestScore.textContent = `BEST SCORE / TOUCHES : ${playerStats.bestScore} / ${playerStats.bestTouches}`;

rangeInput.addEventListener("input", updateRangeOutput);

startButton.addEventListener("click", handleStartButtonClick);

resetButton.addEventListener("click", handleResetButtonClick);

gameGrid.addEventListener("click", handleGameGridClick);

function updateRangeOutput(event) {
  rangeOutput.textContent = event.target.value;
}

function handleStartButtonClick(event) {
  event.preventDefault();

  playerStats.score = 0;
  playerStats.touches = 0;

  score.textContent = `SCORE/TOUCHES : ${playerStats.score} / ${playerStats.touches}`;

  startGame = new Game(
    parseInt(rangeInput.value) + 1,
    parseInt(rangeInput.value)
  );
}

function handleResetButtonClick() {
  startForm.classList.remove("visually-hidden");
  gameGrid.style.width = "0px";
  gameGrid.innerHTML = "";
}

function handleGameGridClick(event) {
  playerStats.touches++;

  startGame.removeGridItem(
    event.target.getAttribute("row"),
    event.target.getAttribute("col")
  );
}

class Game {
  constructor(rows, columns) {
    this.columns = columns;
    this.rows = rows;
    this.grid = this.createEmptyGrid();
    this.fillGrid();
  }

  createEmptyGrid() {
    const grid = [];
    for (let i = 0; i < this.rows; i++) {
      grid.push(new Array(this.columns).fill(null));
    }
    return grid;
  }

  getRandomSymbol() {
    const randomValue = Math.random();
    return randomValue < 0.25
      ? "♣"
      : randomValue < 0.5
      ? "♠"
      : randomValue < 0.75
      ? "♥"
      : "♦";
  }

  fillGrid() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.grid[i][j] = this.getRandomSymbol();
      }
    }
    this.renderGrid();
  }

  renderGrid() {
    let markGrid = "";
    this.grid.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const markGridItem = `<div class="gameGridItem" row=${rowIndex} col=${colIndex}>${value}</div>`;

        markGrid += markGridItem;
      });
    });
    gameGrid.style.cssText = `width: ${42 * (this.grid.length - 1)}px`;
    startForm.classList.add("visually-hidden");
    gameGrid.innerHTML = markGrid;
  }

  removeGridItem(row, col) {
    const itemType = this.grid[row][col];

    this.grid[row][col] = null;

    this.removeConnectedGridItems(Number(row), Number(col), itemType);

    this.updateGrid();
  }

  removeConnectedGridItems(row, col, type) {
    const directions = [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ];

    for (let i = 0; i < directions.length; i++) {
      const [r, c] = directions[i];

      if (r >= 0 && r < this.grid.length && c >= 0 && c < this.grid[0].length) {
        if (this.grid[r][c] === type) {
          this.removeGridItem(r, c);
        }
      }
    }
  }

  updateGrid() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] === null) {
          this.grid[i][j] = this.getRandomSymbol();
          playerStats.score++;
          score.textContent = `SCORE/TOUCHES : ${playerStats.score} / ${playerStats.touches}`;
          console.log(playerStats.score);
        }
      }
    }
    if (playerStats.score >= playerStats.bestScore) {
      playerStats.bestScore = playerStats.score;
      playerStats.bestTouches = playerStats.touches;
      localStorage.setItem("bestScore", playerStats.bestScore);
      localStorage.setItem("bestTouches", playerStats.bestTouches);

      bestScore.textContent = `BEST SCORE / TOUCHES : ${playerStats.bestScore} / ${playerStats.bestTouches}`;
    }
    this.renderGrid();
  }
}
