"use client";
import * as React from "react";
import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function DialogComp({
  pricingOptions,
  productData,
  orderedItems,
  setOrderedItems,
  openDialog,
  setOpenDialog,
  orderTotal,
  setOrderTotal,
}: {
  orderTotal: number;
  setOrderTotal: any;
  openDialog: boolean;
  setOpenDialog: any;
  setOrderedItems: any;
  pricingOptions: any[];
  orderedItems: any[];
  productData: any;
}) {
  const [products, setProducts] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState<any>();
  const [optionQuantity, setOptionQuantity] = useState<any>(1);

  const handleSaveItem = async () => {
    let newItem = {
      id: productData.id,
      name: productData.name,
      category: productData.category,
      option_weight: selectedOption,
      option_cost: productData[selectedOption],
      quantity: optionQuantity,
      total_weight_in_lbs:
        productData.category == "flower"
          ? convertToPounds(selectedOption, optionQuantity)
          : 0,
      total_cost: productData[selectedOption] * optionQuantity,
    };

    setOrderTotal(
      (prevOrderTotal: number) =>
        productData[selectedOption] * optionQuantity + prevOrderTotal
    );
    console.log(newItem);
    // console.log(productData[selectedOption]);
    setOrderedItems([...orderedItems, newItem]);
    setOpenDialog(false);
    setOptionQuantity(1);
  };
  const convertToPounds = (unit: string, quantity: number) => {
    switch (unit.toLowerCase()) {
      case "eighth":
        return quantity / 128; // 1/8 oz = 1/128 lbs
      case "q": // quarter ounce
        return quantity / 64; // 1/4 oz = 1/64 lbs
      case "half": // half ounce
        return quantity / 32; // 0.5 oz = 1/32 lbs
      case "oz": // ounce
        return quantity / 16; // 1 oz = 1/16 lbs
      case "qp": // quarter pound
        return quantity / 4; // quarter pound = 1/4 lbs
      case "hp": // half pound
        return quantity / 2; // half pound = 1/2 lbs
      case "p": // half pound
        return quantity; // half pound = 1/2 lbs
      default:
        throw new Error(`Unknown unit: ${unit}`);
    }
  };
  return (
    <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{productData.name}</DialogTitle>
          <p>Price Variations</p>
          <DialogDescription>
            <RadioGroup
              value={selectedOption} // This tracks the selected option
              onValueChange={setSelectedOption} // Update the selected option
              className="flex flex-col gap-0"
            >
              {pricingOptions.map((option: string, i: number) => (
                <div
                  key={i}
                  onClick={() => setSelectedOption(option)}
                  className="flex items-center justify-between text-black py-3 px-1 rounded-md hover:bg-accent cursor-pointer"
                >
                  {/* Label for each radio item */}
                  <Label htmlFor={option}>{option.toUpperCase()}</Label>

                  {/* Radio item and price display */}
                  <section className="flex items-center gap-2">
                    <span>
                      ${productData[option]}/{option.toUpperCase()}
                    </span>
                    <RadioGroupItem
                      value={option}
                      id={option}
                      // className="p-2"
                    />
                  </section>
                </div>
              ))}
            </RadioGroup>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Input
            type="number"
            value={optionQuantity}
            onChange={(e) => setOptionQuantity(e.target.value)}
          />
          <Button
            className="bg-green-500 hover:bg-green-600"
            onClick={handleSaveItem}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
