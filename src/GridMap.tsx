import { Coord } from "./types"

class GridMap<T> {
  #rows
  constructor() {
    this.#rows = new Map()
  }

  get(x: number, y: number): T | null {
    const row = this.#rows.get(x)
    if (row !== null && row !== undefined) {
      return row.get(y)
    }
    return null
  }

  set(x: number, y: number, value: T): void {
    let row = this.#rows.get(x)
    if (row === null || row === undefined) {
      row = new Map()
      this.#rows.set(x, row)
    }
    row.set(y, value)
  }

  map<U>(callback: (x: number, y: number, value: T) => [number, number, U]): GridMap<U> {
    const result = new GridMap<U>()
    for (let [x, y, value] of this) {
      const [newX, newY, newValue] = callback(x, y, value)
      result.set(newX, newY, newValue)
    }
    return result
  }

  mapValues<U>(callback: (x: number, y: number, value: T) => U): GridMap<U> {
    return this.map((x, y, value) => [x, y, callback(x, y, value)])
  }

  values() {
    const result = []
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let [x, y, value] of this) {
      result.push(value)
    }
    return result
  }

  *[Symbol.iterator]() {
    for (let [row, columns] of this.#rows.entries()) {
      for (let [column, value] of columns.entries()) {
        yield [row, column, value]
      }
    }
  }
}

class GridStore {
  static from(...coords: Coord[]): GridStore {
    const store = new GridStore()
    for (let coord of coords) {
      store.set(coord.x, coord.y)
    }
    return store
  }

  #underlying: GridMap<null>
  constructor() {
    this.#underlying = new GridMap<null>()
  }
  
  set(x: number, y: number) {
    this.#underlying.set(x, y, null)
  }

  map(callback: (x: number, y: number) => [number, number]): GridStore {
    const newStore = new GridStore()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let [row, column, value] of this.#underlying) {
      const [newRow, newColumn] = callback(row, column)
      newStore.set(newRow, newColumn)
    }
    return newStore
  }

  mapValues<U>(callback: (x: number, y: number) => U): GridMap<U> {
    return this.#underlying.mapValues((x, y) => callback(x, y))
  }

  toCoords(): Coord[] {
    const array: Coord[] = []
    for (let [x, y] of this) {
      array.push({ x, y })
    }
    return array
  }

  *[Symbol.iterator](): Iterator<[number, number]> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (let [row, column, value] of this.#underlying) {
      yield [row, column]
    }
  }
}

export { GridStore }

export default GridMap