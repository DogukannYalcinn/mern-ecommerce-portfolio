import { createContext, ReactElement, useEffect, useState } from "react";

import useAuthContext from "@hooks/useAuthContext.ts";
import useUIContext from "@hooks/useUIContext.ts";
import userApi from "@api/userApi.ts";
import generalApi from "@api/generalApi.ts";
import categoryApi from "@api/categoryApi.ts";
import productApi from "@api/productApi.ts";
import { CategoryType, ProductType } from "@types";

export type SliderType = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  subtitle: string;
  link: string;
};

type StateType = {
  products: {
    bestSellers: ProductType[];
    onSale: ProductType[];
    boosted: ProductType[];
    newArrivals: ProductType[];
    favorites: string[];
  };
  ui: {
    isLoading: boolean;
    sliderBanners: SliderType[];
  };
  filters: {
    categories: CategoryType[];
    popularBrands: string[];
  };
};

type ContextType = {
  state: StateType;
  toggleFavorite: (productId: string) => Promise<void>;
};

export const ProductContext = createContext<ContextType | undefined>(undefined);

type ChildrenType = {
  children?: ReactElement | ReactElement[];
};

const ProductContextProvider = ({ children }: ChildrenType): ReactElement => {
  const currentUser = useAuthContext().state.currentUser;
  const isUserAuth = currentUser?.role === "user";
  const [state, setState] = useState<StateType>({
    products: {
      bestSellers: [],
      onSale: [],
      boosted: [],
      newArrivals: [],
      favorites: [],
    },
    ui: {
      isLoading: false,
      sliderBanners: [],
    },
    filters: {
      categories: [],
      popularBrands: [],
    },
  });
  const [criticalError, setCriticalError] = useState<Error | null>(null);

  const { showToast } = useUIContext();

  useEffect(() => {
    const fetchAll = async () => {
      setState((prevState) => ({
        ...prevState,
        ui: { ...prevState.ui, isLoading: true },
      }));
      try {
        await Promise.all([
          fetchBestSellerProducts(),
          fetchBoostedProducts(),
          fetchOnSaleProducts(),
          fetchNewArrivalProducts(),
          fetchCategories(),
          fetchPopularBrands(),
          fetchSliderBanners(),
        ]);
      } catch (err) {
        setCriticalError(
          new Error(
            "Critical data could not be loaded. The application cannot continue.",
          ),
        );
      } finally {
        setState((prevState) => ({
          ...prevState,
          ui: { ...prevState.ui, isLoading: false },
        }));
      }
    };
    fetchAll();
  }, []);

  if (criticalError) {
    throw criticalError;
  }

  useEffect(() => {
    if (isUserAuth && currentUser.favorites) {
      setState((prev) => ({
        ...prev,
        products: {
          ...prev.products,
          favorites: currentUser.favorites,
        },
      }));
    }
  }, [currentUser?._id]);

  const fetchBestSellerProducts = async () => {
    const bestSellerProducts = await productApi.fetchBestSellerProducts();
    setState((prevState) => ({
      ...prevState,
      products: {
        ...prevState.products,
        bestSellers: bestSellerProducts,
      },
    }));
  };

  const fetchOnSaleProducts = async () => {
    const onSaleProducts = await productApi.fetchOnSaleProducts();
    setState((prevState) => ({
      ...prevState,
      products: {
        ...prevState.products,
        onSale: onSaleProducts,
      },
    }));
  };

  const fetchNewArrivalProducts = async () => {
    const newArrivals = await productApi.fetchNewArrivalProducts();
    setState((prevState) => ({
      ...prevState,
      products: {
        ...prevState.products,
        newArrivals: newArrivals,
      },
    }));
  };

  const fetchBoostedProducts = async () => {
    const boostedProducts = await productApi.fetchBoostedProducts();
    setState((prevState) => ({
      ...prevState,
      products: {
        ...prevState.products,
        boosted: boostedProducts,
      },
    }));
  };

  const fetchCategories = async () => {
    const categories = await categoryApi.fetchCategories();
    setState((prevState) => ({
      ...prevState,
      filters: { ...prevState.filters, categories: categories },
    }));
  };

  const fetchPopularBrands = async () => {
    const popularBrands = await generalApi.fetchMostPopularBrands();
    setState((prevState) => ({
      ...prevState,
      filters: { ...prevState.filters, popularBrands: popularBrands },
    }));
  };

  const fetchSliderBanners = async () => {
    const sliderBanners = await generalApi.fetchSliders();
    setState((prevState) => ({
      ...prevState,
      ui: { ...prevState.ui, sliderBanners: sliderBanners },
    }));
  };

  const toggleFavorite = async (productId: string) => {
    if (!currentUser) return showToast("error", "Please Login or Sign In");
    try {
      const updatedFavorites = await userApi.toggleFavorite(productId);
      setState((prevState) => ({
        ...prevState,
        products: { ...prevState.products, favorites: updatedFavorites },
      }));

      showToast("success", "Your Favorite Updated!");
    } catch (err) {
      console.error("Failed to toggle favorite, reverting...");
    }
  };

  return (
    <ProductContext.Provider
      value={{
        state,
        toggleFavorite,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;
