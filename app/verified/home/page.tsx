"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Link from "next/link";
import { ProductCard, ProductCardFooter } from "@/components/ui/card-product";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Dispatch } from "@reduxjs/toolkit";
import { addToCart } from "@/lib/reducers/cartReducer";

export default function VerifiedHome() {
  const [flowerProducts, setFlowerProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const cacheExpiryTime = 3600000 * 2;
  //  3600000 = 1 hour

  const { cartItems } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const handleAddToCart = (item: any) => {
    dispatch(addToCart(item));
  };

  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = async () => {
    // localStorage.clear();
    const cachedData = localStorage.getItem("flowerProducts");

    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      console.log(data);
      const now = Date.now();
      if (now - timestamp < cacheExpiryTime) {
        // Use cached data if it's not expired
        setFlowerProducts(data);
        setLoading(false);
        return;
      }
    }
    // Fetch new data if no valid cache is found
    fetchProductsFromAPI();
  };

  const fetchProductsFromAPI = async () => {
    console.log("fetchProductsFromAPI");
    try {
      const res = await fetch("/api/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data);
        setFlowerProducts(data.flowerData);
        // Store data in localStorage with a timestamp
        const timestamp = Date.now();
        localStorage.setItem(
          "flowerProducts",
          JSON.stringify({ data: data.flowerData, timestamp })
        );
        setLoading(false);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // if (loading) return <div>Loading...</div>;
  return (
    <ContentLayout title="Home">
      <main className="flex flex-col gap-4 pr-0">
        <section className="flex flex-col">
          <h2 className="text-black text-center scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Flower
          </h2>
          <div className="flex gap-3 overflow-x-scroll pr-6">
            {flowerProducts.map((flowerProduct, i: number) => (
              <ProductCard key={i} className="">
                <img className="card rounded-md" src="/flowa.jpg" />
                <ProductCardFooter className="flex flex-col p-2">
                  <p>{flowerProduct.name}</p>
                  <p>Product Farm</p>
                  <Button
                    className=""
                    onClick={() => {
                      handleAddToCart(flowerProduct);
                    }}
                  >
                    Add to cart
                  </Button>
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
          </div>
        </section>
      </main>
    </ContentLayout>
  );
}
