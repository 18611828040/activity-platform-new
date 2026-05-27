'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, Task } from '@/types/activity';
import { mockActivityEffectData } from '@/data/mockData';

interface Props {
  item: Activity | Task;
  isActivity: boolean;
}

export function ActivityEffectClient({ item, isActivity }: Props) {
  const [dateRange, setDateRange] = useState('7天');
  const effectData = mockActivityEffectData;

  const maxExposure = Math.max(...effectData.dailyData.map((d) => d.exposureCount));
  const maxClick = Math.max(...effectData.dailyData.map((d) => d.clickCount));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-4 flex items-center gap-4">
          <Link
            href="/activity-management"
            className="text-slate-500 hover:text-slate-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-semibold text-slate-800">
            {isActivity ? '活动效果' : '任务效果'}
          </h1>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Info Card */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{item.name}</h2>
              {'startDate' in item && (
                <p className="text-sm text-slate-500 mt-1">
                  {item.startDate} 至 {item.endDate}
                </p>
              )}
              {'activityName' in item && (
                <p className="text-sm text-slate-500 mt-1">
                  关联活动：{item.activityName}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {['7天', '14天', '30天'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    dateRange === range
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-slate-500 mb-1">曝光人数</p>
            <p className="text-2xl font-semibold text-slate-800">
              {effectData.exposureCount.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-slate-500 mb-1">点击人数</p>
            <p className="text-2xl font-semibold text-slate-800">
              {effectData.clickCount.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-slate-500 mb-1">转化人数</p>
            <p className="text-2xl font-semibold text-slate-800">
              {effectData.conversionCount.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-slate-500 mb-1">转化率</p>
            <p className="text-2xl font-semibold text-slate-800">
              {effectData.conversionRate}%
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">趋势图</h3>
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-slate-600">曝光人数</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-sm text-slate-600">点击人数</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {effectData.dailyData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center gap-1 h-48">
                  <div
                    className="w-6 bg-blue-500 rounded-t"
                    style={{
                      height: `${(day.exposureCount / maxExposure) * 100}%`,
                      minHeight: '4px',
                    }}
                  />
                  <div
                    className="w-6 bg-emerald-500 rounded-t"
                    style={{
                      height: `${(day.clickCount / maxClick) * 100}%`,
                      minHeight: '4px',
                    }}
                  />
                </div>
                <span className="text-xs text-slate-500">{day.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-medium text-slate-700">每日数据</h3>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">日期</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">曝光人数</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">点击人数</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">转化人数</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">转化率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {effectData.dailyData.map((day, index) => (
                <tr key={index} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm text-slate-800">{day.date}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 text-right">
                    {day.exposureCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 text-right">
                    {day.clickCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 text-right">
                    {day.conversionCount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 text-right">
                    {((day.conversionCount / day.exposureCount) * 100).toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}