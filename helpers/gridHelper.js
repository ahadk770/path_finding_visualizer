import {
  CELL_CLASS_NAMES,
  getCellId,
  EVENT_HANDLER,
  getElementFromDoc,
} from "./utils.js";
import { handleClick } from "./eventHandlers.js";

export const createGrid = (rows, cols) => {
  for (var i = 0; i < rows; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "gridRow";
    rowDiv.id = i;
    document.body.appendChild(rowDiv);
    for (var j = 0; j < cols; j++) {
      const cell = document.createElement(`button`);
      cell.id = CELL_CLASS_NAMES.Cell + getCellId(i, j);
      cell.className = CELL_CLASS_NAMES.Cell;
      cell.addEventListener(EVENT_HANDLER.Click, handleClick);
      rowDiv.appendChild(cell);
    }
  }
};

export const removeGrid = (rows) => {
  for (var i = 0; i < rows; i++) {
    const rowDiv = getElementFromDoc(i);
    rowDiv.remove();
  }
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
