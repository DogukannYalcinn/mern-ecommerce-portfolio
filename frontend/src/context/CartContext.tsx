import {
  createContext,
  ReactElement,
  useEffect,
  useState,
  useMemo,
} from "react";

import useUIContext from "@hooks/useUIContext.ts";
import useAuthContext from "@hooks/useAuthContext.ts";

import localStorageCartHandler from "@utils/localStorageCartHandler.ts";
import userApi from "@api/userApi.ts";
import productApi from "@api/productApi.ts";
import { CartItem, ProductType, CartProduct, OrderRulesType } from "@types";
import generalApi from "@api/generalApi.ts";

type StateType = {
  list: CartProduct[];
  isLoading: boolean;
  isError: boolean;
  orderRules: OrderRulesType;
};

type ContextType = {
  state: StateType;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => void;
  deleteFromCart: (productId: string) => Promise<void>;
  cartSummary: {
    originalPrice: number;
    totalSaving: number;
    taxAmount: number;
    grandTotal: number;
    subtotal: number;
    freeShippingQualified: boolean;
  };
};

export const CartContext = createContext<ContextType | undefined>(undefined);

type ChildrenType = {
  children?: ReactElement | ReactElement[];
};

const CartContextProvider = ({ children }: ChildrenType): ReactElement => {
  const { state: authCtxState, userLogout } = useAuthContext();
  const { showToast } = useUIContext();
  const [state, setState] = useState<StateType>({
    list: [],
    isLoading: false,
    isError: false,
    orderRules: {
      paymentMethods: [],
      deliveryMethods: [],
      taxRate: 0,
      giftWrapFee: 0,
      freeShippingThreshold: 0,
    },
  });

  const mergeCarts = (
    localCart: CartItem[],
    userCart?: CartItem[],
  ): CartItem[] => {
    if (!userCart) return localCart;

    const mergedCart = [...localCart];

    userCart.forEach((dbItem) => {
      const existingLocalItem = mergedCart.find(
        (localItem) => localItem.product === dbItem.product,
      );

      if (!existingLocalItem) {
        mergedCart.push(dbItem);
      } else {
        existingLocalItem.quantity = dbItem.quantity;
      }
    });

    return mergedCart;
  };

  // Order Rules
  useEffect(() => {
    const fetchOrderRules = async () => {
      try {
        const orderRules = await generalApi.fetchOrderRules();
        setState((prevState) => ({ ...prevState, orderRules }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrderRules();
  }, []);

  // Merge Cart
  useEffect(() => {
    const localCart = localStorageCartHandler.getCart();

    const fetchCartProducts = async () => {
      const userCart =
        authCtxState.currentUser && authCtxState.currentUser.role === "user"
          ? authCtxState.currentUser.cart
          : [];
      const mergedCart = mergeCarts(localCart, userCart);

      if (mergedCart.length) {
        try {
          setState((prev) => ({ ...prev, isLoading: true }));

          const productIdList = mergedCart.map((item) => item.product);
          const cartProducts: ProductType[] =
            await productApi.fetchProductsByIds(productIdList);

          const populatedCart = cartProducts.map((product) => ({
            ...product,
            quantity:
              mergedCart.find((item) => item.product === product._id)
                ?.quantity || 1,
          }));

          setState((prevState) => ({ ...prevState, list: populatedCart }));
          localStorageCartHandler.clearCartFromLocalStorage();

          //sync to DB
          if (authCtxState.currentUser?.role === "user") {
            await updateCart(populatedCart);
          }
        } catch (error) {
          setState((prev) => ({
            ...prev,
            isError: true,
            isLoading: false,
          }));
        }
      } else {
        setState((prev) => ({ ...prev, list: [] }));
      }
    };

    fetchCartProducts();
  }, [authCtxState.currentUser?._id]);

  const cartSummary = useMemo(() => {
    const summary = state.list.reduce(
      (acc, item) => {
        const savingPerItem =
          item.discountedPrice && item.discountedRatio
            ? item.price - item.discountedPrice
            : 0;

        const totalSaving = savingPerItem * item.quantity;
        const originalTotal = item.price * item.quantity;

        acc.originalPrice += originalTotal;
        acc.totalSaving += totalSaving;

        return acc;
      },
      { originalPrice: 0, totalSaving: 0 },
    );

    const subtotalRaw = summary.originalPrice - summary.totalSaving;
    const taxAmountRaw = subtotalRaw * state.orderRules.taxRate;
    const grandTotalRaw = subtotalRaw + taxAmountRaw;

    const subtotal = parseFloat(subtotalRaw.toFixed(2));
    const taxAmount = parseFloat(taxAmountRaw.toFixed(2));
    const grandTotal = parseFloat(grandTotalRaw.toFixed(2));

    return {
      originalPrice: parseFloat(summary.originalPrice.toFixed(2)),
      totalSaving: parseFloat(summary.totalSaving.toFixed(2)),
      subtotal,
      freeShippingQualified: subtotal >= state.orderRules.freeShippingThreshold,
      taxAmount,
      grandTotal,
    };
  }, [state.list, state.orderRules]);

  const updateCart = async (newCart: CartProduct[]) => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
      isError: false,
    }));

    try {
      if (
        authCtxState.currentUser &&
        authCtxState.currentUser.role === "user"
      ) {
        const dbCart: CartItem[] = newCart.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        }));
        await userApi.updateCart(dbCart);
      } else {
        localStorageCartHandler.setCart(
          newCart.map((prd) => ({
            product: prd._id,
            quantity: prd.quantity,
          })),
        );
      }

      setState((prevState) => ({
        ...prevState,
        list: newCart,
        isLoading: false,
      }));
    } catch (err: any) {
      const errorCode = err.status;
      if (errorCode === 401 || errorCode === 403) {
        userLogout();
      }
      setState((prevState) => ({
        ...prevState,
        isError: true,
        isLoading: false,
      }));
    }
  };

  const addToCart = async (productId: string) => {
    if (!productId) return;

    const updatedCart = [...state.list];
    const existingItem = updatedCart.find((item) => item._id === productId);
    try {
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        const products = await productApi.fetchProductsByIds([productId]);
        if (products.length === 0) return;
        updatedCart.push({
          ...products[0],
          quantity: 1,
        });
      }
      await updateCart(updatedCart);
      showToast("success", "Added to Cart");
    } catch (error) {
      showToast("error", "Failed Adding Cart");
      console.log(error);
    }
  };

  const removeFromCart = async (productId: string) => {
    const updatedCart = state.list
      .map((item) =>
        item._id === productId
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item,
      )
      .filter((item) => item.quantity > 0);

    await updateCart(updatedCart);
  };

  const clearCart = () => {
    setState((prevState) => ({ ...prevState, list: [] }));
  };

  const deleteFromCart = async (productId: string) => {
    const updatedCart = state.list.filter((item) => item._id !== productId);
    await updateCart(updatedCart);
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addToCart,
        removeFromCart,
        cartSummary,
        deleteFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContextProvider;
