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
      { label: "Select", unit: "ounces", cost: "" },
    ]);
  };
  const handleAddCustomOption = () => {
    setPricingOptions([
      ...pricingOptions,
      { label: "", unit: "ounces", cost: "" },
    ]);
  };

  // Remove a pricing option
  const handleRemoveOption = (index: number) => {
    const updatedPricingOptions = pricingOptions.filter(
      (_: any, i: number) => i !== index
    );
    setPricingOptions(updatedPricingOptions);
  };

  const defaultLabels = ["Select", "1/8", "1/2", "1/4", "1.0"];
  return (
    <section id="pricing-options" className="flex flex-col gap-2">
      {/* Pricing option rows */}
      {pricingOptions &&
        pricingOptions.map((option: any, index: number) => (
          <div key={index} className="flex gap-4 justify-evenly">
            <div className="flex flex-col gap-2 w-1/6">
              {defaultLabels.includes(option.label) ? (
                <select
                  name="label"
                  required
                  value={option.label}
                  onChange={(e) => handleInputChange(index, e)}
                  className="border rounded p-2"
                >
                  {defaultLabels.map((label: string, i: number) => (
                    <option
                      key={i}
                      value={label}
                      disabled={pricingOptions.some(
                        (option) =>
                          option.label === label &&
                          option.unit === pricingOptions[index].unit
                      )}
                    >
                      {label == "1.0" ? "1" : label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  type="text"
                  name="label"
                  required
                  value={option.label}
                  onChange={(e) => handleInputChange(index, e)}
                  className=""
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <select
                name="unit"
                required
                value={option.unit}
                onChange={(e) => handleInputChange(index, e)}
                className="border rounded p-2"
              >
                <option value="grams">gram(s)</option>
                <option value="ounces">ounce(s)</option>
                <option value="pounds">pound(s)</option>
                <option value="units">unit(s)</option>
                <option value="boxes">units per box</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex rounded-md border px-2">
                <p className="flex items-center">$</p>
                <Input
                  className="border-0 py-0"
                  type="number"
                  name="cost"
                  placeholder="Cost"
                  value={option.cost}
                  min={1}
                  required
                  onChange={(e) => handleInputChange(index, e)}
                />
              </div>
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
        + Add Pricing Option (8th, Q, Half, 1)
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
