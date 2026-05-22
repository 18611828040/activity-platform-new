'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { MetricCard } from './MetricCard';
import { TaskAnalyticsData } from '@/types/activity';

interface PushAnalyticsSectionProps {
  data: TaskAnalyticsData;
}

const CHANNEL_COLORS = ['#3b5bdb', '#5c7cfa', '#748ffc', '#91a7ff', '#bac8ff'];

const CARD_CONFIG = [
  { key: 'reachCustomerCount', label: '触达客户数', unit: '客户号', tooltip: '推送触达的客户数，去重' },
  { key: 'clickLinkCount', label: '点击链接数', unit: '客户号', tooltip: '通过短链点击的客户数' },
  { key: 'pushSuccessCount', label: '推送成功数', unit: '次数', tooltip: '各渠道推送成功送达数' },
  { key: 'pushFailCount', label: '推送失败数', unit: '次数', tooltip: '各渠道推送失败数' },
];

export function PushAnalyticsSection({ data }: PushAnalyticsSectionProps) {
  return (
    <section className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">推送触达分析</h2>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {CARD_CONFIG.map((config) => (
          <MetricCard
            key={config.key}
            label={config.label}
            value={data[config.key as keyof TaskAnalyticsData] as number}
            unit={config.unit}
            tooltip={config.tooltip}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">渠道引流占比</h3>
          <div className="flex items-center">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.channelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="customerCount"
                    nameKey="channelName"
                  >
                    {data.channelDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: unknown) => Number(value).toLocaleString()}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {data.channelDistribution.map((item, index) => (
                <div key={item.channelName} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: CHANNEL_COLORS[index % CHANNEL_COLORS.length] }}
                    />
                    <span className="text-slate-600">{item.channelName}</span>
                    {!item.hasReceipt && (
                      <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                        无回执
                      </span>
                    )}
                  </div>
                  <span className="text-slate-900 font-medium">{item.customerCount.toLocaleString()}</span>
                  <span className="text-slate-500 w-12 text-right">{item.ratio}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">推送链路漏斗</h3>
          <div className="space-y-4">
            {data.pushFunnel.map((item, index) => (
              <div key={item.stage} className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600">{item.stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {item.count.toLocaleString()}
                      </span>
                      {item.noReceipt && (
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
                          无回执
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-8 bg-slate-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                      style={{ width: `${item.conversionRate}%` }}
                    />
                  </div>
                </div>
                {index < data.pushFunnel.length - 1 && (
                  <div className="text-xs text-green-600 w-16 text-right">
                    ↓ {item.conversionRate}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}