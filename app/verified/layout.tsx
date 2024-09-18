import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

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
  }
  // const approvedEmails = ;
  // if (
  //   ![
  //     "gtuyishime02@gmail.com",
  //     "coinchip167@gmail.com",
  //     "angela.wu808@gmail.com",
  //   ].includes(user.email || "")
  // ) {
  //   return redirect("/waitlist");
  // }

  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
