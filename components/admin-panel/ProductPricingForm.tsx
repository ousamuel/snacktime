import { Button } from "../ui/button";
import { Input } from "../ui/input";
interface PricingFormProps {
  pricingOptions: any[];
  setPricingOptions: any;
}
const PricingForm: React.FC<PricingFormProps> = ({
  pricingOptions,
  setPricingOptions,
}) => {
  // Handle change in pricing options
  const handleInputChange = (index: number, event: any) => {
    const { name, value } = event.target;
    const updatedPricingOptions = [...pricingOptions];
    updatedPricingOptions[index][name] = value;
    setPricingOptions(updatedPricingOptions);
  };

  // Add a new pricing option
  const handleAddOption = () => {
    setPricingOptions([
      ...pricingOptions,
      { unit_weight: "1/8", unit_type: "grams", price: "" },
    ]);
  };
  const handleAddCustomOption = () => {
    setPricingOptions([
      ...pricingOptions,
      { unit_weight: "", unit_type: "grams", price: "" },
    ]);
  };

  // Remove a pricing option
  const handleRemoveOption = (index: number) => {
    const updatedPricingOptions = pricingOptions.filter(
      (_: any, i: number) => i !== index
    );
    setPricingOptions(updatedPricingOptions);
  };

  const defaultWeights = ["1/8", "1/2", "1/4", "1.0"];
  return (
    <section id="pricing-options" className="flex flex-col gap-2">
      {/* Header row with labels */}
      <div className="flex gap-4 items-center font-bold">
        {/* <div className="flex flex-col gap-2">
          <span className="whitespace-nowrap">Unit Weight</span>
        </div>
        <div className="flex flex-col gap-2">
          <span>Type</span>
        </div>
        <div className="flex flex-col gap-2">
          <span>Price ($)</span>
        </div> */}

        {/* Spacer for alignment */}
        <div className="flex flex-col gap-2">
          <span className="invisible">Remove</span>
        </div>
      </div>

      {/* Pricing option rows */}
      {pricingOptions.map((option: any, index: number) => (
        <div key={index} className="flex gap-4 justify-evenly">
          <div className="flex flex-col gap-2">
            {defaultWeights.includes(option.unit_weight) ? (
              <select
                name="unit_weight"
                required
                value={option.unit_weight}
                onChange={(e) => handleInputChange(index, e)}
                className="border rounded p-2"
              >
                <option value="1/8">1/8</option>
                <option value="1/4">1/4</option>
                <option value="1/2">1/2</option>
                <option value="1.0">1</option>
              </select>
            ) : (
              <Input
                name="unit_weight"
                required
                value={option.unit_weight}
                onChange={(e) => handleInputChange(index, e)}
                className="w-[75px]"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <select
              name="unit_type"
              required
              value={option.unit_type}
              onChange={(e) => handleInputChange(index, e)}
              className="border rounded p-2"
            >
              <option value="grams">gram(s)</option>
              <option value="ounces">ounce(s)</option>
              <option value="pounds">pound(s)</option>
              <option value="pounds">unit(s)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Input
              name="price"
              type="number"
              required
              value={option.price}
              onChange={(e) => handleInputChange(index, e)}
              className="border rounded p-2"
            />
          </div>

          <button
            type="button"
            onClick={() => handleRemoveOption(index)}
            className="text-red-500 p-2"
          >
            Remove
          </button>
        </div>
      ))}
      <Button
        type="button"
        onClick={handleAddOption}
        className="text-blue-500 mt-4"
      >
        + Add Pricing Option
      </Button>
      <Button
        type="button"
        onClick={handleAddCustomOption}
        className="text-blue-500 mt-4"
      >
        + Add Custom Pricing Option
      </Button>
    </section>
  );
};

export default PricingForm;
