import { FormEvent, useState } from "react";
import useProductContext from "@hooks/useProductContext.ts";
import useUIContext from "@hooks/useUIContext.ts";

type Props = {
  onFiltersChange: ({
    categorySlugs,
    brands,
    minPrice,
    maxPrice,
  }: {
    categorySlugs: string[];
    brands: string[];
    minPrice: number | null;
    maxPrice: number | null;
  }) => void;
  initialCategorySlugs: string[];
  initialBrands: string[];
  onSidebarClose: () => void;
};

const FilterSidebarContent = ({
  onFiltersChange,
  initialBrands,
  initialCategorySlugs,
  onSidebarClose,
}: Props) => {
  const { showToast } = useUIContext();

  const categories = useProductContext().state.filters.categories;
  const brands = useProductContext().state.filters.popularBrands;

  const [selectedCategorySlugs, setSelectedCategorySlugs] =
    useState<string[]>(initialCategorySlugs);

  const [selectedBrands, setSelectedBrands] = useState<string[]>(initialBrands);

  const [showAllCategories, setShowAllCategories] = useState(true);
  const [showAllBrands, setShowAllBrands] = useState(false);

  const MAX_VISIBLE_CATEGORIES = 2;
  const MAX_VISIBLE_BRANDS = 5;

  const handleParentCategoryChange = (
    parentSlug: string,
    childSlugs: string[],
  ) => {
    const isParentChecked = selectedCategorySlugs.includes(parentSlug);
    if (isParentChecked) {
      setSelectedCategorySlugs((prev) =>
        prev.filter(
          (slug) => slug !== parentSlug && !childSlugs.includes(slug),
        ),
      );
    } else {
      setSelectedCategorySlugs((prev) => [
        ...new Set([...prev, parentSlug, ...childSlugs]),
      ]);
    }
  };

  const handleChildCategoryChange = (
    childSlug: string,
    parentSlug: string,
    allChildSlugs: string[],
  ) => {
    const isChildChecked = selectedCategorySlugs.includes(childSlug);

    if (isChildChecked) {
      setSelectedCategorySlugs((prev) => {
        const updatedSelection = prev.filter((slug) => slug !== childSlug);
        const hasSelectedChild = allChildSlugs.some((slug) =>
          updatedSelection.includes(slug),
        );
        return hasSelectedChild
          ? updatedSelection
          : updatedSelection.filter((slug) => slug !== parentSlug);
      });
    } else {
      setSelectedCategorySlugs((prev) => [...prev, childSlug]);
      const selectedChildSlugs = allChildSlugs.filter((slug) =>
        selectedCategorySlugs.includes(slug),
      );
      if (selectedChildSlugs.length + 1 === allChildSlugs.length) {
        setSelectedCategorySlugs((prev) => [...prev, parentSlug]);
      }
    }
  };

  const handleToggleBrandsChange = (brand: string) => {
    setSelectedBrands((prevState) =>
      prevState.includes(brand)
        ? prevState.filter((b) => b !== brand)
        : [...prevState, brand],
    );
  };

  const toggleShowAllCategories = () => {
    setShowAllCategories((prev) => !prev);
  };

  const toggleShowAllBrands = () => {
    setShowAllBrands((prev) => !prev);
  };

  const handleFilterFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const minPrice = parseInt(formData.get("minPrice") as string) || null;
    const maxPrice = parseInt(formData.get("maxPrice") as string) || null;

    if (
      typeof minPrice === "number" &&
      typeof maxPrice === "number" &&
      minPrice > maxPrice
    ) {
      showToast(
        "error",
        "Minimum price cannot be greater than the maximum price!",
      );
      return;
    }

    onSidebarClose();

    onFiltersChange({
      categorySlugs: selectedCategorySlugs,
      brands: selectedBrands,
      minPrice,
      maxPrice,
    });
  };

  const handleResetForm = () => {
    setSelectedBrands([]);
    setSelectedCategorySlugs([]);
  };

  return (
    <div className="h-screen overflow-y-auto">
      <form
        onSubmit={handleFilterFormSubmit}
        id="filter"
        method="get"
        className="flex flex-col p-4"
        aria-labelledby="filter"
      >
        <div className="flex items-center justify-between">
          <h5
            id="filter"
            className="text-base font-bold text-blue-600 uppercase"
          >
            Apply filters
          </h5>
        </div>

        <div className="flex flex-col gap-8 justify-between">
          <div className="space-y-6">
            {/* Categories */}
            <div className="space-y-2">
              <h6 className="text-base font-medium text-black ">Categories</h6>
              {categories
                .slice(
                  0,
                  showAllCategories
                    ? categories.length
                    : MAX_VISIBLE_CATEGORIES,
                )
                .map((category) => {
                  const childSlugs =
                    category.children?.map((child) => child.slug) || [];

                  return (
                    <div key={category._id} className="mb-2">
                      {/* Parent Category */}
                      <div className="flex items-center font-bold">
                        <input
                          id={category._id}
                          type="checkbox"
                          checked={selectedCategorySlugs.includes(
                            category.slug,
                          )}
                          onChange={() =>
                            handleParentCategoryChange(
                              category.slug,
                              childSlugs,
                            )
                          }
                          className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={category._id}
                          className="ml-2 text-sm text-gray-900 capitalize"
                        >
                          {category.name}
                        </label>
                      </div>

                      {/* Child Categories */}
                      {category.children && category.children.length > 0 && (
                        <div className="ml-4">
                          {category.children.map((child) => (
                            <div key={child._id} className="flex items-center">
                              <input
                                id={child._id}
                                type="checkbox"
                                checked={selectedCategorySlugs.includes(
                                  child.slug,
                                )}
                                onChange={() =>
                                  handleChildCategoryChange(
                                    child.slug,
                                    category.slug,
                                    childSlugs,
                                  )
                                }
                                className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                              />
                              <label
                                htmlFor={child._id}
                                className="ml-2 text-sm text-gray-700 capitalize"
                              >
                                {child.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

              {/* View All / View Less Button for Categories */}
              <button
                type="button"
                onClick={toggleShowAllCategories}
                className="flex items-center text-sm font-medium text-blue-600 hover:underline"
              >
                {showAllCategories ? "View Less" : "View All"}
              </button>
            </div>
            {/* Brands */}
            <div className="space-y-2">
              <h6 className="text-base font-medium text-black ">Brands</h6>

              {brands
                .slice(0, showAllBrands ? brands.length : MAX_VISIBLE_BRANDS)
                .map((brand) => (
                  <div key={brand} className="flex items-center">
                    <input
                      id={brand}
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleToggleBrandsChange(brand)}
                      className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={brand}
                      className="ml-2 text-sm text-gray-700 capitalize"
                    >
                      {brand}
                    </label>
                  </div>
                ))}

              <button
                type="button"
                onClick={toggleShowAllBrands}
                className="flex items-center text-sm font-medium text-blue-600 hover:underline"
              >
                {showAllBrands ? "View Less" : "View All"}
              </button>
            </div>
            {/* Prices */}
            <div className="space-y-2">
              <div className="flex items-center justify-between col-span-2 space-x-3">
                <div className="w-full">
                  <label
                    htmlFor="price-from"
                    className="block mb-2 text-sm font-medium text-gray-900 capitalize"
                  >
                    min price
                  </label>
                  <input
                    type="number"
                    name="minPrice"
                    id="price-from"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  />
                </div>
                <div className="w-full">
                  <label
                    htmlFor="price-to"
                    className="block mb-2 text-sm font-medium text-gray-900 capitalize"
                  >
                    max price
                  </label>
                  <input
                    type="number"
                    name="maxPrice"
                    id="price-to"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blueblue-500 block w-full p-2.5"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-auto p-4">
          <button
            type="submit"
            className="w-full px-5 py-2 text-sm font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Apply filters
          </button>
          <button
            type="button"
            className="w-full px-5 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
            onClick={handleResetForm}
          >
            Clear all
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterSidebarContent;
