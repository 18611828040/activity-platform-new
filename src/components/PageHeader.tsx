'use client';

import { ArrowLeft, Calendar } from 'lucide-react';
import { ActivityAnalyticsResponse } from '@/types/activity';

interface PageHeaderProps {
  data: ActivityAnalyticsResponse;
}

export function PageHeader({ data }: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-semibold text-slate-900">{data.activityName}</h1>
        </div>

        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-700">
              {data.activityStartDate} ~ {data.activityEndDate}
            </span>
          </button>

          <div className="text-sm text-slate-500">
            数据更新时间：{data.dataUpdateTime}
          </div>
        </div>
      </div>
    </div>
  );
}