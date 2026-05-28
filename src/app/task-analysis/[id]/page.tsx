import { Task } from '@/types/activity';
import { mockTasks } from '@/data/mockData';
import { ActivityEffectClient } from '@/app/activity-management/[id]/ActivityEffectClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return mockTasks.map((t) => ({ id: t.id }));
}

export default async function TaskAnalysisPage({ params }: PageProps) {
  const { id } = await params;
  const task = mockTasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">未找到该任务</p>
      </div>
    );
  }

  return <ActivityEffectClient item={task} isActivity={false} />;
}