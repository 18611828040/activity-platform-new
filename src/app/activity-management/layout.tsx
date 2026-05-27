import { TopNav, Sidebar } from '@/components/ShellLayout';

export default function ActivityManagementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav />
      <Sidebar />
      <main className="ml-[200px] pt-14 min-h-screen bg-slate-100">
        <div className="p-6">
          {children}
        </div>
      </main>
    </>
  );
}