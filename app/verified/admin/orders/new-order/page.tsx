"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PricingForm from "@/components/admin-panel/ProductPricingForm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import Link from "next/link";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  SquareX,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { addProductAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import DialogComp from "./DialogComp";
import Papa from "papaparse";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function NewOrdersPage() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [products, setProducts] = useState<any>([]);
  const [productData, setProductData] = useState<any>({});
  const [orderedItems, setOrderedItems] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [orderTotal, setOrderTotal] = useState<number>(0);
  const flowerPricing = ["eighth", "half", "oz", "q", "qp", "hp", "p"];
  const condimentPricing = ["Single", "2+", "4+", "10+", "25+", "100+"];
  useEffect(() => {
    fetchProductsFromAPI();
  }, []);

  const fetchProductsFromAPI = async () => {
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
        setProducts(data.data);
        // Store data in localStorage with a timestamp
        const timestamp = Date.now();
        localStorage.setItem("products", JSON.stringify({ data, timestamp }));
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <ContentLayout title="New Orders">
      <main className="flex flex-col gap-2 items-center pr-6">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          ${orderTotal.toFixed(2)}
        </h3>
        <Button onClick={() => console.log(orderedItems)}>Submit Order</Button>
        <section className="flex w-full gap-4 flex-col md:flex-row">
          {/* <section className="flex flex-col grow items-center">
            <h3 className="text-center scroll-m-20 text-2xl font-semibold tracking-tight">
              Product Search
            </h3> */}
          {/* </section> */}
          <Command className="max-w-[400px]">
            <CommandInput placeholder="Find product by name..." />
            <CommandList className="h-full">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Flower" className="">
                {products &&
                  products
                    .filter((product: any) => product.category == "flower")
                    .map((product: any, i: number) => (
                      <div
                        onClick={() => {
                          setOpenDialog(true);
                          console.log(product);
                          setProductData(product);
                        }}
                      >
                        <CommandItem key={i} className="cursor-pointer">
                          {product.name}
                        </CommandItem>
                      </div>
                    ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Condiments" className="">
                {products &&
                  products
                    .filter((product: any) => product.category !== "flower")
                    .map((product: any, i: number) => (
                      <div
                        onClick={() => {
                          setOpenDialog(true);
                          setProductData(product);
                        }}
                      >
                        <CommandItem key={i} className="cursor-pointer">
                          {product.name}
                        </CommandItem>
                      </div>
                    ))}
              </CommandGroup>
            </CommandList>
          </Command>
          <section className="flex flex-col grow">
            <h3 className="text-center scroll-m-20 mb-4 text-2xl font-semibold tracking-tight">
              Order Summary
            </h3>
            <section className="w-full">
              <div className="grid grid-cols-3 font-semibold border-b pb-2 mb-2">
                <h3 className="text-left">Item</h3>
                <h3 className="text-center">Quantity</h3>
                <h3 className="text-right">Total</h3>
              </div>

              {/* Items Mapping */}
              {orderedItems.length > 0 ? (
                orderedItems.map((item: any, index: number) => (
                  <div key={index} className="grid grid-cols-3 py-2">
                    <div className="text-left">
                      <h3
                        className={`mb-1 text-white px-2 py-1 rounded-md ${
                          item.category.toLowerCase() === "flower"
                            ? "bg-green-500"
                            : item.category.toLowerCase() === "vape"
                              ? "bg-blue-500"
                              : item.category.toLowerCase() === "concentrate"
                                ? "bg-orange-500"
                                : item.category.toLowerCase() === "edible"
                                  ? "bg-purple-500"
                                  : "bg-gray-500"
                        }`}
                      >
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground">
                        (${item.option_cost}/{item.option_weight})
                      </p>
                    </div>
                    <h3 className="text-center">{item.quantity}</h3>
                    <div className="text-right">
                      <h3>${item.total_cost.toFixed(2)}</h3>
                      <p className="text-muted-foreground">
                        {item.category == "flower"
                          ? item.total_weight_in_lbs + " lbs"
                          : item.quantity + " units"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No items added yet</p>
              )}
              <section>
                <div className="grid grid-cols-3 font-semibold border-t pt-2 mt-2">
                  <h3>Total</h3>
                  <h3></h3>
                  <h3 className="text-right">${orderTotal.toFixed(2)}</h3>
                </div>
              </section>
            </section>
          </section>

          <DialogComp
            pricingOptions={
              productData.category == "flower"
                ? flowerPricing
                : condimentPricing
            }
            orderTotal={orderTotal}
            setOrderTotal={setOrderTotal}
            setOpenDialog={setOpenDialog}
            openDialog={openDialog}
            productData={productData}
            orderedItems={orderedItems}
            setOrderedItems={setOrderedItems}
          />
        </section>

        <section>
          <h4>Payment Details</h4>
        </section>

        {/* DIALOG TRIGGER SET TO ONCLIKC AND THEN DO DIALOG FORM FOR CHOOSING OPTION */}
        {/* {focusFilter && (
          <DropdownMenu open={focusFilter}>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )} */}
      </main>
    </ContentLayout>
  );
}
