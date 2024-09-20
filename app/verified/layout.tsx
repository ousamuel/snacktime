"use client";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import StoreProvider from "../storeProvider";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AdminPanelLayout>{children}</AdminPanelLayout>{" "}
    </StoreProvider>
  );
}
