'use client';

import { useState, useEffect } from 'react';
import { Activity, ActivityIndicator, ActivityStatus, IndicatorType, IndicatorField, Task } from '@/types/activity';

interface AddActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (activity: Omit<Activity, 'id'>) => void;
}

// Mock data for dropdowns
const mockLandingPageCodes = [
  { code: 'LP6182024', name: '618理财狂欢节落地页' },
  { code: 'LPNEW2024', name: '新手专享活动落地页' },
  { code: 'LPFD2024', name: '父亲节特惠落地页' },
  { code: 'LPSUM2024', name: '暑期嘉年华落地页' },
  { code: 'LPVIP2024', name: 'VIP会员专享落地页' },
];

const mockPageCodes = [
  { code: 'PG618001', name: '618活动主页面' },
  { code: 'PG618002', name: '618活动详情页' },
  { code: 'PGNEW001', name: '新手活动主页面' },
  { code: 'PGNEW002', name: '新手活动详情页' },
  { code: 'PGFD001', name: '父亲节活动页面' },
  { code: 'PGSUM001', name: '暑期嘉年华主页面' },
];

// Mock related tasks
const mockRelatedTasks = [
  { id: 'task1', name: '任务1 - 618推广' },
  { id: 'task2', name: '任务2 - 新客引流' },
  { id: 'task3', name: '任务3 - 节日活动' },
];

// All available indicators for dropdown
const allIndicators = [
  { type: 'behavior' as IndicatorType, fieldName: 'PV', description: '页面浏览量' },
  { type: 'behavior' as IndicatorType, fieldName: 'UV', description: '独立访客数' },
  { type: 'business' as IndicatorType, fieldName: '成交额', description: '业务成交金额' },
  { type: 'activation' as IndicatorType, fieldName: '入金量', description: '用户入金金额' },
  { type: 'activation' as IndicatorType, fieldName: '首投金额', description: '用户首次投资金额' },
];

// Available tags for activation threshold
const activationTags = [
  { tag: '入金', label: '入金' },
  { tag: '首投', label: '首投' },
  { tag: '活跃', label: '活跃' },
];

