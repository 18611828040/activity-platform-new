'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: '营销工具',
    items: [
      { label: '用户洞察', href: '/user-insights' },
      { label: '活动管理', href: '/activity-management' },
    ],
  },
  {
    title: '数据分析',
    items: [
      { label: '活动分析', href: '/' },
      { label: '用户分析', href: '/user-analysis' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 w-[200px] h-full bg-slate-800 text-white flex flex-col z-50">
      <div className="h-12 flex items-center px-4 border-b border-slate-700">
        <h1 className="text-base font-semibold">数字化运营平台</h1>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-5">
            <h2 className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
              {group.title}
            </h2>
            <ul>
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center h-9 mx-2 px-3 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}