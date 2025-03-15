import { useParams } from 'react-router'

export default function Stock() {
  const { symbol } = useParams()

  return <div>Stock {symbol}</div>
}
