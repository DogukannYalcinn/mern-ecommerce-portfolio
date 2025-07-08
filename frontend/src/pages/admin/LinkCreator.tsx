import useProductContext from "@hooks/useProductContext.ts";
import { useEffect, useState } from "react";

type Props = {
  onChange: (url: string) => void;
};

const LinkCreator = ({ onChange }: Props) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const { categories, popularBrands } = useProductContext().state.filters;

  const allCategorySlugs: string[] = [
    ...categories.map((cat) => cat.slug),
    ...categories.flatMap((cat) => cat.children.map((child) => child.slug)),
  ];

  const hasSelection =
    selectedCategories.length > 0 || selectedBrands.length > 0;

  // URL logic
  const url = hasSelection
    ? "/products?" +
      (selectedCategories.length
        ? `categorySlugs=${selectedCategories.join(",")}`
        : "") +
      (selectedBrands.length
        ? (selectedCategories.length ? "&" : "") +
          `brands=${selectedBrands.join(",")}`
        : "")
    : "";

  useEffect(() => {
    onChange?.(url);
  }, [url, onChange]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val && !selectedCategories.includes(val)) {
      setSelectedCategories((prev) => [...prev, val]);
    }
  };

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val && !selectedBrands.includes(val)) {
      setSelectedBrands((prev) => [...prev, val]);
    }
  };

  const removeCategory = (val: string) =>
    setSelectedCategories(selectedCategories.filter((slug) => slug !== val));
  const removeBrand = (val: string) =>
    setSelectedBrands(selectedBrands.filter((brand) => brand !== val));

  return (
    <div className="space-y-4">
      {/* CATEGORY SELECT */}
      <div>
        <label className="block mb-1 font-semibold">Select Category</label>
        <select
          className="rounded-lg border-2 border-blue-300 focus:outline-none focus:border-blue-500  py-2 px-3 w-full "
          value=""
          onChange={handleCategoryChange}
        >
          <option value="" disabled>
            Choose a category...
          </option>
          {allCategorySlugs
            .filter((slug) => !selectedCategories.includes(slug))
            .map((slug) => (
              <option key={slug} value={slug}>
                {slug}
              </option>
            ))}
        </select>
        {/* Selected Categories */}
        <div className="flex gap-2 flex-wrap mt-3">
          {selectedCategories.map((slug) => (
            <div
              key={slug}
              className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {slug}
              <button
                className="ml-2 text-blue-600 hover:text-red-500 font-bold"
                onClick={() => removeCategory(slug)}
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BRAND SELECT */}
      <div>
        <label className="block mb-1 font-semibold">Select Brand</label>
        <select
          className="rounded-lg border-2 border-green-300 py-2 px-3 w-full focus:outline-none focus:border-green-500"
          value=""
          onChange={handleBrandChange}
        >
          <option value="" disabled>
            Choose a brand...
          </option>
          {popularBrands
            .filter((brand) => !selectedBrands.includes(brand))
            .map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
        </select>
        {/* Selected Brands */}
        <div className="flex gap-2 flex-wrap mt-3">
          {selectedBrands.map((brand) => (
            <div
              key={brand}
              className="flex items-center bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
            >
              {brand}
              <button
                className="ml-2 text-green-600 hover:text-red-500 font-bold"
                onClick={() => removeBrand(brand)}
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* URL Preview */}
      <div className="pt-4">
        <label className="block mb-2 font-semibold text-gray-700">
          Resulting Link:
        </label>
        <div className="bg-gray-100 rounded-lg p-3 text-gray-800 font-mono break-all select-all">
          {url || "/products?"}
        </div>
      </div>
    </div>
  );
};

export default LinkCreator;
