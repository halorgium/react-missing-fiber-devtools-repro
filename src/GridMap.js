class GridMap {
  #rows
  constructor() {
    this.#rows = new Map()
  }

  get(x, y) {
    const row = this.#rows.get(x)
    if (row !== null && row !== undefined) {
      return row.get(y)
    }
    return null
  }

  set(x, y, value) {
    let row = this.#rows.get(x)
    if (row === null || row === undefined) {
      row = new Map()
      this.#rows.set(x, row)
    }
    row.set(y, value)
  }

  map(callback) {
    const result = new GridMap()
    for (let [x, y, value] of this) {
      const [newX, newY, newValue] = callback(x, y, value)
      result.set(newX, newY, newValue)
    }
    return result
  }

  mapValues(callback) {
    return this.map((x, y, value) => [x, y, callback(x, y, value)])
  }

  values() {
    const result = []
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

export default GridMap