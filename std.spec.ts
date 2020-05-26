/* eslint-env mocha */
/* eslint-disable @typescript-eslint/no-explicit-any */

import * as assert from 'assert';

import * as std from './std';

describe('std', () => {
    describe('LinkedList', () => {
        const ll = new (std.LinkedList as any)();

        it('Можно добавлять элементы', () => {
            assert.equal(ll.size, 0);

            ll.push(1);
            ll.push(2);

            assert.equal(ll.size, 2);
        });

        if (std.isStar) {
            it('Можно ходить по списку с помощью prev / next', () => {
                assert.equal(ll.next(), 1);
                assert.equal(ll.prev(), 2);
                assert.equal(ll.next(), 1);
                assert.equal(ll.prev(), 2);
            });
        }

        it('Можно доставать элементы', () => {
            assert.equal(ll.size, 2);

            assert.equal(ll.pop(), 2);
            assert.equal(ll.shift(), 1);

            assert.equal(ll.size, 0);
        });
    });

    describe('RingBuffer', () => {
        const rb = new (std.RingBuffer as any)(3);

        it('Можно добавлять элементы', () => {
            assert.equal(rb.size, 0);
            assert.equal(rb.capacity, 3);

            rb.push(1);
            rb.push(2);

            assert.equal(rb.size, 2);
        });

        it('Можно получать элемент по индексу', () => {
            assert.equal(rb.get(1), 2);
        });

        it('Должен переполниться, если больше элементов, чем размер буфера', () => {
            rb.push(3);

            assert.equal(rb.size, 3);

            rb.push(4);

            assert.equal(rb.size, 3);
        });

        it('Можно доставать элементы', () => {
            assert.equal(rb.size, 3);

            assert.equal(rb.shift(), 2);
            assert.equal(rb.shift(), 3);

            assert.equal(rb.size, 1);
        });
    });

    describe('Queue', () => {
        const q = new (std.Queue as any)();

        it('Можно добавлять элементы', () => {
            assert.equal(q.size, 0);

            q.enqueue(1);
            q.enqueue(2);

            assert.equal(q.size, 2);
        });

        it('Можно получать элемент по индексу', () => {
            assert.equal(q.get(0), 2);
        });

        it('Можно доставать элементы', () => {
            assert.equal(q.size, 2);

            assert.equal(q.dequeue(), 1);
            assert.equal(q.dequeue(), 2);

            assert.equal(q.size, 0);
        });
    });

    describe('PriorityQueue', () => {
        const pq = new (std.PriorityQueue as any)();

        it('Можно добавлять элементы', () => {
            assert.equal(pq.size, 0);

            pq.enqueue(1, 3);
            pq.enqueue(2, 1);
            pq.enqueue(3, 2);

            assert.equal(pq.size, 3);
        });

        it('Можно доставать элементы', () => {
            assert.equal(pq.size, 3);

            assert.equal(pq.dequeue(), 1);
            assert.equal(pq.dequeue(), 3);
            assert.equal(pq.dequeue(), 2);

            assert.equal(pq.size, 0);
        });
    });

    describe('HashTable', () => {
        const ht = new (std.HashTable as any)();

        const object = {};

        it('Можно добавлять элементы', () => {
            assert.equal(ht.size, 0);

            ht.put(1, 1);
            ht.put('1', 2);
            ht.put(object, 3);

            assert.equal(ht.size, 3);
        });

        it('Можно получать элемент по ключу', () => {
            assert.equal(ht.get(1), 1);
            assert.equal(ht.get('1'), 2);
            assert.equal(ht.get(object), 3);
        });

        it('Можно очистить', () => {
            assert.equal(ht.size, 3);

            ht.clear();

            assert.equal(ht.size, 0);
        });
    });
});
