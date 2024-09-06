import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
// import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import Link from "next/link";
import HeaderAuth from "@/components/header-auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  } else if (
    !["snacktimeexec@gmail.com", "coinchip167@gmail.com"].includes(
      user.email || ""
    )
  ) {
    return redirect("/waitlist");
  }

  return (
    <>
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
          <HeaderAuth />
        </div>
      </nav>
      {children}
    </>
    // <AdminPanelLayout>
    // </AdminPanelLayout>
  );
}
