import { PieceName, Position, Positions } from '../../types'

export function parsePositions(input: string): Positions {
  const result = new Map<PieceName, Position>()
  for (let line of input.split("\n")) {
    if (line === '') {
      continue
    }

    console.log(line)
    const found = line.match(/^(?<piece>\w+) +@ (?<x>\d+), (?<y>\d+) \((?<r>\d+)\)$/)
    console.log(found)
    if (found === null) {
      throw new Error(`line '${line}' does not match`)
    }

    if (found.groups === undefined) {
      throw new Error('match does not have groups')
    }

    const position = {
      x: Number.parseInt(found.groups['x']),
      y: Number.parseInt(found.groups['y']),
      r: Number.parseInt(found.groups['r']),
    }

    result.set(found.groups['piece'], position)
  }

  return result
}
