import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar title={title} />
      <div className="p-6 pr-0 h-full">{children}</div>
    </div>
  );
}
