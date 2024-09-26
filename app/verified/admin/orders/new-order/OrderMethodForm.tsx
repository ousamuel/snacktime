import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
type OrderMethod = "pickup" | "delivery" | "shipping";

const OrderForm: any = ({
  orderMethod,
  handleFormValueChange,
  formData,
}: {
  orderMethod: string;
  formData: any;
  handleFormValueChange: any;
}) => {
  switch (orderMethod) {
    case "pickup":
      return (
        <form>
          <Label>
            Pickup Location:
            <Input
              type="text"
              name="pickupLocation"
              placeholder="Enter pickup location"
              onChange={handleFormValueChange}
              value={formData.pickupLocation || ""}
            />
          </Label>
        </form>
      );
    case "delivery":
      return (
        <form>
          <Label>
            Delivery Address:
            <Input
              type="text"
              name="deliveryAddress"
              placeholder="Enter delivery address"
              onChange={handleFormValueChange}
              value={formData.deliveryAddress || ""}
            />
          </Label>
          
        </form>
      );
    case "shipping":
      return (
        <form>
          <Label>
            Shipping Address:
            <Input
              type="text"
              name="shippingAddress"
              placeholder="Enter shipping address"
              onChange={handleFormValueChange}
              value={formData.shippingAddress || ""}
            />
          </Label>
          <Label>
            Shipping Carrier:
            <Input
              type="text"
              name="shippingCarrier"
              placeholder="Enter shipping carrier (e.g., FedEx, UPS)"
              onChange={handleFormValueChange}
              value={formData.shippingCarrier || ""}
            />
          </Label>
          <Label>
            Tracking Number:
            <Input
              type="text"
              name="trackingNumber"
              placeholder="Enter tracking number"
              onChange={handleFormValueChange}
              value={formData.trackingNumber || ""}
            />
          </Label>
        </form>
      );
    default:
      return <p>Please select a valid order method.</p>;
  }
};

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
        <Label>
            Additional Instructions:
            <Textarea
              name="additionalInstructions"
              onChange={handleFormValueChange}
              value={orderMethodInfo.additionalInstructions}
              placeholder="Enter any additional instructions..."
            ></Textarea>
          </Label>
      </section>
    </div>
  );
};

export default OrderMethodForm;
