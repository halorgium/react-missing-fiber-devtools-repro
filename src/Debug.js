import { Rect, Text } from 'react-konva'

function Debug({ increment, counter, statusReport }) {
  return (
    <>
      <Rect width={100} height={40} fill='grey' onClick={increment} />
      <Text x={10} y={10} text={counter} />
      <Text y={50} fontFamily='Courier' text={statusReport} />
    </>
  )
}

export default Debug