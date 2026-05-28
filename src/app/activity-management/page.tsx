'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, Task, UnifiedListItem, ActivityStatus } from '@/types/activity';
import { mockActivities, mockTasks } from '@/data/mockData';
import { AddActivityModal, AddTaskModal } from '@/components/AddModals';

type FilterTabType = 'all' | ActivityStatus;

export default function ActivityManagementPage() {
  const [activeListType, setActiveListType] = useState<'all' | 'activity' | 'task'>('all');
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Filter states
  const [filterId, setFilterId] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterLandingPageCode, setFilterLandingPageCode] = useState('');
  const [filterPageCode, setFilterPageCode] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const getStatusBadge = (status: ActivityStatus) => {
    const statusMap: Record<ActivityStatus, { label: string; className: string }> = {
      pending: { label: '未开始', className: 'bg-yellow-100 text-yellow-700' },
      running: { label: '进行中', className: 'bg-green-100 text-green-700' },
      ended: { label: '已结束', className: 'bg-gray-100 text-gray-500' },
    };
    const config = statusMap[status] || statusMap.pending;
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  const unifiedList: UnifiedListItem[] = [
    ...activities.map((a) => ({
      id: a.id,
      type: 'activity' as const,
      name: a.name,
      status: a.status,
      startDate: a.startDate,
      endDate: a.endDate,
      creator: a.creator,
      landingPageCode: a.landingPageCode,
      pageCode: a.pageCode,
      aggregationStartDate: a.aggregationStartDate,
      indicators: a.indicators,
      createdAt: a.createdAt,
      updatedAt: a.updatedAt,
    })),
    ...tasks.map((t) => ({
      id: t.id,
      type: 'task' as const,
      name: t.name,
      status: t.status as ActivityStatus,
      startDate: t.createdAt,
      endDate: t.createdAt,
      creator: undefined,
      relatedActivityName: t.activityName,
      activityId: t.activityId,
      createdAt: t.createdAt,
      updatedAt: t.createdAt,
    })),
  ];

  const filteredList = unifiedList.filter((item) => {
    // Type filter (全部/活动/任务)
    if (activeListType === 'activity' && item.type !== 'activity') return false;
    if (activeListType === 'task' && item.type !== 'task') return false;
    // Search filters
    if (filterId && !item.id.toLowerCase().includes(filterId.toLowerCase())) return false;
    if (filterName && !item.name.toLowerCase().includes(filterName.toLowerCase())) return false;
    if (filterLandingPageCode && !(item.landingPageCode || '').toLowerCase().includes(filterLandingPageCode.toLowerCase())) return false;
    if (filterPageCode && !(item.pageCode || '').toLowerCase().includes(filterPageCode.toLowerCase())) return false;
    if (filterStartDate && !item.startDate.includes(filterStartDate)) return false;
    if (filterEndDate && !item.endDate.includes(filterEndDate)) return false;
    if (filterStatus) {
      const statusMatch = filterStatus === '未开始' ? item.status === 'pending' :
        filterStatus === '进行中' ? item.status === 'running' :
        filterStatus === '已结束' ? item.status === 'ended' : false;
      if (!statusMatch) return false;
    }
    return true;
  });

  const handleAddActivity = (activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: `ACT${String(activities.length + 1).padStart(3, '0')}`,
    };
    setActivities([newActivity, ...activities]);
  };

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `T${String(tasks.length + 1).padStart(3, '0')}`,
    };
    setTasks([newTask, ...tasks]);
  };

  const clearFilters = () => {
    setFilterId('');
    setFilterName('');
    setFilterLandingPageCode('');
    setFilterPageCode('');
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterStatus('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Main Tabs */}
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveListType('all')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeListType === 'all'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setActiveListType('activity')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeListType === 'activity'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            活动列表
          </button>
          <button
            onClick={() => setActiveListType('task')}
            className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
              activeListType === 'task'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            任务列表
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">活动ID:</label>
            <input
              type="text"
              value={filterId}
              onChange={(e) => setFilterId(e.target.value)}
              placeholder="请输入"
              className="w-24 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">类型:</label>
            <select
              value={activeListType === 'all' ? '' : activeListType}
              onChange={(e) => setActiveListType(e.target.value as 'all' | 'activity' | 'task')}
              className="w-20 px-2 py-1 border border-slate-300 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">全部</option>
              <option value="activity">活动</option>
              <option value="task">任务</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">名称:</label>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="请输入"
              className="w-24 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">落地页编码:</label>
            <input
              type="text"
              value={filterLandingPageCode}
              onChange={(e) => setFilterLandingPageCode(e.target.value)}
              placeholder="请输入"
              className="w-24 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">页面编码集合:</label>
            <input
              type="text"
              value={filterPageCode}
              onChange={(e) => setFilterPageCode(e.target.value)}
              placeholder="请输入"
              className="w-24 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">开始日期:</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-28 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">截止日期:</label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-28 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 whitespace-nowrap">状态:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-20 px-2 py-1 border border-slate-300 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">全部</option>
              <option value="未开始">未开始</option>
              <option value="进行中">进行中</option>
              <option value="已结束">已结束</option>
            </select>
          </div>

          <button
            onClick={() => {}}
            className="px-3 py-1 text-sm text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700"
          >
            查询
          </button>

          <button
            onClick={clearFilters}
            className="px-3 py-1 text-sm text-slate-500 hover:text-slate-700 border border-slate-300 rounded hover:bg-slate-100"
          >
            重置
          </button>

          <button
            onClick={() => setShowAddActivityModal(true)}
            className="ml-auto px-3 py-1 text-sm text-white bg-blue-600 border border-blue-600 rounded hover:bg-blue-700"
          >
            新增
          </button>
        </div>
      </div>

      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[1200px]">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">类型</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">活动ID</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">名称</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">落地页编码</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">页面编码集合</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">开始日期</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">截止日期</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">状态</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">创建人</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">创建时间</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">更新时间</th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-3 py-6 text-center text-slate-500">暂无数据</td>
              </tr>
            ) : (
              filteredList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5">
                    <span className={`px-1.5 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                      item.type === 'activity'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {item.type === 'activity' ? '活动' : '任务'}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-slate-700 font-mono text-xs whitespace-nowrap">{item.id}</td>
                  <td className="px-3 py-2.5 text-slate-700 max-w-[150px] truncate">{item.name}</td>
                  <td className="px-3 py-2.5 text-slate-500 font-mono text-xs whitespace-nowrap">{item.landingPageCode || '-'}</td>
                  <td className="px-3 py-2.5 text-slate-500 font-mono text-xs whitespace-nowrap">{item.pageCode || '-'}</td>
                  <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{item.startDate}</td>
                  <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{item.endDate}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{getStatusBadge(item.status)}</td>
                  <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{item.creator || '-'}</td>
                  <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{item.createdAt.substring(0, 10)}</td>
                  <td className="px-3 py-2.5 text-slate-500 whitespace-nowrap">{item.updatedAt?.substring(0, 10) || '-'}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <Link
                      href={item.type === 'activity' ? `/activity-analysis/${item.id}` : `/task-analysis/${item.id}`}
                      className="px-2 py-1 border border-blue-600 text-blue-600 rounded text-xs font-medium hover:bg-blue-50 whitespace-nowrap"
                    >
                      查看
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddActivityModal
        isOpen={showAddActivityModal}
        onClose={() => setShowAddActivityModal(false)}
        onAdd={handleAddActivity}
      />
      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        onAdd={handleAddTask}
        activities={activities}
      />
    </div>
  );
}