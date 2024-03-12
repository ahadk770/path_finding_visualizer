export const getCellId = (i, j) => i + "-" + j;

// add enums for all the strings used
export const BUTTON_IDS = {
  Reset: "reset",
  FindPath: "findPath",
  Generate: "generate",
  Fast: "fast",
  Slow: "slow",
  PathOptions: "pathOptions",
};

// Add more IDs here
export const DIV_ID = {
  GridContainer: "gridContainer",
  Grid: "grid",
};

export const EVENT_HANDLER = {
  Click: "click",
};

export const CELL_CLASS_NAMES = {
  Cell: "cell",
  CellSelected: "cellSelected",
  CellVisited: "cellVisited",
  CellNeighbor: "cellNeighbor",
  CellActive: "cellActive",
  CellFound: "cellFound",
};

export const PATH_ALGORITHMS = {
  DFS: "dfs",
  BFS: "bfs",
  DIJKSTRA: "dijkstra",
};

export const getElementFromDoc = (id) => {
  return document.getElementById(id);
};

export const disableButton = (buttonId) => {
  const buttonElement = getElementFromDoc(buttonId);
  buttonElement.disabled = true;
};

export const enableButton = (buttonId) => {
  const buttonElement = getElementFromDoc(buttonId);
  buttonElement.disabled = false;
};

export const sleep = async (time) => {
  await new Promise((r) => setTimeout(r, time));
};
