'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { MetricCard } from './MetricCard';
import { PageAnalytics } from '@/types/activity';

interface PageAnalyticsSectionProps {
  data: PageAnalytics;
}

const CHART_COLORS = ['#3b5bdb', '#5c7cfa', '#748ffc', '#91a7ff', '#bac8ff'];

const CARD_CONFIG = [
  { key: 'activityPagePV', label: '活动页PV', unit: '次', tooltip: '多会场PV汇总' },
  { key: 'activityPageUV', label: '活动页UV', unit: '设备号', tooltip: '多会场UV集合去重' },
  { key: 'targetUserCount', label: '目标用户数', unit: '设备号', tooltip: 'CAMS目标看板填写的设备号数' },
  { key: 'participateUserCount', label: '参与用户数', unit: '设备号', tooltip: '完成/参与某事件（由业务定义）' },
  { key: 'targetCompletionRate', label: '目标完成率', unit: '%', tooltip: 'UV / 目标用户数 × 100%' },
  { key: 'activityProgress', label: '活动进度', unit: '%', tooltip: '(当前日期-开始日) / (结束日-开始日)' },
];

export function PageAnalyticsSection({ data }: PageAnalyticsSectionProps) {
  return (
    <section className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">页面展示分析</h2>

      <div className="grid grid-cols-6 gap-4 mb-6">
        {CARD_CONFIG.map((config) => (
          <MetricCard
            key={config.key}
            label={config.label}
            value={data[config.key as keyof PageAnalytics] as number}
            unit={config.unit}
            tooltip={config.tooltip}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">页面漏斗图</h3>
          <div className="space-y-3">
            {data.pageFunnel.map((item, index) => (
              <div key={item.pageTag}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">{item.pageName}</span>
                  <span className="text-sm font-medium text-slate-900">
                    {item.pv.toLocaleString()} PV
                    {index > 0 && (
                      <span className="text-green-600 ml-2">
                        ↑{data.pageFunnel[index - 1].pv > 0
                          ? ((item.pv / data.pageFunnel[index - 1].pv) * 100).toFixed(1)
                          : 0}%
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-6 bg-slate-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                    style={{ width: `${item.conversionRate}%` }}
                  />
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {item.uv.toLocaleString()} UV | 转化率 {item.conversionRate}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">PV来源占比</h3>
          <div className="flex items-center">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.pvSourceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="pv"
                    nameKey="sourceName"
                  >
                    {data.pvSourceDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: unknown) => Number(value).toLocaleString()}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {data.pvSourceDistribution.map((item, index) => (
                <div key={item.sourceName} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    <span className="text-slate-600">{item.sourceName}</span>
                  </div>
                  <span className="text-slate-900 font-medium">{item.pv.toLocaleString()}</span>
                  <span className="text-slate-500 w-12 text-right">{item.ratio}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}