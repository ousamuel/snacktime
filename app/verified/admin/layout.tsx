// import { createClient } from "@/utils/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";

export default async function Layout() {
  const supabase = createClient(
    process.env.SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!userError) {
    const { data, error } = await supabase
      .from("admins")
      .select("*") // Select all fields or specify what you need
      .eq("user_id", user?.id)
      .single(); // Use single if you expect only one record
    if (!data || error) {
      return redirect("/");
    }
  }
}
