'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { PageAnalyticsSection } from '@/components/PageAnalyticsSection';
import { PushAnalyticsSection } from '@/components/PushAnalyticsSection';
import { UserBehaviorSection } from '@/components/UserBehaviorSection';
import { UserPathSection } from '@/components/UserPathSection';
import { UserKeyBehaviorIndicators } from '@/components/UserKeyBehaviorIndicators';
import { BusinessConversionSection } from '@/components/BusinessConversionSection';
import { DataTableSection } from '@/components/DataTableSection';
import { mockData } from '@/data/mockData';
import { ViewMode } from '@/types/activity';

export default function ActivityAnalyticsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('activity');

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader data={mockData} />

      <div className="px-6 pt-4">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm font-medium text-slate-600">查看模式：</span>
          <div className="flex rounded-lg border border-slate-300 overflow-hidden">
            <button
              onClick={() => setViewMode('activity')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'activity'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              活动分析
            </button>
            <button
              onClick={() => setViewMode('task')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'task'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              任务分析
            </button>
          </div>
        </div>
      </div>

      <main className="p-6 space-y-6">
        {viewMode === 'activity' && (
          <>
            <PageAnalyticsSection data={mockData.pageAnalytics} />
            <PushAnalyticsSection data={mockData.taskAnalytics.currentData} />
            {mockData.taskAnalytics.currentData.userBehaviorAnalysis && (
              <UserBehaviorSection
                data={mockData.taskAnalytics.currentData.userBehaviorAnalysis}
              />
            )}
          </>
        )}

        {viewMode === 'task' && (
          <>
            <BusinessConversionSection data={mockData.taskAnalytics.currentData} />
            {mockData.taskAnalytics.currentData.userPathAnalysis && (
              <UserPathSection
                data={mockData.taskAnalytics.currentData.userPathAnalysis}
              />
            )}
            <PushAnalyticsSection data={mockData.taskAnalytics.currentData} />
            {mockData.taskAnalytics.userKeyBehaviorIndicators &&
              mockData.taskAnalytics.userKeyBehaviorIndicators.length > 0 && (
                <UserKeyBehaviorIndicators
                  data={mockData.taskAnalytics.userKeyBehaviorIndicators}
                />
              )}
          </>
        )}

        <DataTableSection data={mockData.dailyDetails} viewMode={viewMode} />
      </main>
    </div>
  );
}