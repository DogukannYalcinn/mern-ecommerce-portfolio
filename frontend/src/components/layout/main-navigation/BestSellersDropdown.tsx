import { NavLink } from "react-router-dom";
import useProductContext from "@hooks/useProductContext.ts";
import useCartContext from "@hooks/useCartContext.ts";
import StarIcon from "@icons/StarIcon.tsx";
import CheckBadgeIcon from "@icons/CheckBadgeIcon.tsx";
import BestPriceIcon from "@icons/BestPriceIcon.tsx";

const BestSellersDropdown = () => {
  const products = useProductContext().state.products.bestSellers.slice(0, 5);
  const { state: cartState, addToCart, removeFromCart } = useCartContext();

  return (
    <div className="relative p-1">
      <div className="absolute top-2 right-2 z-10 animate-pulse">
        <NavLink
          to="/products/best-sellers"
          className="font-medium text-blue-100 hover:underline"
        >
          Shop All
        </NavLink>
      </div>
      <ul className="grid grid-cols-5 gap-2 lg:gap-4 justify-center">
        {products.map((product, index) => {
          const isCartProduct = cartState.list.some(
            (prd) => prd._id === product._id,
          );

          return (
            <li
              key={product._id}
              className={`group p-2 xl:p-4 flex flex-col gap-2 rounded transition-shadow duration-300`}
              style={{
                ...(index % 2 === 0 && {
                  backgroundImage: `url("/images/cart-bg-abstract.jpg")`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }),
                ...(index % 2 !== 0 && {
                  backgroundColor: "#f0e6ff",
                }),
              }}
            >
              <div className="relative overflow-hidden rounded-lg transform group-hover:perspective-1000">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}/images/${product.images[0].url}`}
                  alt={product.title}
                  className={`w-32 h-32 mx-auto object-cover transition-transform duration-500 group-hover:scale-105 
                                            ${index % 2 === 0 ? "group-hover:rotate-2" : "group-hover:-rotate-2"} 
                                        `}
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex">
                    {Array.from({
                      length: Math.ceil(product.averageRating),
                    }).map((_, index) => (
                      <StarIcon
                        key={index}
                        className="h-4 w-4 text-yellow-400"
                      />
                    ))}
                  </div>
                  <div
                    className={`flex gap-1 ${index % 2 === 0 ? "text-white" : " text-blue-950"}`}
                  >
                    <BestPriceIcon className="h-4 w-4" />
                    <p className="text-sm  font-medium">Best Price</p>
                  </div>
                </div>

                <NavLink
                  to={`products/${product.slug}`}
                  className={`text-lg font-semibold hover:underline cursor-pointer truncate overflow-hidden capitalize whitespace-nowrap ${index % 2 === 0 ? "text-gray-100" : "text-gray-900"}`}
                >
                  {product.title}
                </NavLink>

                <div className="flex items-center justify-between">
                  <p
                    className={` font-medium ${index % 2 === 0 ? " text-gray-100" : " text-gray-900"}`}
                  >
                    ${product.price.toFixed(1)}
                  </p>
                  <button
                    className={`text-sm xl:font-medium p-1.5 xl:p-2 rounded-xl border flex items-center justify-center gap-2 transition-colors duration-300
                                            ${
                                              isCartProduct
                                                ? "bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600"
                                                : index % 2 === 0
                                                  ? "text-white border-gray-100  hover:bg-white hover:text-purple-600"
                                                  : "text-gray-900 border-gray-900 hover:bg-blue-950 hover:text-white"
                                            }`}
                    onClick={() =>
                      isCartProduct
                        ? removeFromCart(product._id)
                        : addToCart(product._id)
                    }
                  >
                    {isCartProduct ? (
                      <>
                        <CheckBadgeIcon className="w-5 h-5 text-green-100 me-2" />
                        Added
                      </>
                    ) : (
                      "Add To Cart"
                    )}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default BestSellersDropdown;
