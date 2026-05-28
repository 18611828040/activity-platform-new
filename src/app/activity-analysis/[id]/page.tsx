import { Activity } from '@/types/activity';
import { mockActivities } from '@/data/mockData';
import { ActivityEffectClient } from '@/app/activity-management/[id]/ActivityEffectClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return mockActivities.map((a) => ({ id: a.id }));
}

export default async function ActivityAnalysisPage({ params }: PageProps) {
  const { id } = await params;
  const activity = mockActivities.find((a) => a.id === id);

  if (!activity) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">未找到该活动</p>
      </div>
    );
  }

  return <ActivityEffectClient item={activity} isActivity={true} />;
}