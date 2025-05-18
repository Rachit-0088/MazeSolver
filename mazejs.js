const rows = 10;
const cols = 10;
const grid = document.getElementById("grid");

let mode = "wall";
let gridData = [];
let start = null;
let end = null;

function createGrid() {
  grid.innerHTML = "";
  gridData = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener("click", () => onCellClick(cell));
      grid.appendChild(cell);
      row.push({ type: "empty", element: cell });
    }
    gridData.push(row);
  }
}

function setMode(newMode) {
  mode = newMode;
}

function onCellClick(cell) {
  const row = +cell.dataset.row;
  const col = +cell.dataset.col;
  const data = gridData[row][col];

  if (mode === "start") {
    if (start) start.element.classList.remove("start");
    data.type = "start";
    cell.classList.add("start");
    start = data;
  } else if (mode === "end") {
    if (end) end.element.classList.remove("end");
    data.type = "end";
    cell.classList.add("end");
    end = data;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function visualizeBFS() {
  if (!start || !end) return alert("Set both start and end points.");
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
  const queue = [[+start.element.dataset.row, +start.element.dataset.col]];
  visited[start.element.dataset.row][start.element.dataset.col] = true;

  while (queue.length) {
    const [r, c] = queue.shift();
    const cell = gridData[r][c];
    if (cell !== start && cell !== end) cell.element.classList.add("visited");
    if (cell === end) break;

    for (const [dr, dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
          !visited[nr][nc] && gridData[nr][nc].type !== "wall") {
        queue.push([nr, nc]);
        visited[nr][nc] = true;
        prev[nr][nc] = [r, c];
      }
    }
    await sleep(100);
  }
  drawPath(prev);
}

async function visualizeDFS() {
  if (!start || !end) return alert("Set both start and end points.");
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const prev = Array.from({ length: rows }, () => Array(cols).fill(null));
  const stack = [[+start.element.dataset.row, +start.element.dataset.col]];

  while (stack.length) {
    const [r, c] = stack.pop();
    if (visited[r][c]) continue;
    visited[r][c] = true;
    const cell = gridData[r][c];
    if (cell !== start && cell !== end) cell.element.classList.add("visited");
    if (cell === end) break;

    for (const [dr, dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
          !visited[nr][nc] && gridData[nr][nc].type !== "wall") {
        stack.push([nr, nc]);
        prev[nr][nc] = [r, c];
      }
    }
    await sleep(100);
  }
  drawPath(prev);
}

function drawPath(prev) {
  if (!end) return;
  let [r, c] = [+end.element.dataset.row, +end.element.dataset.col];
  while (prev[r][c]) {
    const [pr, pc] = prev[r][c];
    if (gridData[pr][pc] !== start) {
      gridData[pr][pc].element.classList.remove("visited");
      gridData[pr][pc].element.classList.add("path");
    }
    [r, c] = [pr, pc];
  }
}

function generateMaze() {
  createGrid();
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (Math.random() < 0.3) {
        gridData[i][j].type = "wall";
        gridData[i][j].element.classList.add("wall");
      }
    }
  }
}

createGrid();
