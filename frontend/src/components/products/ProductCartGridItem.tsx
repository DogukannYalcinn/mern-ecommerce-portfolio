import HeartIcon from "@icons/HeartIcon.tsx";
import CloseIcon from "@icons/CloseIcon.tsx";
import CircleMinusIcon from "@icons/CircleMinusIcon.tsx";
import CirclePlusIcon from "@icons/CirclePlusIcon.tsx";
import { CartProduct } from "@types";
import useProductContext from "@hooks/useProductContext.ts";
import useCartContext from "@hooks/useCartContext.ts";

type Props = {
  cartItem: CartProduct;
};
const ProductCartGridItem = ({ cartItem }: Props) => {
  const { toggleFavorite } = useProductContext();
  const { addToCart, removeFromCart, deleteFromCart } = useCartContext();
  const isFavorite = useProductContext().state.products.favorites.some(
    (prdId) => prdId === cartItem._id,
  );

  const isOnSale = cartItem.discountedPrice > 1 && cartItem.discountedRatio > 1;
  if (!cartItem) return null;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 p-4 border border-gray-300 rounded-xl shadow-sm">
      {/* Image */}
      <div className="w-28 h-28 shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img
          src={`${import.meta.env.VITE_BASE_URL}/images/${cartItem.images[0].url}`}
          alt={cartItem.title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 w-full space-y-2">
        <h3 className="text-base font-semibold text-gray-800 line-clamp-2 capitalize">
          {cartItem.title}
        </h3>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => removeFromCart(cartItem._id)}
              className="text-blue-500 hover:text-blue-700 transition"
            >
              <CircleMinusIcon className="w-5 h-5" />
            </button>

            <span className="text-sm font-medium w-8 text-center">
              {cartItem.quantity}
            </span>

            <button
              onClick={() => addToCart(cartItem._id)}
              className="text-blue-500 hover:text-blue-700 transition"
            >
              <CirclePlusIcon className="w-5 h-5" />
            </button>
          </div>

          {isOnSale ? (
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500 line-through">
                ${cartItem.price.toFixed(2)}
              </p>
              <p className="text-lg font-bold text-red-600">
                ${cartItem.discountedPrice.toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="text-base font-bold text-gray-900">
              ${cartItem.price.toFixed(2)}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex md:flex-col items-center md:items-end gap-2">
        <button
          onClick={() => toggleFavorite(cartItem._id)}
          className="flex items-center text-sm font-medium transition-all group"
        >
          <HeartIcon
            className={`w-5 h-5 transition-transform ${
              isFavorite ? "text-red-500 scale-110" : "text-gray-400"
            } group-hover:scale-110`}
          />
          <span className="ml-1 text-sm text-gray-600 group-hover:text-teal-500">
            Favorite
          </span>
        </button>

        <button
          onClick={() => deleteFromCart(cartItem._id)}
          className="flex items-center text-sm text-red-600 hover:text-red-800 transition"
        >
          <CloseIcon className="w-5 h-5" />
          <span className="ml-1">Remove</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCartGridItem;
