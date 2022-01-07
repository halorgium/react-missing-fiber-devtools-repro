export interface WindowEvent {
  target: { value: string }
}

export enum Rotation {
  Up = 0,
  Down,
  Left,
  Right,
}

export type BoardName = string
export type GameName = string
export type PieceName = string
export type Fill = string
export type Positions = Map<PieceName, Position>

export interface Coord {
  x: number
  y: number
}

export interface Position extends Coord {
  r: Rotation
  moveable?: boolean
}