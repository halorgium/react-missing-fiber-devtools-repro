import { Rect, Text } from 'react-konva'

interface DebugProps {
  increment: () => void
  counter: number
  statusReport: string
}

function Debug({ increment, counter, statusReport }: DebugProps): JSX.Element {
  return (
    <>
      <Rect width={100} height={40} fill='grey' onClick={increment} />
      <Text x={10} y={10} text={counter.toString()} />
      <Text y={50} fontFamily='Courier' text={statusReport} />
    </>
  )
}

export default Debug