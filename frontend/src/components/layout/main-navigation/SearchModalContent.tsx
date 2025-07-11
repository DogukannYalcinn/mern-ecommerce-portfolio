import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import useProductContext from "@hooks/useProductContext.ts";
import useCartContext from "@hooks/useCartContext.ts";
import ShoppingCartPlusIcon from "@icons/ShoppingCartPlusIcon.tsx";
import CheckBadgeIcon from "@icons/CheckBadgeIcon.tsx";
import SmartSearchBox from "@components/ui/SmartSearchBox.tsx";
import productApi from "@api/productApi.ts";

export type Suggestion = {
  title: string;
  slug: string;
};

type State = {
  query: string;
  filteredSuggestions: Suggestion[];
  isLoading: boolean;
};

const SearchModalContent = () => {
  const [state, setState] = useState<State>({
    query: "",
    filteredSuggestions: [],
    isLoading: false,
  });
  const boostedProducts = useProductContext().state.products.boosted.slice(
    0,
    4,
  );
  const userFavoriteProducts = useProductContext().state.products.favorites;
  const { state: cartContext, addToCart, removeFromCart } = useCartContext();
  const popularBrands = useProductContext().state.filters.popularBrands;

  useEffect(() => {
    const fetchSuggestions = async () => {
      setState((prevState) => ({ ...prevState, isLoading: true }));
      try {
        const searchTerms = state.query
          .trim()
          .split(" ")
          .filter((term) => term.trim() !== "");

        const { products } = await productApi.fetchSearchProducts({
          query: searchTerms,
          limit: 5,
        });
        const mappedSuggestions: Suggestion[] = products.filter(
          (product: Record<string, string>) => ({
            title: product.title,
            slug: product.slug,
          }),
        );
        setState((prevState) => ({
          ...prevState,
          filteredSuggestions: mappedSuggestions,
        }));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };

    if (state.query.trim().length > 1) {
      fetchSuggestions();
    }
  }, [state.query]);

  const handleSearchChange = (searchTerms: string) => {
    const trimmed = searchTerms.trim();

    if (trimmed.length <= 1) {
      setState((prevState) => ({
        ...prevState,
        query: "",
        filteredSuggestions: [],
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        query: trimmed,
      }));
    }
  };

  return (
    <>
      <div className="p-6 flex flex-col gap-4 w-full ">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold ">Search</h2>
        </div>
        <div className="hidden md:flex">
          <ul className="grid grid-cols-4 gap-4">
            {boostedProducts.slice(0, 4).map((product) => {
              const isOnSaleProduct =
                product.discountedPrice > 1 && product.discountedRatio > 1;
              const isFavoriteProduct = userFavoriteProducts.some(
                (prdId) => prdId === product._id,
              );
              const isCartProduct = cartContext.list.some(
                (item) => item._id === product._id,
              );

              return (
                <li
                  key={product._id}
                  className={`relative flex flex-col items-center justify-between p-4 rounded-xl border ${
                    isFavoriteProduct
                      ? "border-yellow-400 shadow-sm"
                      : "border-gray-200"
                  } hover:shadow-lg transition-all duration-300 bg-white cursor-pointer`}
                >
                  {/* SALE Badge */}
                  {isOnSaleProduct && (
                    <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full">
                      SALE
                    </div>
                  )}

                  {/* Add to CartPage Icon (animated) */}

                  <button
                    aria-label={`${isCartProduct ? "Remove From Cart" : "Add to Cart"}`}
                    className={`absolute z-10 top-2 right-2 p-2 rounded-full transition transform hover:scale-105 ${
                      isCartProduct
                        ? "bg-green-100 text-green-600 hover:bg-green-500 hover:text-white"
                        : "bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600"
                    }`}
                    onClick={() =>
                      isCartProduct
                        ? removeFromCart(product._id)
                        : addToCart(product._id)
                    }
                  >
                    {isCartProduct ? (
                      <CheckBadgeIcon className="w-5 h-5" />
                    ) : (
                      <ShoppingCartPlusIcon className="w-5 h-5" />
                    )}
                  </button>

                  <NavLink to={`/products/${product.slug}`}>
                    {/* Product Image (larger) */}
                    <img
                      className="h-32 w-32  object-contain rounded-lg transition-transform duration-300 hover:scale-105"
                      src={`${import.meta.env.VITE_BASE_URL}/images/${product.images[0].url}`}
                      alt={product.title}
                    />
                  </NavLink>

                  {/* Info */}
                  <div className="text-center space-y-2 text-gray-800">
                    <div className="group relative w-full">
                      <NavLink
                        to={`/products/${product.slug}`}
                        className="mx-auto text-sm font-medium truncate block max-w-[calc(100%-2rem)] lg:max-w-[calc(100%-1rem)] capitalize hover:underline"
                      >
                        {product.title}
                      </NavLink>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-gray-500 text-white text-xs rounded py-1 px-2 z-50 whitespace-nowrap">
                        {product.title}
                      </div>
                    </div>

                    <div className="text-sm font-semibold">
                      {isOnSaleProduct ? (
                        <div className="flex justify-center gap-2 items-center">
                          <span className=" line-through text-gray-400">
                            ${product.price}
                          </span>
                          <span className="text-red-500 text-lg font-bold">
                            $
                            {(
                              product.price *
                              (1 - product.discountedRatio / 100)
                            ).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <SmartSearchBox
          suggestions={state.filteredSuggestions}
          handleSearchTermsChange={handleSearchChange}
          isLoading={state.isLoading}
          defaultPlaceHolder={undefined}
        />

        <div className="hidden md:flex flex-wrap gap-4 items-center justify-center">
          {popularBrands.map((brand) => (
            <button
              key={brand}
              className="text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 hover:underline"
            >
              <NavLink to={`/products?brands=${brand}`}>{brand}</NavLink>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchModalContent;
