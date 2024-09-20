"use client";
import { createClient } from "@/utils/supabase/client";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  ProductCard,
  ProductCardContent,
  ProductCardDescription,
  ProductCardFooter,
  ProductCardHeader,
  ProductCardTitle,
} from "@/components/ui/card-product";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";

export default function CheckOutPage() {
  const supabase = createClient();
  const { cartItems } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    console.log(cartItems);
  }, []);

  const mapped = [1, 2, 3, 4];
  return (
    <ContentLayout title="Check Out">
      <main className="flex flex-col gap-4 pr-0">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Your Cart
        </h1>
        {cartItems && cartItems.map((item: any) => <div>item</div>)}
      </main>
    </ContentLayout>
  );
}
