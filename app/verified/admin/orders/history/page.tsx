"use client";
import * as React from "react";
import OrderTableComp from "./OrderHistoryTable";
import { ContentLayout } from "@/components/admin-panel/content-layout";
export default function OrdersPage() {
  return (
    <ContentLayout title="Orders">
      <OrderTableComp />
    </ContentLayout>
  );
}
