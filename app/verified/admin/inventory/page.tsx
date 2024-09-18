"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import PricingForm from "@/components/admin-panel/ProductPricingForm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/submit-button";
import { Label } from "@/components/ui/label";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { addProductAction } from "@/app/actions";
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

const columns: ColumnDef<unknown, any>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className=""
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div>{row.getValue("description")}</div>,
  },
  {
    accessorKey: "strain",
    header: "Strain",
    cell: ({ row }) => <div>{row.getValue("strain") ?? "N/A"}</div>,
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
    accessorKey: "created_at",
    header: "Created At",
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
  {
    accessorKey: "listed",
    header: "Listed",
    cell: ({ row }) => (
      <div
        className={row.getValue("listed") ? "text-green-600" : "text-red-600"}
      >
        {row.getValue("listed") ? "Yes" : "No"}
      </div>
    ),
  },
];
export default function Inventory() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<any[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    strain: "", // Default strain value
    pricing_options: [], // Pricing options is an array
    // Add other form fields here if needed
  });

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return redirect("/");
      } else if (
        ![
          "snacktimeexec@gmail.com",
          "coinchip166@gmail.com",
          "eddiehurhur@gmail.com",
          "aceit.customercare@gmail.com",
        ].includes(user.email || "")
      ) {
        return redirect("/verified");
      }

      const { data, error } = await supabase.from("products").select();
      if (error) {
        console.warn(error);
      } else {
        console.log(data);
        setData(data);
      }
    };
    fetchUser();
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
  const handleProductSubmit = async (e: any) => {
    e.preventDefault();
    const { error } = await addProductAction(formData);
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

  return (
    <ContentLayout title="Inventory">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Admin</BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inventory</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="">
        <div>
          <h1>Upload CSV</h1>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          {/* <button onClick={handleSubmit}>Submit to Supabase</button> */}
        </div>
        <div className="flex justify-between py-4">
          {/* <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          /> */}
          <Input
            placeholder="Filter by name..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <section className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="px-2 h-full border border-accent">
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-full w-5/6 max-h-[calc(100vh-100px)] overflow-y-scroll">
                <DialogTitle asChild>
                  <h1 className="text-2xl font-medium">Add New Item</h1>
                </DialogTitle>
                <form
                  onSubmit={handleProductSubmit}
                  className="flex flex-col w-full p-4 gap-2 [&>input]:mb-4 text-foreground"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2 lg:flex-row">
                      <section className="flex flex-1 flex-col [&>input]:mb-3">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          name="name"
                          placeholder="name"
                          value={formData.name}
                          onChange={handleFormValueChange}
                        />
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          name="description"
                          value={formData.description}
                          onChange={handleFormValueChange}
                          placeholder="Product Description"
                          className=""
                        />
                        <div className="flex flex-col gap-2">
                          <Label htmlFor="strain">Strain</Label>
                          <select
                            name="strain"
                            required
                            value={formData.strain}
                            onChange={handleFormValueChange}
                            className="border rounded p-2"
                          >
                            <option value="sativa">Sativa</option>
                            <option value="indica">Indica</option>
                            <option value="hybrid">Hybrid</option>
                          </select>
                        </div>
                      </section>
                      <section className="flex flex-col flex-1">
                        <h4 className="text-center underline">
                          Pricing Options
                        </h4>
                        <PricingForm
                          pricingOptions={formData.pricing_options}
                          setPricingOptions={(updatedOptions: any) =>
                            setFormData((prev) => ({
                              ...prev,
                              pricing_options: updatedOptions,
                            }))
                          }
                        />
                      </section>
                    </div>
                    <SubmitButton
                      pendingText="Saving..."
                      formAction={addProductAction}
                    >
                      Save
                    </SubmitButton>
                    {/* <FormMessage message={searchParams} /> */}
                  </div>
                </form>
                <DialogDescription className="h-0" />
              </DialogContent>
            </Dialog>{" "}
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
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
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
                ))
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
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
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
      </div>
    </ContentLayout>
  );
}
