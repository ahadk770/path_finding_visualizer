import {
  CELL_CLASS_NAMES,
  DIV_ID,
  getCellId,
  EVENT_HANDLER,
} from "../utils.js";
import { handleClick } from "../eventHandlers.js";

const BOARD_STYLES = {
  LEFT: "border-left: solid; ",
  TOP: "border-top: solid; ",
  RIGHT: "border-right: solid; ",
  BOTTOM: "border-bottom: solid; ",
};

const CSS_ELEMENT = {
  DIV: "div",
  H3: "h3",
  BUTTON: "button",
};

const GRID_CLASSNAME = {
  INDEX_CONTAINER: "idxContainer",
  GRID_ROW: "gridRow",
};

export const createGrid = (rows, cols) => {
  const gridContainer = createGridContainer();
  for (var i = 0; i < rows; i++) {
    const rowContainer = createGridRowContainer(i);
    rowContainer.appendChild(addLeftColumnIndex(i));
    for (var j = 0; j < cols; j++) {
      createGridCell(i, j, rows, cols, rowContainer);
    }
    gridContainer.appendChild(rowContainer);
  }
  gridContainer.appendChild(addBottomRowIndex(cols));
};

// Helper Functions
const createGridContainer = () => {
  const gridContainer = document.createElement(CSS_ELEMENT.DIV);
  gridContainer.className = DIV_ID.GridContainer;
  gridContainer.id = DIV_ID.GridContainer;
  document.body.appendChild(gridContainer);
  return gridContainer;
};

const createGridRowContainer = (i) => {
  const rowContainer = document.createElement(CSS_ELEMENT.DIV);
  rowContainer.className = GRID_CLASSNAME.GRID_ROW;
  rowContainer.id = i;
  return rowContainer;
};

const createGridCell = (i, j, rows, cols, rowContainer) => {
  const cell = document.createElement(CSS_ELEMENT.BUTTON);
  cell.id = CELL_CLASS_NAMES.Cell + getCellId(i, j);
  cell.className = CELL_CLASS_NAMES.Cell;

  getGridBoardStyle(cell, i, j, rows, cols);

  cell.addEventListener(EVENT_HANDLER.Click, handleClick);
  rowContainer.appendChild(cell);
};

// create list of indices for left axis
const addLeftColumnIndex = (i) => {
  const idxContainer = document.createElement(CSS_ELEMENT.DIV);
  idxContainer.className = GRID_CLASSNAME.INDEX_CONTAINER;
  const rowIdx = document.createElement(CSS_ELEMENT.H3);
  rowIdx.textContent = i;
  idxContainer.appendChild(rowIdx);
  return idxContainer;
};

// create list of indices for bottom axis
const addBottomRowIndex = (cols) => {
  const bottomRow = document.createElement(CSS_ELEMENT.DIV);
  bottomRow.className = GRID_CLASSNAME.GRID_ROW;
  for (var i = 0; i < cols + 1; i++) {
    const idxContainer = document.createElement(CSS_ELEMENT.DIV);
    idxContainer.className = GRID_CLASSNAME.INDEX_CONTAINER;

    idxContainer.id = CELL_CLASS_NAMES.Cell + getCellId(i, cols + 1);
    const rowIdx = document.createElement(CSS_ELEMENT.H3);
    if (i !== 0) rowIdx.textContent = i - 1;
    idxContainer.appendChild(rowIdx);
    bottomRow.appendChild(idxContainer);
  }
  return bottomRow;
};

// add this for border effect
const getGridBoardStyle = (cell, i, j, rows, cols) => {
  let style = "";
  if (j === 0) style += BOARD_STYLES.LEFT;
  if (i === 0) style += BOARD_STYLES.TOP;
  if (j === cols - 1) style += BOARD_STYLES.RIGHT;
  if (i === rows - 1) style += BOARD_STYLES.BOTTOM;
  cell.style = style;
};
