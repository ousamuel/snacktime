"use client";
import * as React from "react";
import TableComp from "../TableComp";
import { ContentLayout } from "@/components/admin-panel/content-layout";
export default function FlowerInventory() {
  return (
    <ContentLayout title="Inventory">
      <TableComp product="flower" />
    </ContentLayout>
  );
}
