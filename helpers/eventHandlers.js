import { BFS } from "../algorithms/bfs.js";
import { DFS } from "../algorithms/dfs.js";
import {
  BUTTON_IDS,
  getCellId,
  getElementFromDoc,
  EVENT_HANDLER,
  disableButton,
  CELL_CLASS_NAMES,
  enableButton,
  sleep,
  PATH_ALGORITHMS,
} from "./utils.js";
import { removeGrid, getGrid } from "./Grid/gridHelper.js";
import { createGrid } from "./Grid/createGrid.js";

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
  const path = getPathAlgorithmClass();
  path.setSpeed(4);
};

const slowerAnimations = (_e) => {
  const path = getPathAlgorithmClass();
  path.setSpeed(0.25);
};

const getPathAlgorithmClass = () => {
  const pathSelectElement = getElementFromDoc("pathOptions");
  const path = pathSelectElement.value;

  switch (path) {
    case PATH_ALGORITHMS.BFS:
      return BFS;
    case PATH_ALGORITHMS.DFS:
      return DFS;
  }
};

// TO-DO: Add more algos
const handleFindPathClick = (_e, rows, cols) => {
  const path = getPathAlgorithmClass();
  path.resetAbort();
  disableButton(BUTTON_IDS.FindPath);
  disableButton(BUTTON_IDS.Generate);
  disableButton(BUTTON_IDS.PathOptions);

  const grid = getGrid(rows, cols, true);
  path.findPath(grid, document);
};

// Reset Graph and Path Finder Algorithm
const resetGraph = async (_e, rows, cols) => {
  const path = getPathAlgorithmClass();
  disableButton(BUTTON_IDS.FindPath);
  disableButton(BUTTON_IDS.Generate);
  disableButton(BUTTON_IDS.Reset);
  path.stopPathFinding();
  path.setSpeed(1);
  await sleep(200);

  removeGrid();
  createGrid(rows, cols);
  enableButton(BUTTON_IDS.FindPath);
  enableButton(BUTTON_IDS.Generate);
  enableButton(BUTTON_IDS.Reset);
  enableButton(BUTTON_IDS.PathOptions);
};

// Generate a random grid with walls
const generateRandomGrid = async (_e, rows, cols) => {
  removeGrid();
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
