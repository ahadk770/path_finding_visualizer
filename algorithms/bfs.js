import {
  CELL_CLASS_NAMES,
  getCellId,
  getElementFromDoc,
  sleep,
} from "../helpers/utils.js";
import { Queue } from "../helpers/Queue.js";

export const BFS = {
  abort: false,
  speed: 1,
  bfs(graph, document) {
    const runBfs = async (graph, document) => {
      if (this.abort) {
        this.abort = false;
        return;
      }

      const rows = graph.length;
      const cols = graph[0].length;

      const startingPoint = [rows - 1, 0];
      const endPoint = [0, cols - 1];
      const [endPointX, endPointY] = endPoint;

      // Keep a set of visited nodes
      const visited = new Set();

      // Add neighboring nodes to queue
      const queue = new Queue();
      queue.add(startingPoint);
      while (!queue.isEmpty()) {
        const [x, y] = queue.dequeue();
        const key = getCellId(x, y);

        if (this.abort) {
          this.abort = false;
          return;
        }

        if (isInvalidCell(x, y, rows, cols, graph, visited)) {
          continue;
        }

        const currNode = document.getElementById(CELL_CLASS_NAMES.Cell + key);
        if (currNode) {
          await sleep(100 / this.speed);
          currNode.className = CELL_CLASS_NAMES.CellActive;
        }

        if (x === endPointX && y === endPointY) {
          console.log("Found path...");
          break;
        }

        visited.add(key);

        queue.add([x + 1, y]);
        queue.add([x - 1, y]);
        queue.add([x, y + 1]);
        queue.add([x, y - 1]);

        // mark neighbors of cells
        const up = getElementFromDoc(
          CELL_CLASS_NAMES.Cell + getCellId(x + 1, y)
        );
        const down = getElementFromDoc(
          CELL_CLASS_NAMES.Cell + getCellId(x - 1, y)
        );
        const left = getElementFromDoc(
          CELL_CLASS_NAMES.Cell + getCellId(x, y + 1)
        );
        const right = getElementFromDoc(
          CELL_CLASS_NAMES.Cell + getCellId(x, y - 1)
        );

        await animateNeighbors(
          x + 1,
          y,
          rows,
          cols,
          graph,
          visited,
          up,
          this.speed
        );
        await animateNeighbors(
          x - 1,
          y,
          rows,
          cols,
          graph,
          visited,
          down,
          this.speed
        );
        await animateNeighbors(
          x,
          y + 1,
          rows,
          cols,
          graph,
          visited,
          left,
          this.speed
        );
        await animateNeighbors(
          x,
          y - 1,
          rows,
          cols,
          graph,
          visited,
          right,
          this.speed
        );

        // mark cell as visited
        if (currNode) {
          await sleep(100 / this.speed);
          currNode.className = CELL_CLASS_NAMES.CellVisited;
        }
      }
    };
    runBfs(graph, document);
  },

  setSpeed(newSpeed) {
    BFS.speed = newSpeed;
  },

  resetAbort() {
    BFS.abort = false;
  },

  async stopBfs() {
    BFS.abort = true;
  },
};

const animateNeighbors = async (
  x,
  y,
  rows,
  cols,
  graph,
  visited,
  element,
  speed
) => {
  if (element && !isInvalidCell(x, y, rows, cols, graph, visited)) {
    await sleep(50 / speed);
    element.className = CELL_CLASS_NAMES.CellNeighbor;
  }
};

const isInvalidCell = (x, y, rows, cols, graph, visited) => {
  return (
    x < 0 ||
    y < 0 ||
    x >= rows ||
    y >= cols ||
    graph[x][y] === 1 ||
    visited.has(getCellId(x, y))
  );
};
