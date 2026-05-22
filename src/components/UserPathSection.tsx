'use client';

import { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { UserPathAnalysis, PathNode } from '@/types/activity';

interface UserPathSectionProps {
  data: UserPathAnalysis;
}

type CustomerType = 'reach' | 'intention' | 'activated';

const CUSTOMER_CONFIG = {
  reach: { label: '触达客户', color: '#3b5bdb' },
  intention: { label: '意向客户', color: '#10b981' },
  activated: { label: '激活客户', color: '#8b5cf6' },
};

function PathFunnel({ nodes, color, label }: { nodes: PathNode[]; color: string; label: string }) {
  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </h4>
      <div className="space-y-2">
        {nodes.map((node, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-600">{node.nodeName}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-900">
                  {node.count.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 w-12 text-right">
                  {node.ratio}%
                </span>
              </div>
            </div>
            <div className="h-5 bg-slate-100 rounded overflow-hidden">
              <div
                className="h-full transition-all"
                style={{ width: `${node.ratio}%`, backgroundColor: color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UserPathSection({ data }: UserPathSectionProps) {
  const [activeTab, setActiveTab] = useState<CustomerType>('reach');

  const getPathData = () => {
    switch (activeTab) {
      case 'reach':
        return data.reachCustomerPath;
      case 'intention':
        return data.intentionCustomerPath;
      case 'activated':
        return data.activatedCustomerPath;
    }
  };

  const chartData = getPathData().map((node) => ({
    name: node.nodeName,
    value: node.count,
    ratio: node.ratio,
  }));

  const reachChartData = data.reachCustomerPath.map((n) => ({ name: n.nodeName, value: n.count }));
  const intentionChartData = data.intentionCustomerPath.map((n) => ({ name: n.nodeName, value: n.count }));
  const activatedChartData = data.activatedCustomerPath.map((n) => ({ name: n.nodeName, value: n.count }));

  return (
    <section className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">用户路径分析</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span>窗口期：</span>
          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">{data.timeWindow}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex rounded-lg border border-slate-300 overflow-hidden w-fit">
          {(['reach', 'intention', 'activated'] as CustomerType[]).map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === type
                  ? 'text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
              style={activeTab === type ? { backgroundColor: CUSTOMER_CONFIG[type].color } : {}}
            >
              {CUSTOMER_CONFIG[type].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">
            {CUSTOMER_CONFIG[activeTab].label}路径漏斗
          </h3>
          {activeTab === 'reach' && (
            <PathFunnel
              nodes={data.reachCustomerPath}
              color={CUSTOMER_CONFIG.reach.color}
              label={CUSTOMER_CONFIG.reach.label}
            />
          )}
          {activeTab === 'intention' && (
            <PathFunnel
              nodes={data.intentionCustomerPath}
              color={CUSTOMER_CONFIG.intention.color}
              label={CUSTOMER_CONFIG.intention.label}
            />
          )}
          {activeTab === 'activated' && (
            <PathFunnel
              nodes={data.activatedCustomerPath}
              color={CUSTOMER_CONFIG.activated.color}
              label={CUSTOMER_CONFIG.activated.label}
            />
          )}
        </div>

        <div className="border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">路径趋势图</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" />
                <YAxis tickFormatter={(v) => v.toLocaleString()} tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value: unknown) => Number(value).toLocaleString()}
                  labelFormatter={(label) => `节点: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={CUSTOMER_CONFIG[activeTab].color}
                  strokeWidth={2}
                  dot={{ fill: CUSTOMER_CONFIG[activeTab].color, r: 4 }}
                  name="用户数"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium text-slate-700 mb-3">三类型客户路径对比</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" />
              <YAxis tickFormatter={(v) => v.toLocaleString()} tick={{ fontSize: 10 }} />
              <Tooltip
                formatter={(value: unknown) => Number(value).toLocaleString()}
                labelFormatter={(label) => `节点: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                data={reachChartData}
                dataKey="value"
                stroke={CUSTOMER_CONFIG.reach.color}
                strokeWidth={2}
                dot={{ fill: CUSTOMER_CONFIG.reach.color, r: 3 }}
                name="触达客户"
              />
              <Line
                type="monotone"
                data={intentionChartData}
                dataKey="value"
                stroke={CUSTOMER_CONFIG.intention.color}
                strokeWidth={2}
                dot={{ fill: CUSTOMER_CONFIG.intention.color, r: 3 }}
                name="意向客户"
              />
              <Line
                type="monotone"
                data={activatedChartData}
                dataKey="value"
                stroke={CUSTOMER_CONFIG.activated.color}
                strokeWidth={2}
                dot={{ fill: CUSTOMER_CONFIG.activated.color, r: 3 }}
                name="激活客户"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}