export function AddActivityModal({ isOpen, onClose, onAdd }: AddActivityModalProps) {
  const [activityId, setActivityId] = useState('');
  const [name, setName] = useState('');
  const [landingPageCode, setLandingPageCode] = useState('');
  const [pageCodes, setPageCodes] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activityType, setActivityType] = useState('activity');
  const [targetValue, setTargetValue] = useState('');
  const [relatedTask, setRelatedTask] = useState('');
  const [relatedTasks, setRelatedTasks] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ActivityStatus>('pending');

  // Indicator form state
  const [indicators, setIndicators] = useState<ActivityIndicator[]>([]);

  // Search states
  const [landingPageSearch, setLandingPageSearch] = useState('');
  const [pageCodeSearch, setPageCodeSearch] = useState('');

  // Dropdown visibility
  const [showLandingPageDropdown, setShowLandingPageDropdown] = useState(false);
  const [showPageCodeDropdown, setShowPageCodeDropdown] = useState(false);
  const [showRelatedTaskDropdown, setShowRelatedTaskDropdown] = useState(false);
  const [relatedTaskSearch, setRelatedTaskSearch] = useState('');

  // Indicator dropdown state
  const [indicatorSearch, setIndicatorSearch] = useState('');
  const [showIndicatorDropdown, setShowIndicatorDropdown] = useState(false);

  // Threshold state per indicator
  const [indicatorThresholds, setIndicatorThresholds] = useState<Record<string, { tag: string; operator: string; value: string }>>({});

  useEffect(() => {
    if (isOpen) {
      const timestamp = Date.now().toString(36).toUpperCase();
      setActivityId(`ACT${timestamp}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLandingPages = mockLandingPageCodes.filter(
    (lp) =>
      lp.code.toLowerCase().includes(landingPageSearch.toLowerCase()) ||
      lp.name.includes(landingPageSearch)
  );

  const filteredPageCodes = mockPageCodes.filter(
    (pc) =>
      pc.code.toLowerCase().includes(pageCodeSearch.toLowerCase()) ||
      pc.name.includes(pageCodeSearch)
  );

  const getIndicatorTypeLabel = (type: IndicatorType) => {
    const labels: Record<IndicatorType, string> = {
      behavior: '行为指标',
      business: '业务指标',
      activation: '激活指标',
    };
    return labels[type];
  };

  const filteredIndicators = allIndicators.filter(ind =>
    ind.fieldName.includes(indicatorSearch) || ind.description.includes(indicatorSearch)
  );

  const addIndicator = (indicator: typeof allIndicators[0]) => {
    // Check if already exists
    if (indicators.some((ind) => ind.fields.some(f => f.fieldName === indicator.fieldName))) return;

    const now = new Date().toISOString().split('T')[0];
    const threshold = indicatorThresholds[indicator.fieldName];

    const newIndicator: ActivityIndicator = {
      templateId: `T${String(indicators.length + 1).padStart(3, '0')}`,
      indicatorTypes: [indicator.type],
      indicatorName: indicator.description,
      fields: [{
        fieldName: indicator.fieldName,
        description: indicator.description,
        ...(indicator.type === 'activation' && threshold ? {
          threshold: {
            tag: threshold.tag,
            operator: threshold.operator,
            value: parseFloat(threshold.value),
          },
        } : {}),
      }],
      createdAt: now,
      updatedAt: now,
    };
    setIndicators([...indicators, newIndicator]);
  };

  const removeIndicator = (templateId: string) => {
    setIndicators(indicators.filter((i) => i.templateId !== templateId));
  };

  const updateThreshold = (fieldName: string, tag: string, operator: string, value: string) => {
    setIndicatorThresholds(prev => ({
      ...prev,
      [fieldName]: { tag, operator, value },
    }));
  };

  const handleSubmit = () => {
    if (!name.trim() || !startDate || !endDate) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    onAdd({
      name,
      landingPageCode,
      pageCode: pageCodes.join(','),
      aggregationStartDate: startDate,
      startDate,
      endDate,
      status,
      creator: '系统用户',
      indicators,
      createdAt: now,
      updatedAt: now,
    });
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setActivityId('');
    setName('');
    setLandingPageCode('');
    setPageCodes([]);
    setStartDate('');
    setEndDate('');
    setActivityType('activity');
    setTargetValue('');
    setRelatedTask('');
    setDescription('');
    setStatus('pending');
    setIndicators([]);
    setIndicatorThresholds({});
    setLandingPageSearch('');
    setPageCodeSearch('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[800px] max-h-[85vh] overflow-y-auto shadow-xl">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-slate-800">添加活动</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Module 1: Activity Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-1 h-4 bg-blue-600 rounded"></span>
              <h3 className="text-sm font-medium text-slate-700">活动信息</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Activity ID - disabled, auto-generated */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">活动ID</label>
                <input
                  type="text"
                  value={activityId}
                  disabled
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-slate-100 text-slate-500"
                />
              </div>

              {/* Activity Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  活动名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入活动名称"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Activity Start Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  活动开始日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Activity End Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  活动截止日期 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Activity Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  活动类型 <span className="text-red-500">*</span>
                </label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="activity">活动</option>
                  <option value="task">任务</option>
                </select>
              </div>

              {/* Target Value */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">目标值</label>
                <input
                  type="text"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="请输入目标值"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Related Task - multi-select with tags */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">关联任务</label>
                <div
                  onClick={() => setShowRelatedTaskDropdown(!showRelatedTaskDropdown)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white cursor-pointer flex items-center justify-between min-h-[42px] flex-wrap gap-1"
                >
                  {relatedTasks.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {relatedTasks.map((task) => (
                        <span key={task} className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                          {task === 'task1' ? '任务1 - 618推广' : task === 'task2' ? '任务2 - 新客引流' : '任务3 - 节日活动'}
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              setRelatedTasks(relatedTasks.filter((t) => t !== task));
                            }}
                            className="ml-1 cursor-pointer hover:text-blue-800"
                          >
                            ×
                          </span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400">请选择（可多选）</span>
                  )}
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {showRelatedTaskDropdown && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg">
                    <div className="p-2 border-b border-slate-200">
                      <input
                        type="text"
                        value={relatedTaskSearch}
                        onChange={(e) => setRelatedTaskSearch(e.target.value)}
                        placeholder="搜索任务"
                        className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none"
                        autoFocus
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {mockRelatedTasks
                        .filter((t) => t.name.includes(relatedTaskSearch))
                        .map((task) => (
                          <label
                            key={task.id}
                            className="flex items-center px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={relatedTasks.includes(task.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setRelatedTasks([...relatedTasks, task.id]);
                                } else {
                                  setRelatedTasks(relatedTasks.filter((t) => t !== task.id));
                                }
                              }}
                              className="w-4 h-4 mr-2 text-blue-600"
                            />
                            <span className="text-slate-700">{task.name}</span>
                          </label>
                        ))}
                    </div>
                    <div className="p-2 border-t border-slate-200 flex justify-end">
                      <button
                        onClick={() => setShowRelatedTaskDropdown(false)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        确定
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Page Code Collection - multi-select with tags */}
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">活动页编码集合</label>
                <div
                  onClick={() => setShowPageCodeDropdown(!showPageCodeDropdown)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white cursor-pointer flex items-center justify-between min-h-[42px] flex-wrap gap-1"
                >
                  {pageCodes.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {pageCodes.map((code) => {
                        const pc = mockPageCodes.find((p) => p.code === code);
                        return (
                          <span key={code} className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full">
                            <span className="font-mono">{code}</span>
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                setPageCodes(pageCodes.filter((c) => c !== code));
                              }}
                              className="ml-1 cursor-pointer hover:text-blue-800"
                            >
                              ×
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-slate-400">请选择（可多选）</span>
                  )}
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                  {showPageCodeDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg">
                      <div className="p-2 border-b border-slate-200">
                        <input
                          type="text"
                          value={pageCodeSearch}
                          onChange={(e) => setPageCodeSearch(e.target.value)}
                          placeholder="搜索编码或名称"
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {filteredPageCodes.map((pc) => (
                          <label
                            key={pc.code}
                            className="flex items-center px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={pageCodes.includes(pc.code)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setPageCodes([...pageCodes, pc.code]);
                                } else {
                                  setPageCodes(pageCodes.filter((c) => c !== pc.code));
                                }
                              }}
                              className="w-4 h-4 mr-2 text-blue-600"
                            />
                            <span className="font-mono text-slate-600">{pc.code}</span>
                            <span className="text-slate-400 ml-2">{pc.name}</span>
                          </label>
                        ))}
                      </div>
                      <div className="p-2 border-t border-slate-200 flex justify-end">
                        <button
                          onClick={() => setShowPageCodeDropdown(false)}
                          className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                        >
                          确定
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Activity Landing Page Code - dropdown with search */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">活动落地页编码</label>
                  <div
                    onClick={() => setShowLandingPageDropdown(!showLandingPageDropdown)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white cursor-pointer flex items-center justify-between"
                  >
                    <span className={landingPageCode ? 'text-slate-700' : 'text-slate-400'}>
                      {landingPageCode || '请选择'}
                    </span>
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {showLandingPageDropdown && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg">
                      <div className="p-2 border-b border-slate-200">
                        <input
                          type="text"
                          value={landingPageSearch}
                          onChange={(e) => setLandingPageSearch(e.target.value)}
                          placeholder="搜索编码或名称"
                          className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {filteredLandingPages.map((lp) => (
                          <div
                            key={lp.code}
                            onClick={() => {
                              setLandingPageCode(lp.code);
                              setShowLandingPageDropdown(false);
                              setLandingPageSearch('');
                            }}
                            className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                          >
                            <span className="font-mono text-slate-600">{lp.code}</span>
                            <span className="text-slate-400 ml-2">{lp.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">活动描述</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="请输入活动描述"
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Module 2: Indicator Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <span className="w-1 h-4 bg-blue-600 rounded"></span>
              <h3 className="text-sm font-medium text-slate-700">指标信息</h3>
            </div>

            {/* Indicator dropdown selector */}
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">选择指标</label>
              <div
                onClick={() => setShowIndicatorDropdown(!showIndicatorDropdown)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white cursor-pointer flex items-center justify-between"
              >
                <span className="text-slate-400">请选择指标（可搜索）</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {showIndicatorDropdown && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg">
                  <div className="p-2 border-b border-slate-200">
                    <input
                      type="text"
                      value={indicatorSearch}
                      onChange={(e) => setIndicatorSearch(e.target.value)}
                      placeholder="搜索指标名称"
                      className="w-full px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredIndicators.map((ind) => {
                      const isSelected = indicators.some(i => i.fields.some(f => f.fieldName === ind.fieldName));
                      return (
                        <div
                          key={ind.fieldName}
                          onClick={() => {
                            if (!isSelected) {
                              addIndicator(ind);
                              setShowIndicatorDropdown(false);
                              setIndicatorSearch('');
                            }
                          }}
                          className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between ${
                            isSelected ? 'bg-slate-50 text-slate-400' : 'hover:bg-slate-50'
                          }`}
                        >
                          <span>
                            <span className="text-blue-600 mr-2">{getIndicatorTypeLabel(ind.type)}</span>
                            <span className="text-slate-700">{ind.description}</span>
                          </span>
                          {isSelected && <span className="text-green-600 text-xs">已添加</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Selected indicators with threshold config */}
            {indicators.length > 0 && (
              <div className="space-y-3">
                {indicators.map((ind) => {
                  const fieldName = ind.fields[0]?.fieldName || '';
                  const threshold = indicatorThresholds[fieldName];
                  const isActivation = ind.indicatorTypes.includes('activation');

                  return (
                    <div key={ind.templateId} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {getIndicatorTypeLabel(ind.indicatorTypes[0])}
                          </span>
                          <span className="text-sm font-medium text-slate-700">{ind.indicatorName}</span>
                        </div>
                        <button
                          onClick={() => removeIndicator(ind.templateId)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          删除
                        </button>
                      </div>

                      {/* Threshold config for activation type */}
                      {isActivation && (
                        <div className="flex items-center gap-3 mt-2">
                          <label className="text-sm text-slate-600">阈值条件：</label>
                          <select
                            value={threshold?.tag || ''}
                            onChange={(e) => updateThreshold(fieldName, e.target.value, threshold?.operator || '>=', threshold?.value || '')}
                            className="px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                          >
                            <option value="">选择标签</option>
                            {activationTags.map((t) => (
                              <option key={t.tag} value={t.tag}>{t.label}</option>
                            ))}
                          </select>
                          <span className="text-slate-500">大于</span>
                          <input
                            type="text"
                            value={threshold?.value || ''}
                            onChange={(e) => updateThreshold(fieldName, threshold?.tag || '', threshold?.operator || '>=', e.target.value)}
                            placeholder="如：1000"
                            className="w-32 px-2 py-1.5 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-slate-500">元</span>
                          {threshold?.tag && threshold?.value && (
                            <span className="text-xs text-green-600">
                              ({threshold.tag} {threshold.operator}{threshold.value}元)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: Omit<Task, 'id'>) => void;
  activities: Activity[];
}

export function AddTaskModal({ isOpen, onClose, onAdd, activities }: AddTaskModalProps) {
  const [name, setName] = useState('');
  const [activityId, setActivityId] = useState('');
  const [userGroup, setUserGroup] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim() || !activityId) return;
    const activity = activities.find((a) => a.id === activityId);
    onAdd({
      name,
      activityId,
      activityName: activity?.name || '',
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
      userGroup,
    });
    setName('');
    setActivityId('');
    setUserGroup('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[500px] shadow-xl">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-800">添加任务</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              任务名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入任务名称"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              关联活动 <span className="text-red-500">*</span>
            </label>
            <select
              value={activityId}
              onChange={(e) => setActivityId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">请选择</option>
              {activities.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              目标用户群
            </label>
            <select
              value={userGroup}
              onChange={(e) => setUserGroup(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">请选择</option>
              <option value="group1">高净值用户群</option>
              <option value="group2">新手用户群</option>
              <option value="group3">活跃用户群</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}