import {
  CELL_CLASS_NAMES,
  getCellId,
  getElementFromDoc,
  sleep,
} from "../helpers/utils.js";
import { Queue } from "../helpers/DataStructures/Queue.js";
import { isInvalidCell } from "../helpers/Grid/gridHelper.js";

export const BFS = {
  abort: false,
  speed: 1,
  findPath(graph, document) {
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

      const paths = new Queue();
      paths.add(getCellId(...startingPoint));
      while (!queue.isEmpty()) {
        const [x, y] = queue.dequeue();
        const key = getCellId(x, y);

        if (this.abort) {
          this.abort = false;
          return;
        }

        if (isInvalidCell(x, y, graph, visited)) {
          paths.dequeue();
          continue;
        }

        const currNode = document.getElementById(CELL_CLASS_NAMES.Cell + key);
        if (currNode) {
          await sleep(50 / this.speed);
          currNode.className = CELL_CLASS_NAMES.CellActive;
        }

        if (x === endPointX && y === endPointY) {
          const key = getCellId(x, y);
          // To-Do: Animate the final path (quickest path)
          const finalPath = paths.dequeue();
          await animatePath(finalPath);
          const currNode = document.getElementById(CELL_CLASS_NAMES.Cell + key);
          if (currNode) {
            await sleep(50 / this.speed);
            currNode.className = CELL_CLASS_NAMES.CellFound;
          }
          console.log("Found path...");
          break;
        }

        visited.add(key);

        const currPath = paths.dequeue();

        paths.add(currPath + " " + getCellId(x + 1, y));
        queue.add([x + 1, y]);
        paths.add(currPath + " " + getCellId(x - 1, y));
        queue.add([x - 1, y]);
        paths.add(currPath + " " + getCellId(x, y + 1));
        queue.add([x, y + 1]);
        paths.add(currPath + " " + getCellId(x, y - 1));
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

        await animateNeighbors(x + 1, y, graph, visited, up, this.speed);
        await animateNeighbors(x - 1, y, graph, visited, down, this.speed);
        await animateNeighbors(x, y + 1, graph, visited, left, this.speed);
        await animateNeighbors(x, y - 1, graph, visited, right, this.speed);

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

  async stopPathFinding() {
    BFS.abort = true;
  },
};

const animatePath = async (pathsString) => {
  const paths = pathsString.split(" ");

  for (const path of paths) {
    const cellPath = getElementFromDoc(CELL_CLASS_NAMES.Cell + path);
    cellPath.className = CELL_CLASS_NAMES.CellActive;
    await sleep(100);
  }
};

const animateNeighbors = async (x, y, graph, visited, element, speed) => {
  if (element && !isInvalidCell(x, y, graph, visited)) {
    await sleep(50 / speed);
    element.className = CELL_CLASS_NAMES.CellNeighbor;
  }
};
