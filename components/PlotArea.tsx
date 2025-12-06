import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { ChartDataPoint } from '../types';

interface PlotAreaProps {
  data: ChartDataPoint[];
  label: string;
}

const PlotArea: React.FC<PlotAreaProps> = ({ data, label }) => {
  if (!data || data.length === 0) return null;

  // Calculate domain to center the graph nicely if possible, or use auto
  const minX = Math.min(...data.map(d => d.x));
  const maxX = Math.max(...data.map(d => d.x));

  return (
    <div className="w-full h-72 bg-white rounded-lg p-4 shadow-sm border border-slate-200 mt-4" dir="ltr">
      <h3 className="text-center text-slate-600 font-mono mb-2 text-sm">{label}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[minX, maxX]} 
            tickFormatter={(value) => value.toFixed(1)}
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis 
            stroke="#64748b"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [value.toFixed(3), 'f(x)']}
            labelFormatter={(label) => `x: ${Number(label).toFixed(3)}`}
          />
          <ReferenceLine y={0} stroke="#94a3b8" />
          <ReferenceLine x={0} stroke="#94a3b8" />
          <Line 
            type="monotone" 
            dataKey="y" 
            stroke="#0d9488" 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlotArea;