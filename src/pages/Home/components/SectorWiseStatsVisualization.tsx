import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

import { Card, CardHeader, CardContent } from '../../../components/ui/base'

import data from '../../../data/sector-wise-movement.json'

export default function SectorWiseStatsVisualization() {
  return (
    <Card>
      <CardHeader title='Sector Wise Stats Visualization' />
      <CardContent>
        <ResponsiveContainer width='100%' height={400}>
          <BarChart data={data} margin={{ left: -24 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='name'
              textAnchor='end'
              angle={-45}
              height={120}
              style={{ fontSize: '12px', overflow: 'hidden' }}
            />
            <YAxis dataKey='changePercent' style={{ fontSize: '12px', overflow: 'hidden' }} />
            <Tooltip cursor={{ fill: 'transparent' }} formatter={value => `${value}%`} />
            <ReferenceLine y={0} stroke='#000' />
            <Bar dataKey='changePercent' name='Change' maxBarSize={24}>
              {data.map(entry => (
                <Cell key={entry.name} fill={entry.changePercent > 0 ? 'green' : 'red'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
