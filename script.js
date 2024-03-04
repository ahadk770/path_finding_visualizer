import { addEventListenerToButtons } from "./helpers/eventHandlers.js";
import { createGrid } from "./helpers/gridHelper.js";

// initalize the program
const initalizeVisualizer = (row, cols) => {
  addEventListenerToButtons(row, cols);
  createGrid(row, cols);
};

const row = 15;
const cols = 15;
initalizeVisualizer(row, cols);
