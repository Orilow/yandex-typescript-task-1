/**
 * Сделано задание на звездочку
 * Реализованы методы LinkedList.prev и LinkedList.next
 */
export const isStar = true;


class Leaf<T> {
    value: T;
    prev?: Leaf<T>;
    next?: Leaf<T>;

    constructor(element: T) {
        this.value = element;
        this.prev = undefined;
        this.next = undefined;
    }
}

class PriorityLeaf<T> extends Leaf<T> {
    prev?: PriorityLeaf<T>;
    next?: PriorityLeaf<T>;
    priority: number;

    constructor(element: T, priority: number) {
        super(element);
        this.priority = priority;
    }
}

export class LinkedList<T> {
    private head?: Leaf<T>;
    private tail?: Leaf<T>;
    private pointer?: Leaf<T>;
    public size: number;

    constructor() {
        this.size = 0;
    }

    prev(): T | undefined {
        if (!this.pointer || this.size === 0) {
            return;
        }
        if (this.pointer.prev) {
            const returned = this.pointer;
            this.pointer = this.pointer.prev;

            return returned.value;
        }

        return this.pointer.value;
    }

    next(): T | undefined {
        if (!this.pointer || this.size === 0) {
            return;
        }
        if (this.pointer.next) {
            const returned = this.pointer;
            this.pointer = this.pointer.next;

            return returned.value;
        }

        return this.pointer.value;
    }

    push(element: T): void {
        const leaf = new Leaf(element);
        if (!this.head) {
            this.head = leaf;
            this.tail = leaf;
            this.pointer = leaf;
        } else if (this.tail) {
            leaf.prev = this.tail;
            this.tail.next = leaf;
            this.tail = leaf;
        }

        this.size++;
    }

    pop(): T | undefined {
        if (!this.tail) {
            return;
        }
        this.size--;
        const poppedLeaf = this.tail;
        if (this.tail.prev) {
            if (this.pointer === this.tail) {
                this.prev();
            }
            this.tail.prev.next = undefined;
            this.tail = this.tail.prev;
        } else {
            this.head = undefined;
            this.tail = undefined;
            this.pointer = undefined;
        }

        return poppedLeaf.value;
    }

    unshift(element: T): void {
        const leaf = new Leaf(element);
        if (!this.head) {
            this.head = leaf;
            this.tail = leaf;
            this.pointer = leaf;
        } else {
            this.head.prev = leaf;
            leaf.next = this.head;
            this.head = leaf;
        }
        this.size++;
    }

    shift(): T | undefined {
        if (!this.head) {
            return;
        }
        this.size--;
        const poppedLeaf = this.head;
        if (this.head.next) {
            if (this.head === this.pointer) {
                this.next();
            }
            this.head.next.prev = undefined;
            this.head = this.head.next;
        } else {
            this.head = undefined;
            this.tail = undefined;
            this.pointer = undefined;
        }

        return poppedLeaf.value;
    }

    get(index: number): T | undefined {
        if (index < 0 || index >= this.size || !this.head) {
            return;
        }
        let count = 0;
        let leaf = this.head;
        while (count < index) {
            if (leaf.next) {
                leaf = leaf.next;
                count++;
            }
        }

        return leaf.value;
    }


}

export class RingBuffer<T> {
    public capacity: number;
    private linkedList: LinkedList<T>;

    constructor(capacity: number) {
        this.capacity = capacity;
        this.linkedList = new LinkedList<T>();
    }

    get size(): number {
        return this.linkedList.size;
    }

    push(element: T): void {
        if (this.linkedList.size < this.capacity) {
            this.linkedList.push(element);
        } else {
            this.linkedList.shift();
            if (this.linkedList.size < this.capacity) {
                this.linkedList.push(element);
            }
        }
    }

    get(index: number): T | undefined {
        return this.linkedList.get(index);
    }

    shift(): T | undefined {
        return this.linkedList.shift();
    }

