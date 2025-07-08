import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SmartSearchBox from "@components/ui/SmartSearchBox.tsx";
import ProductCartGrid from "@components/products/ProductCartGrid.tsx";
import productApi from "@api/productApi.ts";
import { ProductType } from "@types";

import NoResults from "@components/ui/NoResults.tsx";
import useProductContext from "@hooks/useProductContext.ts";

type State = {
  products: ProductType[];
  page: number;
  limit: number;
  totalCount: number;
  searchTerms: string;
  isLoading: boolean;
};
const SearchProductsPage = () => {
  const boostedProducts = useProductContext().state.products.boosted;

  const [searchParams, setSearchParams] = useSearchParams();
  const searchTermParams = searchParams.get("q") || "";

  const [state, setState] = useState<State>({
    isLoading: false,
    products: [],
    page: 1,
    limit: 25,
    totalCount: 0,
    searchTerms: searchTermParams ? searchTermParams.replace(/,/g, " ") : "",
  });

  useEffect(() => {
    const searchProducts = async () => {
      setState((prevState) => ({ ...prevState, isLoading: true }));
      try {
        const searchTermsArray = state.searchTerms
          .trim()
          .split(" ")
          .filter((term) => term.trim() !== "");

        const response = await productApi.fetchSearchProducts({
          page: state.page,
          limit: state.limit,
          query: searchTermsArray,
        });

        setState((prevState) => ({
          ...prevState,
          products:
            prevState.page === 1
              ? [...response.products]
              : [...prevState.products, ...response.products],
          isLoading: false,
          totalCount: response.totalCount,
        }));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };

    if (state.searchTerms.trim().length > 1) {
      searchProducts();
    } else {
      setState((prevState) => ({
        ...prevState,
        products: [],
        totalCount: 0,
      }));
    }
  }, [state.page, state.limit, state.searchTerms]);

  const handleChangeSearchTerms = (searchTerms: string) => {
    const trimmed = searchTerms.trim();

    if (trimmed.length <= 1) {
      setState((prevState) => ({
        ...prevState,
        products: [],
        totalCount: 0,
        page: 1,
        searchTerms: "",
      }));
      setSearchParams({});
    } else {
      setState((prevState) => ({
        ...prevState,
        products: [],
        totalCount: 0,
        page: 1,
        searchTerms: trimmed,
      }));
      console.log(trimmed.replace(/\s+/g, ","));
      setSearchParams({ q: trimmed.replace(/\s+/g, ",") });
    }
  };

  const handleLoadMore = () =>
    setState((prevState) => ({ ...prevState, page: prevState.page + 1 }));

  const hasLoadMore = state.page * state.limit < state.totalCount;

  return (
    <main className="mx-auto max-w-7xl p-6 min-h-screen ">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Find Your Perfect Product
          </h2>
          {state.totalCount > 0 && (
            <p className="text-sm text-gray-500 font-medium">{`${state.totalCount} products found`}</p>
          )}
        </div>

        {/* SearchProductsPage Bar */}
        <SmartSearchBox
          suggestions={[]}
          handleSearchTermsChange={handleChangeSearchTerms}
          isLoading={state.isLoading}
          defaultPlaceHolder={state.searchTerms}
        />
        {state.products.length === 0 && state.searchTerms.length > 0 && (
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

        {/* ProductsPage Grid */}
        {state.products.length > 0 && (
          <div>
            <ProductCartGrid products={state.products} />
            {hasLoadMore && (
              <div className="flex justify-center p-6">
                <button
                  className="px-6 py-3 bg-blue-700 rounded-lg text-white font-semibold hover:bg-blue-800 transition-transform transform hover:scale-105"
                  onClick={handleLoadMore}
                >
                  {state.isLoading ? (
                    <div className="w-8 h-8 border-4 border-gray-300 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </div>
        )}


        {/* Boosted Products Grid */}
        {state.searchTerms.length === 0 && (
            <div className="flex flex-col gap-6">
              <h4 className="text-lg font-semibold text-gray-700 capitalize">
                Recommended for you
              </h4>
              <ProductCartGrid products={boostedProducts} />
            </div>
        )}
      </div>
    </main>
  );
};
export default SearchProductsPage;
