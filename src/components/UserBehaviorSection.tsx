'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { UserBehaviorAnalysis } from '@/types/activity';

interface UserBehaviorSectionProps {
  data: UserBehaviorAnalysis;
}

const TREND_COLORS = {
  positive: '#10b981',
  negative: '#ef4444',
  neutral: '#6b7280',
};

export function UserBehaviorSection({ data }: UserBehaviorSectionProps) {
  const chartData = data.behaviors.map((item) => ({
    name: item.behaviorName,
    value: item.count,
    ratio: item.ratio,
    trend: item.trend || 0,
  }));

  return (
    <section className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">用户行为分析</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>窗口期：</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">{data.timeWindow}</span>
          <span className="ml-4">参与用户：</span>
          <span className="font-medium text-slate-900">{data.totalUsers.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">用户行为分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
                <XAxis type="number" tickFormatter={(v) => v.toLocaleString()} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value: unknown) => Number(value).toLocaleString()}
                  labelFormatter={(label) => `行为: ${label}`}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.trend >= 0 ? '#3b5bdb' : '#ef4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">行为明细</h3>
          <div className="space-y-3">
            {data.behaviors.map((item) => (
              <div
                key={item.behaviorName}
                className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-700">{item.behaviorName}</span>
                  {item.trend !== undefined && item.trend !== 0 && (
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        item.trend > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.trend > 0 ? '↑' : '↓'} {Math.abs(item.trend)}%
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-slate-900">
                    {item.count.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-500 w-16 text-right">
                    {item.ratio}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}