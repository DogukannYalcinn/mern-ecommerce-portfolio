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
          src={`http://localhost:4000/images/dummyImage.png`}
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

    // <div className="rounded-lg border border-gray-400 p-6 shadow-sm md:px-6 md:py-1">
    //   <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
    //     <a
    //       href="#"
    //       className="shrink-0 md:order-1 flex items-center justify-center"
    //     >
    //       <img
    //         className="h-32 w-32 object-cover object-center"
    //         src={`http://localhost:4000/images/dummyImage.png`}
    //         alt="imac image"
    //       />
    //     </a>
    //
    //     <div className="flex items-center justify-between md:order-3 md:justify-end">
    //       <div className="flex items-center">
    //         <button
    //           type="button"
    //           id="decrement-button"
    //           onClick={() => removeFromCart(cartItem._id)}
    //           data-input-counter-decrement="counter-input"
    //           className="items-center justify-center text-blue-500 hover:text-blue-700"
    //         >
    //           <CircleMinusIcon className="w-6 h-6" />
    //         </button>
    //         <input
    //           type="text"
    //           id="counter-input"
    //           className="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0"
    //           placeholder=""
    //           value={cartItem.quantity}
    //           required
    //         />
    //         <button
    //           type="button"
    //           id="increment-button"
    //           onClick={() => addToCart(cartItem._id)}
    //           data-input-counter-increment="counter-input"
    //           className="items-center justify-center text-blue-500 hover:text-blue-700"
    //         >
    //           <CirclePlusIcon className="w-6 h-6" />
    //         </button>
    //       </div>
    //       <div className="text-end md:order-4 md:w-32">
    //         <p className="text-base font-bold text-gray-900">
    //           ${cartItem.price}
    //         </p>
    //       </div>
    //     </div>
    //
    //     <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
    //       <a
    //         href="#"
    //         className="text-base font-medium text-gray-900 hover:underline "
    //       >
    //         {cartItem.title}
    //       </a>
    //
    //       <div className="flex items-center gap-4">
    //         <button
    //           type="button"
    //           className="inline-flex items-center transition-all duration-500 ease-in-out group"
    //           onClick={() => toggleFavorite(cartItem._id)}
    //         >
    //           <HeartIcon
    //             className={`w-6 h-6 transform transition-transform duration-500 ${isFavorite ? "text-pink-400 scale-110" : "text-gray-500 scale-100"}`}
    //           />
    //           <span
    //             className={`text-sm font-medium ml-2 transition-colors duration-500 ${isFavorite ? "text-teal-500" : "text-gray-600"} group-hover:text-teal-400`}
    //           >
    //             {isFavorite ? "Your Favorite" : "Add to FavoritesPage"}
    //           </span>
    //         </button>
    //
    //         <button
    //           type="button"
    //           onClick={() => deleteFromCart(cartItem._id)}
    //           className="inline-flex items-center text-sm font-medium text-red-600 hover:underline"
    //         >
    //           <CloseIcon className="w-6 h-6" />
    //           Remove
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ProductCartGridItem;
