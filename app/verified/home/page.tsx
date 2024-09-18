"use client";
import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
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
export default function VerifiedPage() {
  const supabase = createClient();
  const getProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setFlowerProducts(data.flowerData);
        console.log(data.flowerData);
      } else {
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };
  useEffect(() => {
    getProducts();
  }, [supabase]);

  const [flowerProducts, setFlowerProducts] = useState<any[]>([]);
  const [condimentProducts, setCondimentProducts] = useState<any[]>([]);
  const [glassProducts, glassProduct] = useState<any[]>([]);

  const mapped = [1, 2, 3, 4];
  return (
    <ContentLayout title="Home">
      <Breadcrumb>
        <BreadcrumbList></BreadcrumbList>
      </Breadcrumb>

      <main>
        <h2>Flower</h2>
        <section className="flex gap-3 overflow-x-scroll">
          {flowerProducts && flowerProducts.map((flowerProduct, i: number) => (
            <ProductCard key={i} className="">
              <img className="card rounded-md" src="/flowa.jpg" />
              <ProductCardFooter className="flex flex-col p-2">
                <p>{flowerProduct.name}</p>
                <p>Product Farm</p>
              </ProductCardFooter>
            </ProductCard>
          ))}
          <ProductCard className="bg-accent">
            <div
              className="rounded-md text-center text-4xl text-gray-500 flex h-full 
            justify-center items-center"
            >
              View all
            </div>
          </ProductCard>
        </section>
      </main>
    </ContentLayout>
  );
}
