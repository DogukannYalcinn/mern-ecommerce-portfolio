import { NavLink, useNavigate } from "react-router-dom";
import useCartContext from "@hooks/useCartContext.ts";
import CirclePlusIcon from "@icons/CirclePlusIcon.tsx";
import CloseCircleIcon from "@icons/CloseCircleIcon.tsx";
import CircleMinusIcon from "@icons/CircleMinusIcon.tsx";
import TruckProgress from "@components/ui/TruckProgress.tsx";
import useAuthContext from "@hooks/useAuthContext.ts";
import useUIContext from "@hooks/useUIContext.ts";

const CartSidebarContent = () => {
  const {
    state: cartState,
    addToCart,
    removeFromCart,
    deleteFromCart,
    cartSummary,
  } = useCartContext();
  const { showToast } = useUIContext();
  const currentUser = useAuthContext().state.currentUser;
  const isAuth = currentUser && currentUser.role === "user";
  const cartProductCount = cartState.list.length;
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuth) {
      showToast("error", "please login or sign in");
    } else {
      navigate("/cart/checkout");
    }
  };

  if (cartState.list.length === 0) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <span className="text-sm text-gray-600">
          Free shipping for all orders over $800.00!
        </span>
        <span className="text-sm text-gray-600 self-center">
          Your cart is empty
        </span>
        <NavLink
          to={"/"}
          className="p-4 border border-gray-900 rounded-full hover:bg-blue-700 hover:text-white"
        >
          Continue Shopping
        </NavLink>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-4">
      {/* Header */}
      <div className="flex-shrink-0">
        <p className="text-2xl font-medium">Shopping Cart</p>
        <span className="text-sm text-gray-600">{cartProductCount} items</span>
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        {/* Truck Progress */}
        <TruckProgress />

        {/* Product List */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <ul className="divide-y divide-gray-200">
            {cartState.list.map((product) => {
              const isOnSale =
                product.discountedPrice > 0 && product.discountedRatio > 0;
              return (
                <li className="flex gap-2 py-4" key={product._id}>
                  <div className="w-1/3">
                    <img
                      src={`http://localhost:4000/images/${product.images[0].url}`}
                      alt={product.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div className="w-2/3 flex flex-col gap-2 justify-center">
                    <p className="text-lg font-semibold text-gray-800 capitalize">
                      {product.title}
                    </p>

                    {isOnSale ? (
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-500 line-through text-sm">
                          ${product.price.toFixed(2)}
                        </p>
                        <p className="text-red-600 font-bold text-lg">
                          ${product.discountedPrice.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        ${product.price.toFixed(2)}
                      </p>
                    )}

                    <div className="flex gap-8 items-center">
                      <div className="flex border border-gray-500 gap-3 p-2 rounded-full">
                        <button
                          onClick={() => removeFromCart(product._id)}
                          aria-label="decrease quantity"
                        >
                          <CircleMinusIcon className="w-6 h-6 text-blue-500" />
                        </button>
                        <span>{product.quantity}</span>
                        <button
                          onClick={() => addToCart(product._id)}
                          aria-label="increase quantity "
                        >
                          <CirclePlusIcon className="w-6 h-6 text-blue-500" />
                        </button>
                      </div>
                      <button
                        onClick={() => deleteFromCart(product._id)}
                        className="cursor-pointer"
                        aria-label="remove from cart"
                      >
                        <CloseCircleIcon className="w-6 h-6 text-red-700" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* CheckoutPage Buttons */}
        <div className="flex-shrink-0 mt-auto pt-3">
          <div className="border-t pt-3">
            <div className="flex justify-between text-gray-700 text-lg">
              <span>Subtotal:</span>
              <span>${cartSummary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl text-gray-900">
              <span>Total:</span>
              <span>${cartSummary.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="mt-3 flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="w-4 h-4 accent-blue-600"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree with{" "}
              <span className="text-blue-600 underline">
                Terms & Conditions
              </span>
            </label>
          </div>

          {/* CheckoutPage & View CartPage Buttons */}
          <div className="mt-4 space-y-2">
            <button
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition"
              onClick={handleCheckout}
            >
              Checkout
            </button>
            <NavLink to="/cart" className="text-sm text-gray-600">
              <button className="w-full bg-gray-200 text-gray-700 py-4 rounded-lg hover:bg-gray-300 transition">
                View Cart
              </button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebarContent;
