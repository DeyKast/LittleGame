const playground = document.querySelector("#playground");
const gameGrid = document.querySelector(".gameGrid");

const startForm = document.querySelector(".startForm");
const rangeInput = document.querySelector("#rangeInput");
const rangeOutput = document.querySelector(".rangeOutputText");
const startButton = document.querySelector(".startButton");

const score = document.querySelector("#score");
const touches = document.querySelector("#touches");

const bestScore = document.querySelector("#bestScore");
const bestTouches = document.querySelector("#bestTouches");

const resetButton = document.querySelector(".resetButton");

let playerStats = {
  score: 0,
  touches: 0,

  bestScore: 0,
  bestTouches: 0,
};

let startGame = null;

rangeOutput.textContent = rangeInput.value;

score.textContent = `SCORE : ${playerStats.score}`;
touches.textContent = `TOUCHES : ${playerStats.touches}`;

bestScore.textContent = `BEST SCORE : ${playerStats.bestScore}`;
bestTouches.textContent = `TOUCHES : ${playerStats.bestTouches}`;

rangeInput.addEventListener("input", (event) => {
  rangeOutput.textContent = event.target.value;
});

startButton.addEventListener("click", (event) => {
  event.preventDefault();
  startGame = new Game(
    parseInt(rangeInput.value) + 1,
    parseInt(rangeInput.value)
  );

  startGame.logGrid();
});

resetButton.addEventListener("click", (event) => {
  startForm.classList.remove("visually-hidden");
  gameGrid.style.cssText = `width: 0px`;
  gameGrid.innerHTML = "";
});

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

  fillGrid() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        const randomValue = Math.random();
        this.grid[i][j] =
          randomValue < 0.25
            ? "♣"
            : randomValue < 0.5
            ? "♠"
            : randomValue < 0.75
            ? "♥"
            : "♦";
      }
    }
    this.renderGrid();
  }

  renderGrid() {
    let markGrid = "";
    this.grid.forEach((row, rowIndex) => {
      console.log(row);
      row.forEach((value, colIndex) => {
        const markGridItem = `<div class="gameGridItem" row=${rowIndex} col=${
          colIndex + 1
        }>${value}</div>`;

        markGrid += markGridItem;
      });
    });
    gameGrid.style.cssText = `width: ${42 * (this.grid.length - 1)}px`;
    startForm.classList.add("visually-hidden");
    gameGrid.insertAdjacentHTML("beforeend", markGrid);
  }

  logGrid() {
    console.log(this.grid);
  }
}
