import { useEffect, useState } from "react";
import { ProductType } from "@types";
import ProductCartGrid from "@components/products/ProductCartGrid.tsx";
import useProductContext from "@hooks/useProductContext.ts";
import HeartIcon from "@icons/HeartIcon.tsx";
import productApi from "@api/productApi.ts";
import useAuthContext from "@hooks/useAuthContext.ts";

type StateType = {
  favoriteProducts: ProductType[];
  isModalOpen: boolean;
  selectedProduct: ProductType | null;
};

const FavoritesPage = () => {
  const currentUser = useAuthContext().state.currentUser;
  if (!currentUser) return null;

  const favoriteProductIds = useProductContext().state.products.favorites;
  const [state, setState] = useState<StateType>({
    favoriteProducts: [],
    isModalOpen: false,
    selectedProduct: null,
  });
  const peopleAlsoBuyDummyProducts =
    useProductContext().state.products.boosted.slice(0, 5);

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      const favoriteProducts =
        await productApi.fetchProductsByIds(favoriteProductIds);
      setState((prevState) => ({ ...prevState, favoriteProducts }));
    };

    if (currentUser.role === "user" && favoriteProductIds.length > 0) {
      fetchFavoriteProducts();
    }
  }, [currentUser, favoriteProductIds]);

  return (
    <>
      <div className="bg-red-50">
        <section className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-8">
            {state.favoriteProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <HeartIcon className="h-6 w-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  You have no favorite products yet.
                </h3>

                <p className="text-gray-500 mb-6 max-w-md">
                  Start exploring our amazing products and add your favorites to
                  this list!
                </p>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  onClick={() => (window.location.href = "/")}
                >
                  Browse Products
                </button>
              </div>
            )}

            {state.favoriteProducts.length > 0 && (
              <div className="space-y-6 p-6">
                <h2 className="text-xl font-semibold text-gray-900  sm:text-2xl">
                  Your Favorites
                </h2>
                <ProductCartGrid products={state.favoriteProducts} />
              </div>
            )}
            <div className="space-y-6 p-6">
              <h3 className="text-2xl font-semibold text-gray-900 ">
                People also bought
              </h3>
              <ProductCartGrid products={peopleAlsoBuyDummyProducts} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
export default FavoritesPage;
