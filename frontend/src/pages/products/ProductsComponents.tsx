import FilterIcon from "@icons/FilterIcon.tsx";
import ProductCartGrid from "@components/products/ProductCartGrid.tsx";
import { ProductType } from "@types";
import NoResults from "@components/ui/NoResults.tsx";
import useProductContext from "@hooks/useProductContext.ts";

type Props = {
  totalCount: number;
  products: ProductType[];
  handleChangeSortOption: (selectedValue: string) => void;
  handleLoadMore?: () => void;
  onSidebarOpen: () => void;
  selectedCategorySlugs: string[];
  selectedBrands: string[];
};

const ProductsComponents = ({
  totalCount,
  products,
  handleChangeSortOption,
  handleLoadMore,
  onSidebarOpen,
  selectedCategorySlugs,
  selectedBrands,
}: Props) => {
  const boostedProducts = useProductContext().state.products.boosted;

  const onChangeSortOption = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    handleChangeSortOption(selectedValue);
  };

  return (
    <>
      <section className="mx-auto max-w-7xl p-4 min-h-screen ">
        <div className="flex  flex-col gap-4">
          <div className="flex justify-between items-center border-b border-gray-200 pb-4">
            <h2 className="text-lg md:text-2xl font-semibold text-gray-800">
              Explore Our Products
            </h2>
            {totalCount > 0 && (
              <p className="text-sm text-gray-500 font-medium text-center">{`${totalCount} products found`}</p>
            )}
          </div>
          <div className="flex flex-col gap-3 mt-2">
            {selectedCategorySlugs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedCategorySlugs.map((slug) => (
                  <span
                    key={slug}
                    className="inline-block rounded-full bg-green-100 text-green-800 text-xs font-medium px-3 py-1"
                  >
                    {slug.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            )}
            {selectedBrands.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedBrands.map((brand) => (
                  <span
                    key={brand}
                    className="inline-block rounded-full bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:justify-end">
            <select
              id="sortOptions"
              onChange={onChangeSortOption}
              className="bg-gray-50 border border-gray-300 text-blue-800 text-sm font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5"
            >
              <option value="">Newest</option>
              <option value="discount">Discount</option>
              <option value="best_seller">Best Seller</option>
              <option value="price_asc">Increase Price</option>
              <option value="price_desc">Decrease Price</option>
            </select>

            <button
              className="bg-blue-500 text-white flex items-center justify-center gap-1 px-12 py-2 rounded-lg"
              onClick={onSidebarOpen}
            >
              <span>Filter</span>
              <FilterIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="mt-6">
          {products.length === 0 && (
            <>
              <NoResults
                title="no product found."
                subtitle="try adjusting your search or filters."
              />
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-700 mb-4 capitalize">
                  You may still like
                </h4>
                <ProductCartGrid products={boostedProducts} />
              </div>
            </>
          )}

          <ProductCartGrid products={products} />
          {handleLoadMore && (
            <div className="flex justify-center items-center p-4">
              <button
                className="px-8 py-2 bg-blue-700 rounded-lg text-white"
                onClick={handleLoadMore}
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
export default ProductsComponents;
