import { CartItem } from "@types";

const localStorageCartHandler = {
  getCart(): CartItem[] {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  },

  setCart(cart: CartItem[]) {
    console.log(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
  },

  clearCartFromLocalStorage() {
    localStorage.setItem("cart", JSON.stringify([]));
  },
};

export default localStorageCartHandler;
