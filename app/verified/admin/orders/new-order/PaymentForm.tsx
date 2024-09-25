import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type PaymentType = "cash" | "venmo" | "zelle" | "paypal" | "crypto" | "other";

const PaymentForm: any = ({
  paymentType,
  handleFormValueChangeChange,
  formData,
}: {
  paymentType: string;
  formData: any;
  handleFormValueChangeChange: any;
}) => {
  switch (paymentType) {
    case "cash":
      return (
        <form>
          <Label>
            Payment Completed:
            <Input
              type="checkbox"
              name="completed"
              onChange={handleFormValueChangeChange}
              checked={formData.completed || false}
            />
          </Label>
        </form>
      );
    case "venmo":
      return (
        <form>
          <Label>
            Venmo Username/Email:
            <Input
              type="text"
              name="venmoUsername"
              placeholder="Venmo Username or Email"
              onChange={handleFormValueChangeChange}
              value={formData.venmoUsername || ""}
            />
          </Label>
        </form>
      );
    case "zelle":
      return (
        <form>
          <Label>
            Zelle Phone Number:
            <Input
              type="tel"
              name="zelleNumber"
              placeholder="Zelle Phone Number"
              onChange={handleFormValueChangeChange}
              value={formData.zelleNumber || ""}
            />
          </Label>
          <Label>
            Zelle Name:
            <Input
              type="text"
              name="zelleName"
              placeholder="Full Name"
              onChange={handleFormValueChangeChange}
              value={formData.zelleName || ""}
            />
          </Label>
        </form>
      );
    case "paypal":
      return (
        <form>
          <Label>
            PayPal Email:
            <Input
              type="email"
              name="paypalEmail"
              placeholder="PayPal Email"
              onChange={handleFormValueChangeChange}
              value={formData.paypalEmail || ""}
            />
          </Label>
          <Label>
            PayPal Name:
            <Input
              type="text"
              name="paypalName"
              placeholder="Full Name"
              onChange={handleFormValueChangeChange}
              value={formData.paypalName || ""}
            />
          </Label>
          <Label>
            PayPal Transaction ID:
            <Input
              type="text"
              name="paypalTransactionId"
              placeholder="Transaction ID"
              onChange={handleFormValueChangeChange}
              value={formData.paypalTransactionId || ""}
            />
          </Label>
        </form>
      );
    case "crypto":
      return (
        <form>
          <Label className="">
            Crypto Type:
            <select
              name="cryptoType"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible: focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={handleFormValueChangeChange}
              value={formData.cryptoType || ""}
            >
              <option value="">Select</option>
              <option value="bitcoin">Bitcoin</option>
              <option value="ethereum">Ethereum</option>
              <option value="other">Other</option>
            </select>
          </Label>
          <Label>
            Wallet Address:
            <Input
              type="text"
              name="walletAddress"
              placeholder="Wallet Address"
              onChange={handleFormValueChangeChange}
              value={formData.walletAddress || ""}
            />
          </Label>
          <Label>
            Transaction Hash:
            <Input
              type="text"
              name="transactionHash"
              placeholder="Transaction Hash"
              onChange={handleFormValueChangeChange}
              value={formData.transactionHash || ""}
            />
          </Label>
        </form>
      );
    case "other":
      return (
        <form>
          <Label>
            Other Information:
            <textarea
              name="otherDetails"
              onChange={handleFormValueChangeChange}
              value={formData.otherDetails || ""}
            ></textarea>
          </Label>
        </form>
      );
    default:
      return <p>Please select a valid payment method.</p>;
  }
};

const PaymentMethodForm = ({
  paymentInfo,
  setPaymentInfo,
}: {
  paymentInfo: any;
  setPaymentInfo: any;
}) => {
  const [selectedPaymentType, setSelectedPaymentType] =
    useState<PaymentType>("cash");

  const [formData, setFormData] = useState<any>({});
  const [amountPaid, setAmountPaid] = useState<number>();

  const handleFormValueChangeChangeChange = (e: any) => {
    if (
      (selectedPaymentType == "crypto" && !formData.cryptoType) ||
      formData.cryptoType == ""
    ) {
      alert("need cryto type");
      //   temp fix to not assigning bitcoinc instantly
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setPaymentInfo({ ...paymentInfo, paymentDetails: formData });
  };
  const handlePaymentInfoChange = (e: any) => {
    setPaymentInfo({
      ...paymentInfo,
      [e.target.name]: e.target.value,
    });
  };
  const clearFormData = () => {
    setFormData({});
  };
  const handleFormSubmit = async () => {
    console.log(selectedPaymentType);

    console.log(formData);
  };
  return (
    <div className="flex gap-4 w-full justify-evenly mb-[200px] min-h-[60vh]">
      <section className="">
        <Label className="text-center pl-1">Payment Type</Label>
        <select
          value={selectedPaymentType}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible: focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          name="paymentType"
          onChange={(e) => {
            clearFormData();
            handlePaymentInfoChange(e);
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
          onChange={handlePaymentInfoChange}
          placeholder="Customer Telegram Name"
        />
        <Label>
          Amount paid ($): <span className="text-red-600">*</span>
          <Input
            type="number"
            name="amountPaid"
            onChange={handlePaymentInfoChange}
            placeholder="Amount Paid ($)"
          />
        </Label>{" "}
        <PaymentForm
          paymentType={selectedPaymentType}
          formData={formData}
          handleFormValueChangeChange={handleFormValueChangeChangeChange}
        />
      </section>
    </div>
  );
};

export default PaymentMethodForm;
