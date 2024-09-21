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

import Papa from "papaparse";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function NewOrdersPage() {
  const [filterBy, setFilterBy] = useState<string>("");
  const [products, setProducts] = useState<any>([]);
  const [productData, setProductData] = useState<any>({});
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
        <h3>Total Cost</h3>
        <h2>Transaction Details</h2>
        <section className="flex w-full">
          <Command className="max-w-[500px]">
            <CommandInput placeholder="Find product by name..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Flower" className="max-h-[300px] ">
                {products &&
                  products
                    .filter((product: any) => product.category == "flower")
                    .map((product: any, i: number) => (
                      <CommandItem
                        key={i}
                        onClick={() => {
                          setProductData(product);
                        }}
                      >
                        {product.name}
                      </CommandItem>
                    ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Condiments" className="">
                {products &&
                  products
                    .filter((product: any) => product.category !== "flower")
                    .map((product: any, i: number) => (
                      <CommandItem key={i}>{product.name}</CommandItem>
                    ))}
              </CommandGroup>
            </CommandList>
          </Command>
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

        <section className="flex"></section>
      </main>
    </ContentLayout>
  );
}
