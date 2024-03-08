import {
  CELL_CLASS_NAMES,
  getCellId,
  getElementFromDoc,
  sleep,
} from "../helpers/utils.js";
import { isInvalidCell } from "../helpers/Grid/gridHelper.js";
import { Queue } from "../helpers/Queue.js";

// TO-DO: Clean up this code and test it to validate this works repeated
// TO-DO: Test animations
export const DFS = {
  abort: false,
  speed: 1,
  findPath(graph, document) {
    const runDfs = async (graph, document) => {
      const rows = graph.length;
      const startingPoint = [rows - 1, 0];
      const [startingX, startingY] = startingPoint;
      const fastestPath = new Queue();

      // Keep a set of visited nodes
      const visited = new Set();

      // Current path
      const path = [];

      // run dfs recursively
      const dfsHelper = async (graph, x, y, visited, path) => {
        // stop dfs path
        if (this.abort) return;
        if (isInvalidCell(x, y, graph, visited)) return false;

        // check if at the end
        const cols = graph[0].length;
        const endPoint = [0, cols - 1];
        const [endPointX, endPointY] = endPoint;
        if (x === endPointX && y === endPointY) {
          const key = getCellId(x, y);
          const currNode = document.getElementById(CELL_CLASS_NAMES.Cell + key);
          if (currNode) {
            await sleep(100 / this.speed);
            currNode.className = CELL_CLASS_NAMES.CellFound;
          }
          path.unshift(startingPoint);
          await animatePath(path, this.speed);
          console.log("Found path...");
          return true;
        }

        // mark current node as visited
        const key = getCellId(x, y);
        const currNode = document.getElementById(CELL_CLASS_NAMES.Cell + key);
        if (currNode) {
          await sleep(100 / this.speed);
          currNode.className = CELL_CLASS_NAMES.CellVisited;
        }

        visited.add(getCellId(x, y));

        const neighboringCells = [
          [x - 1, y],
          [x, y + 1],
          [x + 1, y],
          [x, y - 1],
        ];

        for (const neighboringCell of neighboringCells) {
          const [nextX, nextY] = neighboringCell;

          if (!isInvalidCell(nextX, nextY, graph, visited)) {
            path.push([nextX, nextY]);
            const foundPath = await dfsHelper(
              graph,
              nextX,
              nextY,
              visited,
              path
            );
            if (this.abort) return;
            if (foundPath) return true;

            // create backtracking animation
            while (path.length) {
              const backtrackCellKey = getCellId(...path.pop());
              const cellElement = getElementFromDoc(
                CELL_CLASS_NAMES.Cell + backtrackCellKey
              );

              if (backtrackCellKey === key) {
                path.push([x, y]);
                break;
              }

              await sleep(100 / this.speed);
              cellElement.className = CELL_CLASS_NAMES.CellNeighbor;
            }
          }
        }
      };

      await dfsHelper(graph, startingX, startingY, visited, path);
    };
    runDfs(graph, document);
  },

  setSpeed(newSpeed) {
    DFS.speed = newSpeed;
  },

  resetAbort() {
    DFS.abort = false;
  },

  async stopPathFinding() {
    DFS.abort = true;
  },
};

const animatePath = async (paths, speed) => {
  for (const path of paths) {
    const cellPath = getElementFromDoc(
      CELL_CLASS_NAMES.Cell + getCellId(...path)
    );
    cellPath.className = CELL_CLASS_NAMES.CellActive;
    await sleep(100 / speed);
  }
};
