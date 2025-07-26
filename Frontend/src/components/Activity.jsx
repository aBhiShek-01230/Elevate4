import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { ArrowUpRight } from 'lucide-react'

const data = [
  { day: 'Mo', hours: 3, color: '#3B82F6' },
  { day: 'Tu', hours: 7, color: '#F97316' },
  { day: 'We', hours: 5, color: '#22C55E' },
  { day: 'Th', hours: 3, color: '#F97316' },
  { day: 'Fr', hours: 2, color: '#EF4444' },
  { day: 'Sa', hours: 3, color: '#3B82F6' },
  { day: 'Su', hours: 0.5, color: '#EF4444' },
]

const Activity = () => {
  return (
    <div className="bg-white rounded-2xl p-5  w-full md:w-[500px] shadow-md hover:shadow-2xl mx-3 mt-4">
      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="font-semibold text-lg">Hours Activity</h2>
          <div className="flex items-center gap-1 mt-1">
            <div className="bg-green-100 p-1 rounded-md">
              <ArrowUpRight size={14} className="text-green-500" />
            </div>
            <p className="text-green-600 text-sm font-medium">+3%</p>
            <p className="text-sm text-gray-500">Increase Than Last Week</p>
          </div>
        </div>
        <div className="border rounded-md px-2 py-1 text-sm text-black flex items-center gap-1">
          <select name="" id="" className="outline-0">
            <option value="">Weekly</option>
            <option value="">Monthly</option>
          </select>
          
        </div>
      </div>

      <div className="h-60 w-full mt-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `${value}h`} domain={[0, 8]} ticks={[ 2, 4, 6, 8,10,12]} />
            <Tooltip formatter={(value) => `${value} hours`} />
            <Bar dataKey="hours" radius={[4, 4, 0, 0]} fill="#8884d8">
              {data.map((entry, index) => (
                <cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Activity
