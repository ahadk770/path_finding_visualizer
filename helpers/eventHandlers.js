import { BFS } from "../algorithms/bfs.js";
import {
  BUTTON_IDS,
  getCellId,
  getElementFromDoc,
  EVENT_HANDLER,
  disableButton,
  CELL_CLASS_NAMES,
  enableButton,
  sleep,
} from "./utils.js";
import { removeGrid, createGrid, getGrid } from "./gridHelper.js";

const RANDOM_WALL_PROB = 0.25;

// called at the start of the program to attach handlers to buttons
export const addEventListenerToButtons = (rows, cols) => {
  const resetButtonElement = getElementFromDoc(BUTTON_IDS.Reset);
  resetButtonElement.addEventListener(EVENT_HANDLER.Click, (e) => {
    resetGraph(e, rows, cols);
  });

  const findPathButtonElement = getElementFromDoc(BUTTON_IDS.FindPath);
  findPathButtonElement.addEventListener(EVENT_HANDLER.Click, (e) =>
    handleFindPathClick(e, rows, cols)
  );

  const generateRandomGridElement = getElementFromDoc(BUTTON_IDS.Generate);
  generateRandomGridElement.addEventListener(EVENT_HANDLER.Click, (e) =>
    generateRandomGrid(e, rows, cols)
  );

  const fasterButtonElement = getElementFromDoc(BUTTON_IDS.Fast);
  fasterButtonElement.addEventListener(EVENT_HANDLER.Click, (e) => {
    fasterAnimations(e);
  });

  const slowerButtonElement = getElementFromDoc(BUTTON_IDS.Slow);
  slowerButtonElement.addEventListener(EVENT_HANDLER.Click, (e) => {
    slowerAnimations(e);
  });
};

const fasterAnimations = (_e) => {
  BFS.setSpeed(4);
};

const slowerAnimations = (_e) => {
  BFS.setSpeed(0.25);
};

// TO-DO: Add more algos
const handleFindPathClick = (_e, rows, cols) => {
  BFS.resetAbort();
  disableButton(BUTTON_IDS.FindPath);
  disableButton(BUTTON_IDS.Generate);

  const grid = getGrid(rows, cols, true);
  BFS.bfs(grid, document);
};

// Reset BFS
// Bug if we switch between find path and reset too quickly then some
// red cell will persist
const resetGraph = async (_e, rows, cols) => {
  disableButton(BUTTON_IDS.FindPath);
  disableButton(BUTTON_IDS.Generate);
  disableButton(BUTTON_IDS.Reset);
  BFS.stopBfs();
  await sleep(100);

  removeGrid(rows);
  createGrid(rows, cols);
  enableButton(BUTTON_IDS.FindPath);
  enableButton(BUTTON_IDS.Generate);
  enableButton(BUTTON_IDS.Reset);
};

// Generate a random grid with walls
const generateRandomGrid = async (_e, rows, cols) => {
  removeGrid(rows);
  createGrid(rows, cols);
  for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
      const random_boolean = Math.random() < RANDOM_WALL_PROB;
      if (random_boolean) {
        const cellElement = getElementFromDoc(
          CELL_CLASS_NAMES.Cell + getCellId(i, j)
        );
        cellElement.className = CELL_CLASS_NAMES.CellSelected;
      }
    }
  }
};

// Handle click on grid to create a wall
export const handleClick = (e) => {
  const elementId = e.target.id;
  const className = e.target.className;
  const cellElement = getElementFromDoc(elementId);

  className === CELL_CLASS_NAMES.Cell
    ? (cellElement.className = CELL_CLASS_NAMES.CellSelected)
    : (cellElement.className = CELL_CLASS_NAMES.Cell);
};
