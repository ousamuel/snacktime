"use client";
import * as React from "react";
import { useEffect, useState, ReactElement } from "react";
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
  DialogFooter,
  DialogClose,
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
import { OrderMethods } from "../OrderPaymentFields";
import { PaymentForm } from "../OrderPaymentFields";
import { OrderForm } from "../OrderPaymentFields";
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
    accessorKey: "telegram_name",
    header: "Telegram Name",
    cell: ({ row }) => <div>{row.getValue("telegram_name")}</div>,
  },
  {
    accessorKey: "ordered_items", // Assuming this contains an array of items
    header: "Ordered Items",
    cell: ({ row }) => {
      const orderedItems = row.getValue("ordered_items");
      return (
        <div>
          {orderedItems && Array.isArray(orderedItems) ? (
            <ul>
              {orderedItems.map((item, index) => (
                <li
                  key={index}
                  className={
                    index > 0 ? "border-t border-foreground mt-1 pt-1" : ""
                  }
                >
                  <p
                    className={`font-bold min-w-fit whitespace-nowrap rounded-sm flex items-end`}
                  >
                    <span
                      className={`text-2xl mr-1 leading-none ${
                        item.category.toLowerCase() === "flower"
                          ? "text-green-500"
                          : item.category.toLowerCase() === "vape"
                            ? "text-blue-500"
                            : item.category.toLowerCase() === "concentrate"
                              ? "text-orange-500"
                              : item.category.toLowerCase() === "edible"
                                ? "text-purple-500"
                                : "text-gray-500"
                      }`}
                    >
                      •
                    </span>
                    {item.name} - ${item.total_cost.toFixed(2)}
                  </p>
                  <p>
                    - Pricing: ${item.option_cost}/
                    {item.option_weight == "eighth"
                      ? "8th"
                      : item.option_weight}{" "}
                  </p>
                  <p>• Quantity: {item.quantity}</p>
                </li>
              ))}
            </ul>
          ) : (
            <span>No items</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "amount_paid", // If you have pricing data
    header: "Amount Paid",
    cell: ({ row }) => {
      const pricing = parseFloat(row.getValue("amount_paid"));
      return pricing ? `$${pricing.toFixed(2)}` : "N/A";
    },
  },
  {
    accessorKey: "order_method_details", // If you have pricing data
    header: "Order Method Details",
    cell: ({ row }) => {
      const splitCamelCase = (key: string) => {
        return key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
      };

      const orderMethodDetails: any = row.getValue("order_method_details");

      return (
        <div>
          {orderMethodDetails ? (
            <ul>
              {Object.keys(orderMethodDetails)
                .filter(
                  (key) => true
                  // key !== "paymentType" &&
                  // key !== "amountPaid" &&
                  // key !== "telegramName"
                )
                .map((key: any, index: number) => {
                  return (
                    <li key={index} className="min-w-[150px]">
                      <span className="font-bold">{splitCamelCase(key)}</span>:{" "}
                      {orderMethodDetails[key]}
                    </li>
                  );
                })}
            </ul>
          ) : (
            <span>No payment details</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "payment_details", // If you have pricing data
    header: "Payment Details",
    cell: ({ row }) => {
      const splitCamelCase = (key: string) => {
        return key
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (str) => str.toUpperCase());
      };

      const paymentDetails: any = row.getValue("payment_details");
      const validKeys = Object.keys(paymentDetails).filter(
        (key) =>
          key !== "paymentType" &&
          key !== "amountPaid" &&
          key !== "telegramName"
      );
      return (
        <div>
          {paymentDetails ? (
            <ul>
              {validKeys.length > 0 ? (
                validKeys.map((key: any, index: number) => {
                  return (
                    <li key={index} className="min-w-[150px]">
                      <span className="font-bold">{splitCamelCase(key)}</span>:{" "}
                      {paymentDetails[key].length > 1
                        ? paymentDetails[key]
                        : "- -"}
                    </li>
                  );
                })
              ) : (
                <span>No additional details</span>
              )}
            </ul>
          ) : (
            <span>No payment details</span>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "payment_type", //
    header: "Payment Type",
    cell: ({ row }) => (
      <div
        className={`px-2 py-1 rounded text-white text-sm ${
          row.getValue("payment_type") === "cash"
            ? "bg-green-500"
            : row.getValue("payment_type") === "venmo"
              ? "bg-blue-500"
              : row.getValue("payment_type") === "zelle" ||
                  row.getValue("payment_type") === "paypal"
                ? "bg-purple-500"
                : row.getValue("payment_type") === "crypto"
                  ? "bg-yellow-500"
                  : "bg-gray-500"
        }`}
      >
        {(row.getValue("payment_type") as string).toUpperCase()}
      </div>
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Order Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const lastUpdated = new Date(row.getValue("created_at"));
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
  
  // {
  //   accessorKey:""
  // }
];

export default function OrderTableComp() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<any[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>({});
  const [formData, setFormData] = useState({
    id: "",
    created_at: "",
    telegram_name: "",
    order_method: "",
    payment_type: "",
    amount_paid: "",
    payment_details: {},
    ordered_items: [],
    order_method_details: {},
  });
  const [paymentDetailsState, setPaymentDetailsState] = useState<any>({});
  const { user, secureAccess, loading, error } = useSelector(
    (state: RootState) => state.user
  );

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

    try {
      const res = await fetch("/api/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.ok) {
        setData(
          data.data.sort((a: any, b: any) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return dateB.getTime() - dateA.getTime();
          })
        );
      } else {
        console.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    // const { data, error: fetchOrdersError } = await supabase
    //   .from("orders")
    //   .select();

    // if (data) {
    //   const jsonString = JSON.stringify(data);
    //   const sizeInBytes = new TextEncoder().encode(jsonString).length;
    //   const sizeInMB = sizeInBytes / (1024 * 1024);
    //   if (sizeInMB <= 2.5) {
    //     sessionStorage.setItem("orders", JSON.stringify(data));
    //   }
    //   console.log(sessionStorage);
    // }
    // if (fetchOrdersError) {
    //   console.warn(fetchOrdersError);
    // } else {
    //   console.log(data);
    //   setData(data);
    // }
  };
  useEffect(() => {
    sessionStorage.clear();
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

  const clearFormData = () => {
    setFormData({
      id: "",
      created_at: "",
      telegram_name: "",
      order_method: "",
      payment_type: "",
      amount_paid: "",
      payment_details: {},
      ordered_items: [],
      order_method_details: {},
    });
  };
  const handleOpenDrawer = async (rowData: any) => {
    setFormData(rowData);
    // setOpenDialog(true);
  };
  const handleEditOrders = async (e: any) => {};

  const handleDeleteOrders = async () => {
    try {
      let orderIds = [];
      for (const i in table.getFilteredSelectedRowModel().rows) {
        let rawData = table.getFilteredSelectedRowModel().rows[i]
          .original as any;
        orderIds.push(rawData.id as string);
      }

      const res = await fetch("/api/orders", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderIds),
      });
      if (res.ok) {
        setOpenDeleteDialog(false);
        fetchUserAndOrders();
        table.resetRowSelection();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const convertToLocaleDate = (date: string) => {
    const createdAt = new Date(date);
    return createdAt.toLocaleDateString("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  };
  const renderPaymentDetails = (paymentType: string): ReactElement => {
    switch (paymentType) {
      case "cash":
        return (
          <div>
            <Label>
              <Input
                type="text"
                name="pickupLocation"
                placeholder="Enter pickup location"
                onChange={handleFormValueChange}
                // value={formData.pickupLocation || ""}
              />
            </Label>
          </div>
        );
      case "venmo":
        return (
          <div>
            <Label>
              Venmo User/Email/Phone
              <Input
                type="text"
                name="pickupLocation"
                placeholder="Enter pickup location"
                onChange={handleFormValueChange}
                // value={formData.pickupLocation || ""}
              />
            </Label>
          </div>
        );
      // case "venmo":
      //   return
      default:
        return <div></div>;
    }
  };
  return (
    <main className="pr-6">
      <div className="flex justify-between py-4">
        <section>
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Orders
          </h2>
          <Input
            placeholder="Filter by telegram name..."
            value={
              (table.getColumn("telegram_name")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("telegram_name")
                ?.setFilterValue(event.target.value)
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
              {["latestFirst", "oldestFirst"].map((sortOption) => (
                <div
                  key={sortOption}
                  className="flex items-center gap-x-2 p-2 cursor-pointer hover:bg-background"
                  onClick={() => {
                    setSelectedValue(sortOption);
                    handleDataSort(sortOption);
                  }}
                >
                  <RadioGroupItem
                    value={sortOption}
                    checked={selectedValue === sortOption}
                  />
                  <Label htmlFor={sortOption}>{sortOption}</Label>
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
                    className=" "
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell, i: number) => (
                      <TableCell
                        key={cell.id}
                        // className={
                        //   i > 1 ? "cursor-pointer hover:bg-background" : ""
                        // }
                        // onClick={() => {
                        //   if (i > 1) {
                        //     handleOpenDrawer(row.original);
                        //   }
                        // }}
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
      <Dialog
        open={openDialog}
        onOpenChange={(open) => {
          if (!open) {
            clearFormData();
          }
          setOpenDialog(open);
        }}
      >
        <DialogContent className="min-w-[65vw]">
          <DialogHeader>
            <form
              id="inven-form-existing"
              className="min-h-[70vh] max-h-[70vh] overflow-y-scroll"
            >
              <DialogTitle className="flex flex-col pl-1">
                <p className="text-muted-foreground text-sm text-left">
                  Order ID: {formData.id}
                </p>
                <p className="text-muted-foreground text-sm">
                  Date: {convertToLocaleDate(formData.created_at)}
                </p>
              </DialogTitle>
              <DialogDescription
                asChild
                className="text-foreground order-dialog"
              >
                <div className="flex flex-col">
                  <section>
                    <Label htmlFor="telegram_name">Telegram Name</Label>
                    <Input
                      type="text"
                      name="telegram_name"
                      placeholder="Telegram Name"
                      value={formData.telegram_name}
                      onChange={handleFormValueChange}
                    />
                  </section>
                  <section>
                    <Label htmlFor="order_method">Order Method</Label>
                    <select
                      name="order_method"
                      required
                      value={formData.order_method}
                      onChange={handleFormValueChange}
                      className="border rounded p-2"
                    >
                      <option value="pickup">Pickup</option>
                      <option value="delivery">Delivery</option>
                      <option value="shipping">Shipping</option>
                    </select>
                  </section>
                  <section>
                    <Label htmlFor="payment_type">Payment Type</Label>
                    <select
                      name="payment_type"
                      required
                      value={formData.payment_type}
                      onChange={handleFormValueChange}
                      className="border rounded p-2"
                    >
                      <option value="cash">Cash</option>
                      <option value="zelle">Zelle</option>
                      <option value="venmo">Venmo</option>
                      <option value="paypal">Paypal</option>
                      <option value="crypto">Crypto</option>
                      <option value="other">Other</option>
                    </select>
                  </section>
                  {/* <section className="flex flex-col h-full">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      name="description"
                      placeholder="Product Description"
                      value={formData.description}
                      onChange={handleFormValueChange}
                      className="h-full border p-2 rounded-md"
                    />
                  </section> */}
                </div>
              </DialogDescription>
            </form>
          </DialogHeader>
          <DialogFooter className="flex flex-row">
            <DialogClose onClick={() => setOpenDialog(false)} asChild>
              <Button className="flex-1" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleOrderSubmit} className="flex-1">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <section className="flex items-center justify-end space-x-2 pt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          <div>
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s).
          </div>
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
              Delete {table.getFilteredSelectedRowModel().rows.length} order(s)
            </Button>
          )}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm deletion of{" "}
              {table.getFilteredSelectedRowModel().rows.length} order(s){" "}
            </DialogTitle>
            <DialogDescription>
              This action is <span className="text-red-600">permanent</span> and
              can not be undone.
              <Button
                onClick={handleDeleteOrders}
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
