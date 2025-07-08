import useCartContext from "../../hooks/useCartContext.ts";
import CheckBadgeIcon from "../../icons/CheckBadgeIcon.tsx";
import ShoppingCartPlusIcon from "../../icons/ShoppingCartPlusIcon.tsx";

type Props = {
  productId: string;
};

const CartToggleButton = ({ productId }: Props) => {
  const { state: cartState, addToCart, removeFromCart } = useCartContext();
  const isCartProduct = cartState.list.some((prd) => prd._id === productId);
  return (
    <button
      type="button"
      onClick={() =>
        isCartProduct ? removeFromCart(productId) : addToCart(productId)
      }
      className={`inline-flex whitespace-nowrap justify-center items-center rounded-lg px-5 py-2.5 font-medium text-white capitalize  focus:outline-none focus:ring-4 transition-colors duration-300 ${isCartProduct ? "bg-green-500 hover:bg-green-600 focus:ring-green-300" : "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300"}`}
    >
      {isCartProduct ? (
        <>
          <CheckBadgeIcon className="-ms-2 me-2 h-6 w-6" aria-hidden="true" />
          Added
        </>
      ) : (
        <>
          <ShoppingCartPlusIcon
            className="-ms-2 me-2 h-6 w-6"
            aria-hidden="true"
          />
          Add to cart
        </>
      )}
    </button>
  );
};
export default CartToggleButton;
