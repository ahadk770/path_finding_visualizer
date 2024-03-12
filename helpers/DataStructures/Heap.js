export class Heap {
  constructor() {
    this.heap = [];
  }

  add(element) {
    this.heap.push(element);
    this.heap.sort((a, b) => a.minDist - b.minDist);
  }

  removeMinObject() {
    return this.heap.shift();
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  contains(value) {
    return this.heap.some((item) => item.key === value);
  }
}
