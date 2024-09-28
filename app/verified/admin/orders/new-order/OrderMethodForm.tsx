import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrderForm } from "../OrderPaymentFields";
type OrderMethod = "pickup" | "delivery" | "shipping";

const OrderMethodForm = ({
  orderMethodInfo,
  setOrderMethodInfo,
}: {
  orderMethodInfo: any;
  setOrderMethodInfo: any;
}) => {
  const [selectedOrderMethod, setSelectedOrderMethod] =
    useState<OrderMethod>("pickup");

  const handleFormValueChange = (e: any) => {
    const { name, value } = e.target;
    setOrderMethodInfo((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Clear form data
  const clearFormData = () => {
    setOrderMethodInfo({
      orderMethod: "pickup",
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full justify-evenly mb-2">
      <section className="min-w-[170px]">
        <Label className="text-center pl-1">Order Method</Label>
        <select
          value={selectedOrderMethod}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible: focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          name="orderMethod"
          onChange={(e) => {
            clearFormData();
            handleFormValueChange(e);
            setSelectedOrderMethod(e.target.value as OrderMethod);
          }}
        >
          <option value="pickup">Pickup</option>
          <option value="delivery">Delivery</option>
          <option value="shipping">Shipping</option>
        </select>
      </section>

      <section className="payment-form grow">
        <OrderForm
          orderMethod={selectedOrderMethod}
          formData={orderMethodInfo}
          handleFormValueChange={handleFormValueChange}
        />
      </section>
    </div>
  );
};

export default OrderMethodForm;
