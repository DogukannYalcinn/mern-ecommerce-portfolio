import { ProductType } from "@types";
import ProductCartGrid from "@components/products/ProductCartGrid.tsx";
import HeartIcon from "@icons/HeartIcon.tsx";
import SmartSearchBox from "@components/ui/SmartSearchBox.tsx";
import useProductContext from "@hooks/useProductContext.ts";

type Props = {
  products: ProductType[];
  handleSearchTermsChange: (searchTerms: string) => void;
  handleLoadMore?: () => void;
  totalCount: number;
  isLoading: boolean;
};

const SearchProductsComponent = ({
  products,
  handleSearchTermsChange,
  handleLoadMore,
  totalCount,
  isLoading,
}: Props) => {
  const boostedProducts = useProductContext().state.products.boosted.slice(
    0,
    10,
  );
  return (
    <>
      <main className="mx-auto max-w-7xl p-6 min-h-screen ">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              Find Your Perfect Product
            </h2>
            {totalCount > 0 && (
              <p className="text-sm text-gray-500 font-medium">{`${totalCount} products found`}</p>
            )}
          </div>

          {/* SearchProductsPage Bar */}
          <SmartSearchBox
            suggestions={[]}
            handleSearchTermsChange={handleSearchTermsChange}
            isLoading={isLoading}
            defaultPlaceHolder={undefined}
          />
          {/* ProductsPage Grid */}
          <div className="mt-8">
            {products.length > 0 ? (
              <>
                <ProductCartGrid products={products} />
                {handleLoadMore && (
                  <div className="flex justify-center p-6">
                    <button
                      className="px-6 py-3 bg-blue-700 rounded-lg text-white font-semibold hover:bg-blue-800 transition-transform transform hover:scale-105"
                      onClick={handleLoadMore}
                    >
                      {isLoading ? (
                        <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        "Load More"
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-col justify-center items-center mt-10 gap-4 text-center">
                  <h1 className="text-lg font-medium text-gray-700">
                    No Products Found
                  </h1>
                  <HeartIcon className="w-8 h-8 text-gray-500" />
                  <p className="text-gray-500">
                    Try adjusting your search terms or checking our trending
                    products.
                  </p>
                </div>

                <div className="mt-10 border-2 border-blue-100 rounded-lg p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-500 p-4">
                      Cant You Find Your Perfect Product? Explore Our Other
                      Products
                    </h2>
                    <h5 className="text-sm font-bold text-blue-600 uppercase">
                      most people's favorite products
                    </h5>
                  </div>
                  <ProductCartGrid products={boostedProducts} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/*<main className="mx-auto max-w-7xl p-4 min-h-screen ">*/}
      {/*    <div className="flex  flex-col gap-4">*/}
      {/*        <div className="flex justify-between items-center border-b border-gray-200 pb-4">*/}
      {/*            <h2 className="text-lg md:text-2xl font-semibold text-gray-800">SearchProductsPage Our ProductsPage</h2>*/}
      {/*            <p className="text-sm text-gray-500 font-medium text-center">{`${totalCount} products found`}</p>*/}
      {/*        </div>*/}
      {/*        <div className="flex justify-center mt-6">*/}
      {/*            <div className="relative w-full max-w-7xl">*/}
      {/*                <input*/}
      {/*                    type="text"*/}
      {/*                    onChange={onSearchTermChange}*/}
      {/*                    className="w-full p-4 pl-12 text-lg border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"*/}
      {/*                    placeholder="SearchProductsPage ProductsPage..."*/}
      {/*                />*/}
      {/*                /!* SearchProductsPage Button *!/*/}
      {/*                <button className="absolute left-4 top-1/2 -translate-y-1/2">*/}
      {/*                    <SearchIcon className="h-6 w-6 text-gray-500"/>*/}
      {/*                </button>*/}
      {/*            </div>*/}
      {/*        </div>*/}
      {/*    </div>*/}

      {/*    <div className="mt-6">*/}
      {/*        {products.length > 0 ? (*/}
      {/*            <>*/}
      {/*                <ProductCartGrid products={products}/>*/}

      {/*                {hasLoadMore && (*/}
      {/*                    <div className="flex justify-center items-center p-4">*/}
      {/*                        <button*/}
      {/*                            className="px-8 py-2 bg-blue-700 rounded-lg text-white"*/}
      {/*                            onClick={handleLoadMore}*/}
      {/*                        >*/}
      {/*                            Load More*/}
      {/*                        </button>*/}
      {/*                    </div>)}*/}
      {/*            </>*/}

      {/*        ) : (*/}
      {/*            <div className="flex flex-col justify-center items-center mt-10 gap-4">*/}
      {/*                <h1 className="text-lg font-medium text-gray-700">No ProductsPage Found</h1>*/}
      {/*                <span><HeartIcon className="w-6 h-6 text-gray-500"/></span>*/}
      {/*                <h1 className="text-lg font-medium text-gray-700">Try change search terms</h1>*/}
      {/*            </div>*/}
      {/*        )}*/}

      {/*    </div>*/}
      {/*</main>*/}
    </>
  );
};
export default SearchProductsComponent;
