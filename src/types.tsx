import { Key } from "react";
import GridMap, { GridStore } from "./GridMap";

export enum Rotation {
  Up = 0,
  Down,
  Left,
  Right,
}

export type GameName = string
export type PieceName = string
export type Fill = string
export type Positions = Map<PieceName, Position>
export type PiecePositions = Map<PieceName, PiecePosition>
export type BoardHits = GridMap<PieceName[]>

export interface BoardData {
  tiles: GridStore
  positions: Map<GameName, Positions>
}

export interface PieceData {
  tiles: GridStore
  fill: Fill
}

export interface PieceState extends PieceData {
  key?: Key | null | undefined
  size?: number
  x: number
  y: number
  moveable?: boolean
  moveToFront: () => void
  reportRotation: () => void
  reportPosition: (coord: Coord) => void
}

export interface Coord {
  x: number
  y: number
}

export interface Position extends Coord {
  r: Rotation
  moveable?: boolean
}

export interface PiecePosition extends Position {
  fill: Fill
  tiles: GridStore
  index: number
}