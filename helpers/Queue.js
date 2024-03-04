export class Queue {
  constructor() {
    this.queue = [];
  }
  add(item) {
    this.queue.push(item);
  }
  dequeue() {
    return this.queue.shift();
  }
  isEmpty() {
    return this.queue.length == 0;
  }
}
