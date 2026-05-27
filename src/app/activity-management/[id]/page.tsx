import { ActivityEffectClient } from './ActivityEffectClient';
import { mockActivities, mockTasks } from '@/data/mockData';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  const activityIds = mockActivities.map((a) => a.id);
  const taskIds = mockTasks.map((t) => t.id);
  return [...activityIds, ...taskIds].map((id) => ({ id }));
}

export default async function ActivityEffectPage({ params }: PageProps) {
  const { id } = await params;
  const activity = mockActivities.find((a) => a.id === id);
  const task = mockTasks.find((t) => t.id === id);
  const item = activity || task;

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">未找到该活动或任务</p>
      </div>
    );
  }

  return <ActivityEffectClient item={item} isActivity={!!activity} />;
}