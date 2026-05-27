'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const topNavItems: NavItem[] = [
  { label: '首页', href: '/activity-analytics' },
  { label: '营销活动', href: '/activity-analytics/activity-management' },
  { label: '客户画像', href: '/activity-analytics/customer-profile' },
  { label: '触客管理', href: '/activity-analytics/touch-management' },
  { label: '数据回收', href: '/activity-analytics/data-recovery' },
  { label: '分析平台', href: '/activity-analytics/analytics' },
  { label: '更多菜单', href: '/activity-analytics/more' },
];

const sidebarItems: NavItem[] = [
  { label: '驾驶舱', href: '/activity-analytics/cockpit' },
  { label: '任务管理', href: '/activity-analytics/task-management' },
  { label: '活动管理', href: '/activity-analytics/activity-management' },
  { label: '策略模板', href: '/activity-analytics/strategy-template' },
  { label: '内容管理', href: '/activity-analytics/content-management' },
  { label: '系统运维', href: '/activity-analytics/operations' },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/activity-analytics" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
            <span className="text-red-600 font-bold text-lg">W</span>
          </div>
          <span className="text-slate-800 font-medium">数字化客户运营平台</span>
        </Link>

        <nav className="flex items-center h-14">
          {topNavItems.map((item) => {
            const isActive = item.label === '营销活动';
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 h-full flex items-center text-sm transition-colors ${
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
          <span className="text-slate-600 text-sm font-medium">研</span>
        </div>
      </div>
    </header>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-[200px] bg-white border-r border-slate-200 z-40">
      <nav className="py-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href || pathname.endsWith(item.href.replace('/activity-analytics', ''));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center h-10 px-4 text-sm transition-colors ${
                isActive
                  ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600 font-medium'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}