    static concat<T>(...buffers: RingBuffer<T>[]): RingBuffer<T> {
        const newCapacity = buffers.reduce((acc, cur) => acc + cur.capacity, 0);

        return buffers.reduce((acc, cur) => {
            let index = 0;
            let el = cur.get(index);
            while (el !== undefined) {
                acc.push(el);
                index++;
                el = cur.get(index);
            }

            return acc;
        }, new RingBuffer(newCapacity));
    }
}

export class Queue<T> {
    private linkedList: LinkedList<T>;

    constructor() {
        this.linkedList = new LinkedList<T>();
    }

    get size(): number {
        return this.linkedList.size;
    }

    get(index: number): T | undefined {
        return this.linkedList.get(index);
    }

    enqueue(element: T): void {
        this.linkedList.unshift(element);
    }

    dequeue(): T | undefined {
        return this.linkedList.pop();
    }
}

export class PriorityQueue<T> {
    private head?: PriorityLeaf<T>;

    public size: number;

    constructor() {
        this.size = 0;
    }

    private findLeafWithLowerPriority(start: PriorityLeaf<T>, priority: number):
        PriorityLeaf<T> | undefined {
        let suitLeaf: PriorityLeaf<T> | undefined = start;
        while (suitLeaf !== undefined) {
            if (suitLeaf.priority < priority) {
                return suitLeaf;
            }
            suitLeaf = suitLeaf.next;
        }

        return undefined;
    }

    private findLastLeaf(start: PriorityLeaf<T>): PriorityLeaf<T> {
        let currentLeaf = start;
        while (currentLeaf.next !== undefined) {
            currentLeaf = currentLeaf.next;
        }

        return currentLeaf;
    }

    private insertBefore(leaf: PriorityLeaf<T>, beforeThisLeaf: PriorityLeaf<T>): void {
        leaf.next = beforeThisLeaf;
        leaf.prev = beforeThisLeaf.prev;
        if (beforeThisLeaf.prev) {
            beforeThisLeaf.prev.next = leaf;
        } else {
            this.head = leaf;
        }
        beforeThisLeaf.prev = leaf;
    }

    private insertInTheEnd(leaf: PriorityLeaf<T>, start: PriorityLeaf<T>): void {
        const lastLeaf = this.findLastLeaf(start);
        lastLeaf.next = leaf;
        leaf.prev = lastLeaf;
    }

    private insertLeaf(leaf: PriorityLeaf<T>): void {
        if (!this.head) {
            this.head = leaf;

            return;
        }
        const suitableLeaf: PriorityLeaf<T> | undefined =
            this.findLeafWithLowerPriority(this.head, leaf.priority);

        if (suitableLeaf !== undefined) {
            this.insertBefore(leaf, suitableLeaf);
        } else {
            this.insertInTheEnd(leaf, this.head);
        }
    }

    enqueue(element: T, priority: number): void {
        if (Number.isInteger(priority) && (priority < 1 || priority > 3)) {
            return;
        }

        const leaf = new PriorityLeaf<T>(element, priority);
        this.insertLeaf(leaf);
        this.size++;
    }

    dequeue(): T | undefined {
        if (!this.head) {
            return;
        }
        const poppedLeaf = this.head;
        if (this.head.next) {
            this.head.next.prev = undefined;
            this.head = this.head.next;
        } else {
            this.head = undefined;
        }
        this.size--;

        return poppedLeaf.value;
    }
}

export class HashTable<TKey, TValue> {
    private keys: Array<TKey>;
    private values: Array<TValue>;
    public size: number;

    constructor() {
        this.keys = [];
        this.values = [];
        this.size = 0;
    }

    put(key: TKey, element: TValue): void {
        if (!this.keys.includes(key)) {
            this.keys.push(key);
            this.size++;
        }
        this.values[this.keys.indexOf(key)] = element;
    }

    get(key: TKey): TValue | undefined {
        if (!this.keys.includes(key)) {
            return;
        }

        return this.values[this.keys.indexOf(key)];
    }

    clear(): void {
        this.keys = [];
        this.values = [];
        this.size = 0;
    }
}
