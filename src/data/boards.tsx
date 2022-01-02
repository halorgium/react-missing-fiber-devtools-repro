import { BoardData, BoardName } from '../types'
import debug from './boards/debug'
import fiveSquare from './boards/fiveSquare'

const boards = new Map<BoardName, BoardData>()
boards.set('debug', debug)
boards.set('fiveSquare', fiveSquare)

export default boards