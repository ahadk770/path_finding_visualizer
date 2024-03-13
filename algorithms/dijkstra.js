import { getCellId, sleep } from "../helpers/utils.js";
import { isInvalidCell } from "../helpers/Grid/gridHelper.js";
import { Heap } from "../helpers/DataStructures/Heap.js";
import { CELL_CLASS_NAMES } from "../helpers/utils.js";

export const DIJKSTRA = {
  abort: false,
  speed: 1,
  // To-Do: add animations
  findPath(graph) {
    const runDijstra = async (graph) => {
      initDistanceOnEachCell(graph);

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
        if (this.abort) return;
        const cell = heap.removeMinObject();
        const cellKey = cell.key;

        await animateCell(
          cellKey,
          CELL_CLASS_NAMES.CellVisited,
          cell.minDist,
          this.speed
        );

        const [x, y] = getCoordsFromId(cellKey);
        const neighboringCells = [
          [x - 1, y],
          [x, y + 1],
          [x + 1, y],
          [x, y - 1],
        ];

        const distanceToOrigin = minimumDistance.get(cellKey);

        for (const neighbor of neighboringCells) {
          if (this.abort) return;
          const [newX, newY] = neighbor;
          if (!isInvalidCell(newX, newY, graph, visited)) {
            const neighborCellKey = getCellId(newX, newY);
            const currDistanceToCell = minimumDistance.get(neighborCellKey);

            if (currDistanceToCell > distanceToOrigin + 1) {
              const currMinDistOfNeighborCell =
                minimumDistance.get(neighborCellKey) === Number.MAX_VALUE
                  ? "∞"
                  : minimumDistance.get(neighborCellKey);
              await animateCell(
                neighborCellKey,
                CELL_CLASS_NAMES.CellActive,
                currMinDistOfNeighborCell,
                this.speed
              );
              minimumDistance.set(neighborCellKey, distanceToOrigin + 1);
              source.set(neighborCellKey, cellKey);
            }

            await animateCell(
              neighborCellKey,
              CELL_CLASS_NAMES.CellNeighbor,
              minimumDistance.get(neighborCellKey),
              this.speed
            );

            if (
              !visited.has(neighborCellKey) &&
              !heap.contains(neighborCellKey)
            ) {
              heap.add({
                key: neighborCellKey,
                minDist: minimumDistance.get(neighborCellKey),
              });
            }
          }
        }

        visited.add(cellKey);
      }

      // Temp: Find the shortest path
      let currKey = "0-14";
      while (true) {
        if (source.get(currKey) === "14-0") break;
        console.log(currKey);
        currKey = source.get(currKey);
      }
    };
    runDijstra(graph);
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

const animateCell = async (
  cellId,
  cellClass = CELL_CLASS_NAMES.CellVisited,
  minDist = "∞",
  speed = 1
) => {
  const currNode = document.getElementById(CELL_CLASS_NAMES.Cell + cellId);
  if (currNode) {
    await sleep(200 / speed);
    currNode.className = cellClass;
    currNode.textContent = minDist;
  }
};

const initDistanceOnEachCell = (graph) => {
  const rows = graph.length;
  const cols = graph[0].length;

  for (let i = 0; i < rows; ++i) {
    for (let j = 0; j < cols; ++j) {
      if (!isInvalidCell(i, j, graph, new Set())) {
        const cellId = getCellId(i, j);
        const cell = document.getElementById(CELL_CLASS_NAMES.Cell + cellId);
        cell.textContent = "∞";
      }
    }
  }

  const startCellKey = getCellId(rows - 1, 0);
  const startCell = document.getElementById(
    CELL_CLASS_NAMES.Cell + startCellKey
  );
  startCell.textContent = "0";
};
