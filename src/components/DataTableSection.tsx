'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Download, Settings } from 'lucide-react';
import { DailyDetail, ViewMode } from '@/types/activity';

interface DataTableSectionProps {
  data: DailyDetail[];
  viewMode: ViewMode;
}

const ACTIVITY_COLUMNS = [
  { key: 'date', label: '日期', visible: true },
  { key: 'activityPagePV', label: '活动页PV', visible: true },
  { key: 'activityPageUV', label: '活动页UV', visible: true },
  { key: 'targetUserCount', label: '目标用户数', visible: true },
  { key: 'participateUserCount', label: '参与用户数', visible: true },
];

const TASK_COLUMNS = [
  { key: 'date', label: '日期', visible: true },
  { key: 'reachCustomerCount', label: '触达客户数', visible: true },
  { key: 'intentionCustomerCount', label: '意向客户数', visible: true },
  { key: 'activatedCustomerCount', label: '激活客户数', visible: true },
  { key: 'activatedThousandHouseholds', label: '激活千元户数', visible: true },
  { key: 'netNewAssetAmount', label: '净新增资产', visible: true },
  { key: 'netRevenue', label: '净创收', visible: true },
  { key: 'newProductSalesAmount', label: '新增产品销售额', visible: true },
];

function formatNumber(value: number): string {
  if (value >= 100000000) {
    return (value / 100000000).toFixed(2) + '亿';
  } else if (value >= 10000) {
    return (value / 10000).toFixed(0) + '万';
  }
  return value.toLocaleString();
}

export function DataTableSection({ data, viewMode }: DataTableSectionProps) {
  const columns = viewMode === 'activity' ? ACTIVITY_COLUMNS : TASK_COLUMNS;
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.map((c) => c.key))
  );

  useEffect(() => {
    setVisibleColumns(new Set(columns.map((c) => c.key)));
    setExpandedRows(new Set());
  }, [viewMode]);

  const toggleRow = (date: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedRows(newExpanded);
  };

  const toggleColumn = (key: string) => {
    const newVisible = new Set(visibleColumns);
    if (newVisible.has(key)) {
      newVisible.delete(key);
    } else {
      newVisible.add(key);
    }
    setVisibleColumns(newVisible);
  };

  const exportCSV = () => {
    const visibleCols = columns.filter((c) => visibleColumns.has(c.key));
    const headers = visibleCols.map((c) => c.label);
    const rows = data.flatMap((day) => {
      const dayRow = visibleCols.map((col) => {
        const value = day[col.key as keyof DailyDetail];
        if (typeof value === 'number') {
          return col.key === 'date' ? value : String(value);
        }
        return String(value || '');
      });

      const hourlyRows = day.hourlyDetails?.map((hour) => {
        return visibleCols.map((col) => {
          if (col.key === 'date') return hour.hour;
          const value = hour[col.key as keyof typeof hour];
          return typeof value === 'number' ? String(value) : String(value || '');
        });
      }) || [];

      return [dayRow, ...hourlyRows];
    });

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${viewMode === 'activity' ? 'activity' : 'task'}_data.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">数据明细表格</h2>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <Settings className="w-4 h-4 text-slate-500" />
              <span className="text-sm text-slate-600">显示列</span>
            </button>
            <div className="absolute right-0 top-full mt-2 p-3 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 min-w-48">
              <div className="space-y-2">
                {columns.filter((c) => c.key !== 'date').map((col) => (
                  <label key={col.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(col.key)}
                      onChange={() => toggleColumn(col.key)}
                      className="rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-600">{col.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="text-sm text-slate-600">CSV 下载</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="w-8"></th>
              {columns.filter((c) => visibleColumns.has(c.key)).map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-sm font-medium text-slate-600"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((day) => (
              <>
                <tr key={day.date} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-2">
                    {day.hourlyDetails && day.hourlyDetails.length > 0 ? (
                      <button
                        onClick={() => toggleRow(day.date)}
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                      >
                        {expandedRows.has(day.date) ? (
                          <ChevronDown className="w-4 h-4 text-slate-500" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    ) : null}
                  </td>
                  {columns.filter((c) => visibleColumns.has(c.key)).map((col) => (
                    <td key={col.key} className="px-4 py-3 text-sm text-slate-700">
                      {col.key === 'date' ? (
                        <span className="font-medium">{day[col.key as keyof DailyDetail] as string}</span>
                      ) : col.key === 'netNewAssetAmount' || col.key === 'netRevenue' || col.key === 'newProductSalesAmount' ? (
                        <span>{formatNumber(day[col.key as keyof DailyDetail] as number)}</span>
                      ) : (
                        <span>{(day[col.key as keyof DailyDetail] as number).toLocaleString()}</span>
                      )}
                    </td>
                  ))}
                </tr>
                {expandedRows.has(day.date) && day.hourlyDetails && (
                  <>
                    {day.hourlyDetails.map((hour) => (
                      <tr key={`${day.date}-${hour.hour}`} className="bg-slate-50 border-b border-slate-100">
                        <td></td>
                        {columns.filter((c) => visibleColumns.has(c.key)).map((col) => (
                          <td key={col.key} className="px-4 py-2 text-sm text-slate-600">
                            {col.key === 'date' ? (
                              <span className="ml-4 text-slate-500">{hour.hour}</span>
                            ) : col.key === 'netNewAssetAmount' || col.key === 'netRevenue' || col.key === 'newProductSalesAmount' ? (
                              <span>{formatNumber(hour[col.key as keyof typeof hour] as number)}</span>
                            ) : (
                              <span>{(hour[col.key as keyof typeof hour] as number).toLocaleString()}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}