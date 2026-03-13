import React from 'react';

function BarChart({ data, height = 400, barWidth = 40, barColor = '#3b82f6' }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No data available</p>
      </div>
    );
  }

  // Calculate chart dimensions
  const maxSalary = Math.max(...data.map(d => d.amount));
  const chartHeight = height;
  const chartWidth = data.length * (barWidth + 10) + 100; // Extra space for labels
  const padding = 40;

  return (
    <div className="overflow-x-auto">
      <svg width={chartWidth} height={chartHeight + padding * 2} className="w-full">
        {/* Chart background */}
        <rect x={0} y={0} width={chartWidth} height={chartHeight + padding * 2} fill="#f9fafb" />
        
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <g key={percent}>
            <line
              x1={padding}
              y1={padding + (chartHeight * (1 - percent / 100))}
              x2={chartWidth - padding}
              y2={padding + (chartHeight * (1 - percent / 100))}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
            <text
              x={padding - 10}
              y={padding + (chartHeight * (1 - percent / 100)) + 5}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              ${percent}%
            </text>
          </g>
        ))}
        
        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (item.amount / maxSalary) * chartHeight;
          const x = padding + index * (barWidth + 10);
          const y = padding + chartHeight - barHeight;
          
          return (
            <g key={item.city}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={barColor}
                className="transition-all duration-300 hover:opacity-80"
              />
              
              {/* Value on top of bar */}
              <text
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize="12"
                fill="#374151"
                fontWeight="600"
              >
                ${item.amount.toLocaleString()}
              </text>
              
              {/* City label */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + padding + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {item.city}
              </text>
              
              {/* Employee count */}
              <text
                x={x + barWidth / 2}
                y={chartHeight + padding + 35}
                textAnchor="middle"
                fontSize="10"
                fill="#9ca3af"
              >
                ({item.count})
              </text>
            </g>
          );
        })}
        
        {/* X-axis line */}
        <line
          x1={padding}
          y1={chartHeight + padding}
          x2={chartWidth - padding}
          y2={chartHeight + padding}
          stroke="#374151"
          strokeWidth="2"
        />
        
        {/* Y-axis line */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={chartHeight + padding}
          stroke="#374151"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

export default BarChart;
