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
import Papa from "papaparse";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

const columns: ColumnDef<unknown, any>[] = [
  {
    accessorKey: "product_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Product Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("product_name")}</div>,
  },
  {
    accessorKey: "last_updated",
    header: "Last Updated",
    cell: ({ row }) => {
      const lastUpdated = new Date(row.getValue("last_updated"));
      return (
        <div>
          {lastUpdated.toLocaleDateString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "customer_name",
    header: "Customer Name",
    cell: ({ row }) => <div>{row.getValue("customer_name")}</div>,
  },
  {
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("created_at"));
      return (
        <div>
          {createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "pricing", // If you have pricing data
    header: "Pricing",
    cell: ({ row }) => {
      const pricing = parseFloat(row.getValue("pricing"));
      return pricing ? `$${pricing.toFixed(2)}` : "N/A";
    },
  },
];

export default function OrderTableComp() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [openRowDrawer, setOpenRowDrawer] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [selectedPricingOptions, setSelectedPricingOptions] = useState<any[]>(
    []
  );
  const [csvData, setCsvData] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    strain: "", // Default strain value
    in_stock: "",
    pricing_options: [],
    supplier: "",

    // Add other form fields here if needed
  });
  const { user, secureAccess, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    // sessionStorage.clear();
    const fetchUserAndOrders = async () => {
      const supabase = createClient();
      if (!user) {
        router.push("/");
      } else if (!secureAccess) {
        router.push("/verified");
      }

      const savedData = sessionStorage.getItem("orders");
      if (savedData && JSON.parse(savedData).length > 0) {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
        return;
      }

      const { data, error: fetchOrdersError } = await supabase
        .from("orders")
        .select();

      if (data) {
        const jsonString = JSON.stringify(data);
        const sizeInBytes = new TextEncoder().encode(jsonString).length;
        const sizeInMB = sizeInBytes / (1024 * 1024);
        if (sizeInMB <= 2.5) {
          sessionStorage.setItem("orders", JSON.stringify(data));
        }
        console.log(sessionStorage);
      }
      if (fetchOrdersError) {
        console.warn(fetchOrdersError);
      } else {
        console.log(data);
        setData(data);
      }
    };
    fetchUserAndOrders();
  }, []);
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const handleOrderSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.pricing_options.some((option: any) => option.cost == "")) {
      return { error: "All pricing options must have a cost" };
    }
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        // console.log(data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const handleFormValueChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      Papa.parse(file, {
        header: true,
        complete: function (results) {
          console.log("Parsed Data:", results.data);
          setCsvData(results.data);
          //   for (let i = 0; i < results.data.length; i ++ ){
          //     console.log(results.data[i])
          //   }
        },
        error: function (error) {
          console.error("Error parsing CSV:", error);
        },
      });
    }
  };
  const clearFormData = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
      strain: "", // Default strain value
      in_stock: "",
      pricing_options: [],
      supplier: "",
    });
  };
  const handleOpenDrawer = async (rowData: any) => {
    console.log(rowData);
    setSelectedPricingOptions(
      rowData.pricing_options ? rowData.pricing_options : []
    );
    setFormData({
      id: rowData.id,
      name: rowData.name,
      description: rowData.description,
      strain: rowData.strain,
      in_stock: rowData.in_stock,
      pricing_options: rowData.pricing_options,
      supplier: rowData.supplier || "",
    });
    setSelectedRow(rowData);
    setOpenRowDrawer(true);
  };
  const handleUnitConversion = (value: number, unit: string) => {
    // 0.125, .25, .5, 1, 2
    if (value <= 1) {
    }
  };

  return (
    <main className="pr-6">
      {/* <div>
          <h1>Upload CSV</h1>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button onClick={handleSubmit}>Submit to Supabase</button>
        </div> */}
      <div className="flex justify-between py-4">
        <section>
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Orders
          </h2>
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm ring-0"
          />
          {/* <div className="flex flex-col gap-2">
            <RadioGroup
              value={selectedValue} // Controlled value for selected radio
              className="gap-0"
              onValueChange={(value) => {
                setSelectedValue(value); // Update the state to track the selected radio button
                table.getColumn("category")?.setFilterValue(value); // Apply filtering based on the selected value
              }}
            >
              {[
                { label: "All", value: "" },
                { label: "Flower", value: "flower" },
                { label: "Condiments", value: "condiments" },
              ].map((strain) => (
                <div
                  key={strain.label}
                  className="flex items-center gap-x-2 p-2 cursor-pointer hover:bg-background"
                  onClick={() => {
                    setSelectedValue(strain.value); // Set the selected value when the div is clicked
                    table.getColumn("strain")?.setFilterValue(strain.value); // Apply filtering
                  }}
                >
                  <RadioGroupItem
                    value={strain.value}
                    checked={selectedValue === strain.value}
                  />
                  <Label htmlFor={strain.value}>{strain.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div> */}
        </section>
        <section className="flex flex-col gap-2">
          <Button asChild>
            <Link
              href="/verified/admin/orders/new-order"
              className="px-2 h-fit  border border-accent"
            >
              Add New
            </Link>
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="p-4 w-fit flex flex-col">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <div
                      key={column.id}
                      className="flex gap-2 items-center rounded-md 
                      p-1 capitalize cursor-pointer hover:bg-accent"
                      onClick={() =>
                        column.toggleVisibility(!column.getIsVisible())
                      } // toggle visibility when the div is clicked
                    >
                      <Checkbox
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                        onClick={(e) => e.stopPropagation()} // stop event propagation on the checkbox itself
                        className="w-6 h-6"
                      />
                      <label className="cursor-pointer">
                        {column.id.replace("_", " ")}
                      </label>
                    </div>
                  );
                })}
            </PopoverContent>
          </Popover>
        </section>
      </div>
      <div className="rounded-md border">
        <Table className="min-w-[800px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                // row.original == row data
                return (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer hover:bg-background"
                    onClick={() => {
                      handleOpenDrawer(row.original);
                    }}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Drawer
        open={openRowDrawer}
        onOpenChange={(open) => {
          if (!open) {
            //   setNumberCorrect(0);
            clearFormData();
            setSelectedPricingOptions([]);
          }
          setOpenRowDrawer(open);
        }}
      >
        <DrawerContent className=" ">
          <DrawerHeader>
            <form
              id="inven-form-existing"
              className="min-h-[70vh] max-h-[70vh] overflow-y-scroll"
            >
              <DrawerTitle asChild>
                <p className="text-muted-foreground text-sm p-1">
                  ID: {selectedRow.id}
                </p>
              </DrawerTitle>
              <DrawerDescription asChild>
                <div className="grid-container">
                  <div className="flex flex-col">
                    <section>
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={formData.name}
                        onChange={handleFormValueChange}
                      />
                    </section>
                    <section>
                      <Label htmlFor="supplier">Supplier</Label>
                      <Input
                        type="text"
                        name="supplier"
                        placeholder="Supplier Name"
                        value={formData.supplier}
                        onChange={handleFormValueChange}
                      />
                    </section>
                    <section>
                      <Label htmlFor="strain">Strain</Label>
                      <select
                        name="strain"
                        required
                        value={formData.strain.toLowerCase()}
                        onChange={handleFormValueChange}
                        className="border rounded p-2"
                      >
                        <option value="sativa">Sativa</option>
                        <option value="indica">Indica</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </section>
                    {/* <section>
                      <Label htmlFor="category">Category</Label>
                      <select
                        name="category"
                        required
                        value={formData.category.toLowerCase()}
                        onChange={handleFormValueChange}
                        className="border rounded p-2"
                      >
                        <option value="flower">Flower</option>
                        <option value="edible">Edible</option>
                        <option value="vape">Vape</option>
                        <option value="concentrate">Concentrate</option>
                      </select>
                    </section> */}
                    <section className="flex flex-col h-full">
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        name="description"
                        placeholder="Product Description"
                        value={formData.description}
                        onChange={handleFormValueChange}
                        className="h-full border p-2 rounded-md"
                      />
                    </section>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="pricingOptions">Pricing Options</Label>
                    <div className="flex flex-col gap-2 ">
                      <PricingForm
                        pricingOptions={formData.pricing_options}
                        setPricingOptions={(updatedOptions: any) =>
                          setFormData((prev) => ({
                            ...prev,
                            pricing_options: updatedOptions,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </DrawerDescription>
            </form>
          </DrawerHeader>
          <DrawerFooter className="flex flex-row">
            <DrawerClose onClick={() => setOpenRowDrawer(false)} asChild>
              <Button className="flex-1" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
            <Button onClick={handleOrderSubmit} className="flex-1">
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </main>
  );
}
