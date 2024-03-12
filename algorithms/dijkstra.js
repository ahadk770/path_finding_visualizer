import { getCellId } from "../helpers/utils.js";
import { isInvalidCell } from "../helpers/Grid/gridHelper.js";
import { Heap } from "../helpers/DataStructures/Heap.js";

export const DIJKSTRA = {
  abort: false,
  speed: 1,
  // To-Do: add animations
  findPath(graph, document) {
    const runDijstra = async (graph, document) => {
      const rows = graph.length;
      const startingPoint = [rows - 1, 0];
      const [startingX, startingY] = startingPoint;

      const visited = new Set();
      const heap = new Heap();
      const minimumDistance = new Map();
      const source = new Map();

      for (let i = 0; i < graph.length; ++i) {
        for (let j = 0; j < graph[i].length; ++j) {
          if (graph[i][j] !== 1) {
            const cellKey = getCellId(i, j);
            minimumDistance.set(cellKey, Number.MAX_VALUE);
            source.set(cellKey, undefined);
          }
        }
      }

      const startCellKey = getCellId(startingX, startingY);
      minimumDistance.set(startCellKey, 0);
      heap.add({ key: startCellKey, minDist: 0 });

      while (!heap.isEmpty()) {
        const currNode = heap.removeMinObject();

        const [x, y] = getCoordsFromId(currNode.key);
        const neighboringCells = [
          [x - 1, y],
          [x, y + 1],
          [x + 1, y],
          [x, y - 1],
        ];

        const distanceToOrigin = minimumDistance.get(currNode.key);

        for (const neighbor of neighboringCells) {
          const [newX, newY] = neighbor;
          if (!isInvalidCell(newX, newY, graph, visited)) {
            const neighborCellKey = getCellId(newX, newY);
            const currDistanceToCell = minimumDistance.get(neighborCellKey);

            if (currDistanceToCell > distanceToOrigin + 1) {
              minimumDistance.set(neighborCellKey, distanceToOrigin + 1);
              source.set(neighborCellKey, currNode.key);
            }

            if (!visited.has(neighborCellKey) && !heap.contains(neighborCellKey)) {
              heap.add({
                key: neighborCellKey,
                minDist: minimumDistance.get(neighborCellKey),
              });
            }
          }
        }

        visited.add(currNode.key);
      }

      // Temp: Find the shortest path
      let currKey = '0-14'
      while(true){
        if(source.get(currKey) === '14-0') break;
        console.log(currKey)
        currKey = source.get(currKey)
      }
    };
    runDijstra(graph, document);
  },

  setSpeed(newSpeed) {
    DIJKSTRA.speed = newSpeed;
  },

  resetAbort() {
    DIJKSTRA.abort = false;
  },

  async stopPathFinding() {
    DIJKSTRA.abort = true;
  },
};

const getCoordsFromId = (cellId) => [
  Number.parseInt(cellId.split("-")[0]),
  Number.parseInt(cellId.split("-")[1]),
];
