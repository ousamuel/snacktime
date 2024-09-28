import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PaymentForm } from "../OrderPaymentFields";
type PaymentType = "cash" | "venmo" | "zelle" | "paypal" | "crypto" | "other";
const PaymentMethodForm = ({
  paymentInfo,
  setPaymentInfo,
}: {
  paymentInfo: any;
  setPaymentInfo: any;
}) => {
  const [selectedPaymentType, setSelectedPaymentType] =
    useState<PaymentType>("cash");

  const handleFormValueChange = (e: any) => {
    const { name, value } = e.target;

    setPaymentInfo((prev: any) => ({
      ...prev,
      [name]: value,
      // paymentDetails: {
      //   ...prev.paymentDetails,
      //   [name]: value,
      // },
    }));
  };

  // Clear form data
  const clearFormData = () => {
    setPaymentInfo({
      paymentType: "cash",
      telegramName: paymentInfo.telegramName,
      amountPaid: paymentInfo.amountPaid,
    });
  };
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full justify-evenly mb-[200px] min-h-[60vh]">
      <section className="min-w-[170px]">
        <Label className="text-center pl-1">Payment Type</Label>
        <select
          value={selectedPaymentType}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible: focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          name="paymentType"
          onChange={(e) => {
            clearFormData();
            handleFormValueChange(e);
            setSelectedPaymentType(e.target.value as PaymentType);
          }}
        >
          <option value="cash">Cash</option>
          <option value="venmo">Venmo</option>
          <option value="zelle">Zelle</option>
          <option value="paypal">PayPal</option>
          <option value="crypto">Cryptocurrency</option>
          <option value="other">Other</option>
        </select>
      </section>

      <section className="payment-form grow">
        <Label>
          Telegram Name: <span className="text-red-600">*</span>
        </Label>{" "}
        <Input
          type="text"
          name="telegramName"
          value={paymentInfo.telegramName}
          onChange={handleFormValueChange}
          placeholder="Customer Telegram Name"
        />
        <Label>
          Amount paid ($): <span className="text-red-600">*</span>
          <Input
            type="number"
            name="amountPaid"
            value={paymentInfo.amountPaid}
            onChange={handleFormValueChange}
            placeholder="Amount Paid ($)"
          />
        </Label>{" "}
        <PaymentForm
          paymentType={selectedPaymentType}
          formData={paymentInfo}
          handleFormValueChange={handleFormValueChange}
        />
      </section>
    </div>
  );
};

export default PaymentMethodForm;
