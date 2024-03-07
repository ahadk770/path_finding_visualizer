import {
  CELL_CLASS_NAMES,
  DIV_ID,
  getCellId,
  EVENT_HANDLER,
  getElementFromDoc,
} from "./utils.js";
import { handleClick } from "./eventHandlers.js";

export const createGrid = (rows, cols) => {
  const grid = document.createElement("div");
  grid.className = DIV_ID.GridContainer;
  grid.id = DIV_ID.GridContainer;
  document.body.appendChild(grid);
  for (var i = 0; i < rows; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "gridRow";
    rowDiv.id = i;
    grid.appendChild(rowDiv);
    for (var j = 0; j < cols; j++) {
      const cell = document.createElement(`button`);
      cell.id = CELL_CLASS_NAMES.Cell + getCellId(i, j);
      cell.className = CELL_CLASS_NAMES.Cell;
      cell.addEventListener(EVENT_HANDLER.Click, handleClick);
      rowDiv.appendChild(cell);
    }
  }
};

export const removeGrid = () => {
  const grid = getElementFromDoc(DIV_ID.GridContainer);
  grid.remove();
};

export const getGrid = (rows, cols, disabled = false) => {
  const graph = [];
  for (var i = 0; i < rows; i++) {
    const row = [];
    for (var j = 0; j < cols; j++) {
      const cellElement = getElementFromDoc(
        CELL_CLASS_NAMES.Cell + getCellId(i, j)
      );
      if (disabled) cellElement.disabled = true;

      const cellElementClassName = cellElement.className;
      const wallOrNot =
        cellElementClassName === CELL_CLASS_NAMES.CellSelected ? 1 : 0;
      row.push(wallOrNot);
    }
    graph.push(row);
  }
  return graph;
};

export const isInvalidCell = (x, y, graph, visited) => {
  const rows = graph.length;
  const cols = graph[0].length;
  return (
    x < 0 ||
    y < 0 ||
    x >= rows ||
    y >= cols ||
    graph[x][y] === 1 ||
    visited.has(getCellId(x, y))
  );
};
