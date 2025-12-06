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
  isDarkMode?: boolean;
}

const PlotArea: React.FC<PlotAreaProps> = ({ data, label, isDarkMode = false }) => {
  if (!data || data.length === 0) return null;

  // Calculate domain to center the graph nicely if possible, or use auto
  const minX = Math.min(...data.map(d => d.x));
  const maxX = Math.max(...data.map(d => d.x));

  // Determine colors based on mode
  const axisColor = isDarkMode ? '#94a3b8' : '#64748b'; // slate-400 : slate-500
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0'; // slate-700 : slate-200
  const referenceLineColor = isDarkMode ? '#475569' : '#94a3b8'; // slate-600 : slate-400
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';
  const tooltipText = isDarkMode ? '#e2e8f0' : '#1e293b';

  return (
    <div className="w-full h-72 bg-white dark:bg-slate-900 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700 mt-4 transition-colors" dir="ltr">
      <h3 className="text-center text-slate-600 dark:text-slate-400 font-mono mb-2 text-sm">{label}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis 
            dataKey="x" 
            type="number" 
            domain={[minX, maxX]} 
            tickFormatter={(value) => value.toFixed(1)}
            stroke={axisColor}
            fontSize={12}
            tick={{ fill: axisColor }}
          />
          <YAxis 
            stroke={axisColor}
            fontSize={12}
            tick={{ fill: axisColor }}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              backgroundColor: tooltipBg,
              color: tooltipText
            }}
            itemStyle={{ color: tooltipText }}
            formatter={(value: number) => [value.toFixed(3), 'f(x)']}
            labelFormatter={(label) => `x: ${Number(label).toFixed(3)}`}
          />
          <ReferenceLine y={0} stroke={referenceLineColor} />
          <ReferenceLine x={0} stroke={referenceLineColor} />
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