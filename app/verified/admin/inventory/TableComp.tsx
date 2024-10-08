"use client";
import * as React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { debounce } from "lodash";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { ArrowUpDown, ChevronDown, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function TableComp({ product }: { product: string }) {
  const generatePricingColumns = () => {
    const productPricingOptions: { [key: string]: string[] } = {
      flower: ["eighth", "q", "half", "oz", "qp", "hp", "p"],
      condiments: ["Single", "2+", "4+", "10+", "25+", "50+", "100+"],
      // Add other products here...
    };
    const pricingOptions = productPricingOptions[product] || [];

    return pricingOptions.map((key: string) => ({
      accessorKey: key, // Access nested field
      header: key == "eighth" ? "8th" : key.toUpperCase(), // Dynamically set header based on key
      cell: ({ row }: { row: any }) => {
        const value = row.getValue(key);
        return value ? value : "- -"; // Adjust based on your data
      },
    }));
  };
  const generateStockColumn = () => {
    let key = product == "flower" ? "weight_in_stock" : "units_in_stock";
    return {
      accessorKey: key, // Access nested field
      header: product == "flower" ? "Stock (lbs)" : "Stock (units)", // Dynamically set header based on key
      cell: ({ row }: { row: any }) => {
        const value = row.getValue(key);
        return value ? value : "- -"; // Adjust based on your data
      },
    };
  };
  const generateSoldColumn = () => {
    let key = product == "flower" ? "total_lb_sold" : "total_units_sold";
    return {
      accessorKey: key, // Access nested field
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {product == "flower" ? "Sold (lbs)" : "Sold (units)"}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }: { row: any }) => {
        const value = row.getValue(key);
        return value ? value : "- -"; // Adjust based on your data
      },
    };
  };

  const columns: ColumnDef<unknown, any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }: { row: any }) => (
        <div
          className={`px-2 py-1 rounded text-white text-xs ${
            row.getValue("category").toLowerCase() === "flower"
              ? "bg-green-500"
              : row.getValue("category").toLowerCase() === "vape"
                ? "bg-blue-500"
                : row.getValue("category").toLowerCase() === "concentrate"
                  ? "bg-orange-500"
                  : row.getValue("category").toLowerCase() === "edible"
                    ? "bg-purple-500"
                    : "bg-gray-500"
          }`}
        >
          {row.getValue("category").toUpperCase()}
        </div>
      ),
    },
    ...generatePricingColumns(),
    generateStockColumn(),
    generateSoldColumn(),
    {
      accessorKey: "total_order_count",
      header: ({ column }: { column: any }) => (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Orders
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("total_order_count")}</div>,
    },
    {
      accessorKey: "total_revenue",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total Revenue
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const rev = parseFloat(row.getValue("total_revenue"));
        return <p>${rev.toFixed(2)}</p>;
      },
    },
    // {
    //   accessorKey: "description",
    //   header: "Description",
    //   cell: ({ row }) => <div className="">{row.getValue("description")}</div>,
    // },
    // {
    //   accessorKey: "strain",
    //   header: ({ column }) => (
    //     <Button
    //       variant="ghost"
    //       className="pl-0"
    //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //     >
    //       Strain
    //       <ArrowUpDown className="ml-2 h-4 w-4" />
    //     </Button>
    //   ),
    //   cell: ({ row }) => <div>{row.getValue("strain") ?? "N/A"}</div>,
    // },
    // {
    //   accessorKey: "last_updated",
    //   header: "Last Updated",
    //   cell: ({ row }) => {
    //     const lastUpdated = new Date(row.getValue("last_updated"));
    //     return (
    //       <div>
    //         {lastUpdated.toLocaleDateString("en-US", {
    //           year: "numeric",
    //           month: "numeric",
    //           day: "numeric",
    //         })}
    //       </div>
    //     );
    //   },
    // },
    // {
  ];
  const router = useRouter();
  const { toast } = useToast();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [openRowDrawer, setOpenRowDrawer] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const [formData, setFormData] = useState<any>({
    id: "",
    name: null,
    eighth: null,
    q: null,
    half: null,
    oz: null,
    qp: null,
    hp: null,
    p: null,
    category: null,
    weight_in_stock: 0,
    total_order_count: 0,
    total_lb_sold: 0,
    // description: null,
    // strain: null,
    // in_stock: null,
    // supplier: null,

    // Add other form fields here if needed
  });
  const { user, secureAccess, loading, error } = useSelector(
    (state: RootState) => state.user
  );

  const handleDeleteProducts = async () => {
    try {
      let productIds = [];
      for (const i in table.getFilteredSelectedRowModel().rows) {
        let rawData = table.getFilteredSelectedRowModel().rows[i]
          .original as any;
        productIds.push(rawData.id as string);
      }

      const res = await fetch("/api/products", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productIds),
      });
      if (res.ok) {
        setOpenDeleteDialog(false);
        fetchUserAndFlower();
        table.resetRowSelection();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserAndFlower = async () => {
    setRefreshing(true);
    const supabase = createClient();
    if (!user) {
      router.push("/");
    } else if (!secureAccess) {
      router.push("/verified");
    }

    sessionStorage.clear();

    // probably need to configure a manual reload to allow admin to request that the
    // data be refetched ("reload button")
    // otherwise no point because if multiple admin users make changes, changes wont reflect
    // const savedData = sessionStorage.getItem(product);
    // if (savedData && JSON.parse(savedData).length > 0) {
    //   const parsedData = JSON.parse(savedData);
    //   setData(parsedData);
    //   return;
    // }

    const { data, error: fetchProductError } = await supabase
      .from("products")
      .select()
      .filter("category", product === "flower" ? "eq" : "neq", "flower");
    if (data) {
      const jsonString = JSON.stringify(data);
      const sizeInBytes = new TextEncoder().encode(jsonString).length;
      const sizeInMB = sizeInBytes / (1024 * 1024);
      if (sizeInMB <= 2.5) {
        sessionStorage.setItem(product, JSON.stringify(data));
      }
    }
    if (fetchProductError) {
      console.warn(fetchProductError);
    } else {
      setData(data);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    fetchUserAndFlower();
  }, []);
  const memoizedData = useMemo(() => data, [data]);

  const table = useReactTable({
    data: memoizedData,
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
    if (!formData.category) {
      formData.category = "flower";
    }
    if (!formData.name) {
      toast({
        title: "Please include a product name",
        description: (
          <ul>
            {/* <li>Customer: {paymentInfo.telegramName}</li>
            <li>Total: ${paymentInfo.amountPaid}</li> */}
          </ul>
        ),
        // action: <ToastAction altText="Order submitted">Undo</ToastAction>,
      });
      return;
    } else {
      formData.name = formData.name.toLowerCase();
    }
    if (!formData.id) {
      delete formData["id"];
    }
    try {
      const res = await fetch("/api/products", {
        method: formData.id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        fetchUserAndFlower();
        clearFormData();
        setOpenRowDrawer(false);
      } else if (data.error) {
        toast({
          title: data.error,
          description: (
            <ul>
              "{formData.name}"
              {/* <li>Customer: {paymentInfo.telegramName}</li>
              <li>Total: ${paymentInfo.amountPaid}</li> */}
            </ul>
          ),
          // action: <ToastAction altText="Order submitted">Undo</ToastAction>,
        });
      }
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleFormValueChange = (e: any) => {
    const { name, value } = e.target;
    debounceSetFormData(name, value);
  };
  const handleCategoryValueChange = (category: string) => {
    setFormData((prev: any) => ({ ...prev, category }));
  };
  // Debounce function
  const debounceSetFormData = useCallback(
    debounce((name, value) => {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }, 300),
    []
  ); // Adjust debounce time as necessary

  const clearFormData = () => {
    setFormData({
      id: null,
      name: null,
      eighth: null,
      q: null,
      half: null,
      oz: null,
      qp: null,
      hp: null,
      p: null,
      category: "flower",
      weight_in_stock: 0,
      total_order_count: 0,
      total_lb_sold: 0,
    });
  };
  const handleOpenDrawer = async (rowData: any) => {
    setFormData({
      id: rowData.id,
      name: rowData.name,
      // description: rowData.description,
      // strain: rowData.strain,
      // in_stock: rowData.in_stock,
      category: rowData.category ? rowData.category : "flower",
      // pricing_options: rowData.pricing_options,
      // supplier: rowData.supplier || "",
      eighth: rowData.eighth,
      q: rowData.q,
      half: rowData.half,
      oz: rowData.oz,
      qp: rowData.qp,
      hp: rowData.hp,
      p: rowData.p,
      weight_in_stock: rowData.weight_in_stock,
      total_order_count: rowData.total_order_count,
      total_lb_sold: rowData.total_lb_sold,
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
    <main className="md:pr-6">
      {/* <div>
          <h1>Upload CSV</h1>
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <button onClick={handleSubmit}>Submit to Supabase</button>
        </div> */}
      <div className="flex justify-between py-4 pr-2 md:pr-0">
        <section className="h-fit">
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Inventory: {product.toUpperCase()}
          </h2>
          <div className="flex gap-2">
            <Input
              placeholder="Filter by name..."
              value={
                (table.getColumn("name")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm ring-0"
            />
            <Button
              className=""
              onClick={() => fetchUserAndFlower()}
              disabled={refreshing}
            >
              {refreshing ? "Refreshing" : "Refresh"}
              <RefreshCw className="w-[20px] pl-1" />
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            {/* <RadioGroup
              value={selectedValue} // Controlled value for selected radio
              className="gap-0"
              onValueChange={(value) => {
                setSelectedValue(value); // Update the state to track the selected radio button
                table.getColumn("strain")?.setFilterValue(value); // Apply filtering based on the selected value
              }}
            >
              {[
                { label: "All", value: "" },
                { label: "Sativa", value: "sativa" },
                { label: "Indica", value: "indica" },
                { label: "Hybrid", value: "hybrid" },
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
            </RadioGroup> */}
          </div>
        </section>
        <section className="flex flex-col gap-2">
          <Button
            onClick={() => {
              setOpenRowDrawer(true);
              setSelectedRow([]);
            }}
            className="px-2 h-fit  border border-accent"
          >
            Add New
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
                    // className="cursor-pointer hover:bg-background "
                    // onClick={() => {
                    //   handleOpenDrawer(row.original);
                    // }}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, i: number) => (
                      <TableCell
                        key={cell.id}
                        className={
                          i > 1 ? "cursor-pointer hover:bg-background" : ""
                        }
                        onClick={() => {
                          if (i > 1) {
                            handleOpenDrawer(row.original);
                          }
                        }}
                      >
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
            clearFormData();
          }
          setOpenRowDrawer(open);
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <form className="overflow-y-scroll ">
              <DrawerTitle asChild>
                <p className="text-muted-foreground text-base p-1">
                  {/* ID: {selectedRow.id} */}
                </p>
              </DrawerTitle>
              <DrawerDescription asChild className="">
                <div className="flex py-10 ">
                  {/* <div className="flex flex-col gap-1 w-[500px]"> */}
                  {columns.map((column: any, index: number) => {
                    if (index == 0) {
                      return;
                    }
                    const columnKey = column.accessorKey;
                    const columnValue = selectedRow[columnKey]; // Fetch the corresponding row data

                    // Generate inputs dynamically for editable fields
                    if (columnKey == "category") {
                      return (
                        <div
                          key={`${columnKey}-${index}`}
                          className="flex flex-col justify-end grow"
                        >
                          <Label
                            htmlFor="category"
                            className="text-foreground pr-4 pl-1 "
                          >
                            Category
                          </Label>
                          {/* <select
                            name="category"
                            required
                            defaultValue={columnValue || ""}
                            onChange={handleFormValueChange}
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                          >
                            <option value="flower">Flower</option>
                            <option value="edible">Edible</option>
                            <option value="vape">Vape</option>
                            <option value="concentrate">Concentrate</option>
                          </select> */}
                          <Select
                            value={formData.category!}
                            onValueChange={handleCategoryValueChange} // update state on change
                          >
                            <SelectTrigger className="w-[180px] mt-1 border border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="">
                              <SelectItem value="flower">Flower</SelectItem>
                              <SelectItem value="edible">Edible</SelectItem>
                              <SelectItem value="vape">Vape</SelectItem>
                              <SelectItem value="concentrate">
                                Concentrate
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={`${columnKey}-${index}`}
                        className={`flex flex-col justify-end grow ${columnKey == "name" && "min-w-[150px]"} ${index >= 3 && index <= 9 && "max-w-[140px]"}`}
                      >
                        {/* Label for the input */}
                        <Label
                          htmlFor={columnKey}
                          className="text-foreground text-sm lg:text-md pl-1"
                        >
                          {/* let key = product == "flower" ? "total_lb_sold" : "total_units_sold"; */}

                          {columnKey == "total_order_count"
                            ? "Total Orders"
                            : columnKey == "total_lb_sold"
                              ? "Sold (lbs)"
                              : columnKey == "total_units_sold"
                                ? "Sold (units)"
                                : columnKey == "total_revenue"
                                  ? "Total Rev ($)"
                                  : column.header}
                        </Label>
                        {/* Input field */}
                        <Input
                          type="text"
                          id={columnKey}
                          name={columnKey}
                          defaultValue={columnValue || ""}
                          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm p-2 min-w-[80px]"
                          onChange={handleFormValueChange}
                        />
                      </div>
                    );
                  })}
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
            <Button onClick={handleProductSubmit} className="flex-1">
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <section className="flex items-center justify-end space-x-2 ">
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
      </section>
      <Dialog
        open={openDeleteDialog}
        onOpenChange={(open) => {
          if (!open) {
            clearFormData();
          }
          setOpenDeleteDialog(open);
        }}
      >
        <DialogTrigger asChild>
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              // onClick={() =>
              //   console.log(table.getFilteredSelectedRowModel().rows.length)
              // }
              className="bg-red-500 hover:bg-red-600 mt-1 text-white"
            >
              Delete {table.getFilteredSelectedRowModel().rows.length}{" "}
              product(s)
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm deletion of{" "}
              {table.getFilteredSelectedRowModel().rows.length} product(s){" "}
            </DialogTitle>
            <DialogDescription>
              This action is <span className="text-red-600">permanent</span> and
              can not be undone.
              <Button
                onClick={handleDeleteProducts}
                className="w-full block mt-2 bg-red-600 hover:bg-red-500"
              >
                Confirm
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
