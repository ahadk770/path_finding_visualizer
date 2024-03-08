import {
  CELL_CLASS_NAMES,
  DIV_ID,
  getCellId,
  getElementFromDoc,
} from "../utils.js";

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
