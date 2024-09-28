import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
export const PaymentOptions = {
  cash: ["additionalDetails"],
  venmo: ["venmoUsername", "additionalDetails"],
  zelle: ["zelleName", "zelleNumber", "additionalDetails"],
  paypal: [
    // "amountPaid",
    "paypalEmail",
    "paypalName",
    "paypalTransactionId",
    "additionalDetails",
  ],
  crypto: [
    // "amountPaid",
    "cryptoType",
    "walletAddress",
    "transactionHash",
    "additionalDetails",
  ],
  other: ["otherDetails"],
};

export const PaymentForm = ({
  paymentType,
  handleFormValueChange,
  formData,
}: {
  paymentType: string;
  formData: any;
  handleFormValueChange: any;
}) => {
  const paymentFields =
    PaymentOptions[paymentType as keyof typeof PaymentOptions];

  if (!paymentFields) {
    return <p>Please select a valid order method.</p>;
  }

  return (
    <form>
      {paymentFields.map((field) => {
        if (field == "additionalDetails") {
          return (
            <Label key={field}>
              {field.charAt(0).toUpperCase() +
                field.slice(1).replace(/([A-Z])/g, " $1")}
              :
              <Textarea
                key={field}
                name="additionalDetails"
                onChange={handleFormValueChange}
                value={formData[field] || ""}
                placeholder="Enter any additional details..."
              />
            </Label>
          );
        }
        return (
          <Label key={field}>
            {field.charAt(0).toUpperCase() +
              field.slice(1).replace(/([A-Z])/g, " $1")}
            :
            <Input
              type="text"
              name={field}
              placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
              onChange={handleFormValueChange}
              value={formData[field] || ""}
            />
          </Label>
        );
      })}
    </form>
  );
};

export const OrderMethods = {
  pickup: ["pickupLocation", "additionalDetails"],
  delivery: ["deliveryAddress", "additionalDetails"],
  shipping: [
    "shippingName",
    "shippingAddress",
    "shippingCarrier",
    "trackingNumber",
    "additionalDetails",
  ],
};

export const OrderForm = ({
  orderMethod,
  handleFormValueChange,
  formData,
}: {
  orderMethod: string;
  formData: any;
  handleFormValueChange: any;
}) => {
  const orderFields = OrderMethods[orderMethod as keyof typeof OrderMethods];

  if (!orderFields) {
    return <p>Please select a valid order method.</p>;
  }

  return (
    <form>
      {orderFields.map((field) => {
        if (field == "additionalDetails") {
          return (
            <Label key={field}>
              {field.charAt(0).toUpperCase() +
                field.slice(1).replace(/([A-Z])/g, " $1")}
              :
              <Textarea
                key={field}
                name="additionalDetails"
                onChange={handleFormValueChange}
                value={formData[field] || ""}
                placeholder="Enter any additional details..."
              />
            </Label>
          );
        }
        return (
          <Label key={field}>
            {field.charAt(0).toUpperCase() +
              field.slice(1).replace(/([A-Z])/g, " $1")}
            :
            <Input
              type="text"
              name={field}
              placeholder={`Enter ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
              onChange={handleFormValueChange}
              value={formData[field] || ""}
            />
          </Label>
        );
      })}
    </form>
  );
};
