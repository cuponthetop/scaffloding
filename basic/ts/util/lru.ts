import * as _ from 'lodash';

interface IEntry<T> {
  newer?: IEntry<T>;
  older?: IEntry<T>;
  key: string;
  value: T;
}

interface ILRUCache<T> {
  put: (key: string, value: T) => void;
  get: (key: string) => T;
}


/**
 * code from https://github.com/TrueLink/lru-ts/blob/master/index.ts
 * modified by cuponthetop
 *
 * @export
 * @class LRUCache
 * @implements {ILRUCache<T>}
 * @template T
 */
export class LRUCache<T> implements ILRUCache<T> {
  // Current size of the cache. (Read-only).
  private _size: number = 0;
  // Maximum number of items this cache can hold.
  private limit: number = 0;
  private _keymap: Map<string, IEntry<T>>;
  private _tail: IEntry<T> = undefined;
  private _head: IEntry<T> = undefined;

  constructor(limit: number) {
    this.limit = limit;
    this._keymap = new Map<string, IEntry<T>>();
  }

  put(key: string, value: T): void {
    let entry: IEntry<T> = { key: key, value: value };
    // Note: No protection agains replacing, and thus orphan entries. By design.
    this._keymap.set(key, entry);
    if (false === _.isUndefined(this._tail)) {
      // link previous tail to the new tail (entry)
      this._tail.newer = entry;
      entry.older = this._tail;
    } else {
      // we're first in -- yay
      this._head = entry;
    }
    // add new entry to the end of the linked list -- it's now the freshest entry.
    this._tail = entry;
    if (this._size === this.limit) {
      // we hit the limit -- remove the head
      this.shift();
      return;
    } else {
      // increase the size counter
      this._size++;
    }
  };

  shift(): IEntry<T> {
    // todo: handle special case when limit == 1
    let entry = this._head;
    if (false === _.isUndefined(entry)) {
      if (false === _.isUndefined(this._head.newer)) {
        this._head = this._head.newer;
        this._head.older = undefined;
      } else {
        this._head = undefined;
      }
      // Remove last strong reference to <entry> and remove links from the purged
      // entry being returned:
      entry.newer = entry.older = undefined;
      // delete is slow, but we need to do this to avoid uncontrollable growth:
      this._keymap.delete(entry.key);
    }
    console.log('purging ', entry.key);
    return entry;
  };

  get(key: string): T {
    // First, find our cache entry
    let entry = this._keymap.get(key);
    if (true === _.isUndefined(entry)) {
      return; // Not cached. Sorry.
    }
    // As <key> was found in the cache, register it as being requested recently
    if (entry === this._tail) {
      // Already the most recently used entry, so no need to update the list
      return entry.value;
    }
    // HEAD--------------TAIL
    //   <.older   .newer>
    //  <--- add direction --
    //   A  B  C  <D>  E
    if (false === _.isUndefined(entry.newer)) {
      if (entry === this._head) {
        this._head = entry.newer;
      }
      entry.newer.older = entry.older; // C <-- E.
    }
    if (false === _.isUndefined(entry.older)) {
      entry.older.newer = entry.newer; // C. --> E
    }
    entry.newer = undefined; // D --x
    entry.older = this._tail; // D. --> E
    if (false === _.isUndefined(this._tail)) {
      this._tail.newer = entry; // E. <-- D
    }
    this._tail = entry;

    return entry.value;
  };

  find(key: string): IEntry<T> {
    return this._keymap.get(key);
  };

  remove(key: string): any {
    let entry = this._keymap.get(key);
    if (true === _.isUndefined(entry)) return;

    this._keymap.delete(entry.key); // need to do delete unfortunately

    if (entry.newer && entry.older) {
      // relink the older entry with the newer entry
      entry.older.newer = entry.newer;
      entry.newer.older = entry.older;
    } else if (false === _.isUndefined(entry.newer)) {
      // remove the link to us
      entry.newer.older = undefined;
      // link the newer entry to head
      this._head = entry.newer;
    } else if (false === _.isUndefined(entry.older)) {
      // remove the link to us
      entry.older.newer = undefined;
      // link the newer entry to head
      this._tail = entry.older;
    } else {// if(entry.older === undefined && entry.newer === undefined) {
      this._head = this._tail = undefined;
    }

    this._size--;
    return entry.value;
  };

  /** Removes all entries */
  removeAll(): void {
    // This should be safe, as we never expose strong refrences to the outside
    this._head = this._tail = undefined;
    this._size = 0;
    this._keymap.clear();
  };

  keys(): string[] {
    return Object.keys(this._keymap);
  }

  forEach(fun: Function, context: any, desc: boolean): void {
    let entry: IEntry<T>;
    if (context === true) { desc = true; context = undefined; }
    else if (typeof context !== 'object') context = this;
    if (true === desc) {
      entry = this._tail;
      while (false === _.isUndefined(entry)) {
        fun.call(context, entry.key, entry.value, this);
        entry = entry.older;
      }
    } else {
      entry = this._head;
      while (false === _.isUndefined(entry)) {
        fun.call(context, entry.key, entry.value, this);
        entry = entry.newer;
      }
    }
  };

  toString(): string {
    let s = '', entry = this._head;
    while (false === _.isUndefined(entry)) {
      s += String(entry.key) + ':' + entry.value;
      entry = entry.newer;
      if (false === _.isUndefined(entry)) {
        s += ' < ';
      }
    }
    return s;
  };
}


