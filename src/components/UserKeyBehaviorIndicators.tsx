'use client';

import { Plus, Minus, Trash2 } from 'lucide-react';
import { UserKeyBehaviorIndicator } from '@/types/activity';

interface UserKeyBehaviorIndicatorsProps {
  data: UserKeyBehaviorIndicator[];
}

export function UserKeyBehaviorIndicators({ data }: UserKeyBehaviorIndicatorsProps) {
  return (
    <section className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">用户关键行为指标</h2>
        <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
          <Plus className="w-4 h-4" />
          添加指标
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {data.map((indicator) => (
          <div
            key={indicator.indicatorId}
            className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm text-slate-600">{indicator.indicatorName}</span>
              <div className="flex items-center gap-1">
                {indicator.config.deletable && (
                  <button className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
                {indicator.config.editable && (
                  <button className="p-1 text-slate-400 hover:text-blue-500 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-slate-900">
                {indicator.value}
              </span>
              <span className="text-sm text-slate-500">{indicator.unit}</span>
              {indicator.change !== undefined && (
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ml-2 ${
                    indicator.change >= 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {indicator.change >= 0 ? '↑' : '↓'} {Math.abs(indicator.change)}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}