import Link from "next/link";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex flex-col gap-2 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-5xl flex justify-center items-center p-3 px-5 text-sm">
          {/* <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}>Next.js Supabase Starter</Link>
                    <div className="flex items-center gap-2">
                    </div>
                  </div> */}
          <Link href="/" className="text-4xl font-bold">
            SNACKTIME
          </Link>
        </div>
      </nav>
      {children}
    </div>
  );
}
