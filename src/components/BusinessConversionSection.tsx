'use client';

import { HelpCircle } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { TaskAnalyticsData } from '@/types/activity';

interface BusinessConversionSectionProps {
  data: TaskAnalyticsData;
}

const CARD_CONFIG = [
  { key: 'activatedCustomerCount', label: '激活客户数', unit: '客户号' },
  { key: 'activatedThousandHouseholds', label: '激活千元户数', unit: '户' },
  { key: 'netNewAssetAmount', label: '净新增资产数', unit: '元' },
  { key: 'netRevenue', label: '净创收', unit: '元' },
  { key: 'newProductSalesAmount', label: '新增产品销售额', unit: '元' },
];

function formatCurrency(value: number): string {
  if (value >= 100000000) {
    return (value / 100000000).toFixed(2) + '亿';
  } else if (value >= 10000) {
    return (value / 10000).toFixed(0) + '万';
  }
  return value.toLocaleString();
}

export function BusinessConversionSection({ data }: BusinessConversionSectionProps) {
  return (
    <section className="bg-white rounded-lg border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">业务转化分析</h2>

      <div className="grid grid-cols-5 gap-4 mb-6">
        {CARD_CONFIG.map((config) => (
          <MetricCard
            key={config.key}
            label={config.label}
            value={formatCurrency(data[config.key as keyof TaskAnalyticsData] as number)}
            unit={config.unit}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1 border border-slate-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-slate-700">激活条件</span>
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                完成激活行为（如购买产品/入金）的客户数
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
            {data.activationCondition}
          </p>
        </div>

        <div className="col-span-2 border border-slate-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-slate-700 mb-4">转化漏斗图</h3>
          <div className="space-y-3">
            {data.conversionFunnel.map((item, index) => (
              <div key={item.stage}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-600">{item.stage}</span>
                  <span className="text-sm font-medium text-slate-900">
                    {item.count.toLocaleString()}
                    {index > 0 && (
                      <span className="text-green-600 ml-2">
                        {item.conversionRate}%
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-6 bg-slate-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all"
                    style={{ width: `${item.conversionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <span className="font-medium">⚠ 口径说明：</span>
          活动UV按设备号统计，任务侧指标按客户号统计，两者口径不同，不可直接对比。意向客户数包含外呼系统有意向客户和推送点击链接客户的并集。
        </p>
      </div>
    </section>
  );
}