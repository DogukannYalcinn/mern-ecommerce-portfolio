import { useRef } from "react";
import { NavLink } from "react-router-dom";
import useProductContext from "@hooks/useProductContext.ts";
import HeartIcon from "@icons/HeartIcon.tsx";
import useCartContext from "@hooks/useCartContext.ts";
import CheckBadgeIcon from "@icons/CheckBadgeIcon.tsx";
import CarouselArrows from "@components/ui/CarouselArrows.tsx";

const CartSlider = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { state: cartState, addToCart, removeFromCart } = useCartContext();
  const products = useProductContext().state.products.bestSellers;
  const userFavorites = useProductContext().state.products.favorites;
  const { toggleFavorite } = useProductContext();

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstChild = container.children[0] as HTMLElement;
      container.scrollLeft += firstChild.offsetWidth + 16;
    }
  };
  const scrollPrev = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const firstChild = container.children[0] as HTMLElement;
      container.scrollLeft -= firstChild.offsetWidth + 16;
    }
  };

  return (
    <>
      <section className="flex bg-gradient-to-b from-gray-200 to-gray-100">
        <div className="container mx-auto  text-center py-8">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800">
            Featured Products
          </h2>
          <div className="relative flex  px-4 sm:px-6 mx-auto lg:px-8 z-0">
            <div
              ref={scrollContainerRef}
              className="scrollbar-hide flex w-full h-auto snap-x snap-mandatory gap-4 overflow-x-scroll scroll-smooth [scrollbar-width:none] overflow-hidden py-8 "
            >
              {products.map((product) => {
                const isOnSale =
                  product.discountedRatio > 0 && product.discountedPrice > 0;
                const isCartProduct = cartState.list.some(
                  (prd) => prd._id === product._id,
                );
                const isFavoriteProduct = userFavorites.some(
                  (prdId) => prdId === product._id,
                );
                return (
                  <div
                    key={product._id}
                    className="relative w-[calc(50%-0.9rem)] sm:w-[calc(33.3333%-0.9rem)] lg:w-[calc(20%-0.9rem)] min-h-full shrink-0 snap-start snap-always rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 shadow-md hover:shadow-lg transition-transform duration-300 z-10 group"
                  >
                    <div className="flex flex-col h-full rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 shadow-md hover:shadow-lg transition-transform duration-300 group">
                      {/* Image */}
                      <div className="relative h-64 w-full bg-white flex items-center justify-center overflow-hidden">
                        {isOnSale && (
                          <div className="absolute z-10 top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                            <CheckBadgeIcon className="w-4 h-4 text-white" />
                            {product.discountedRatio}
                          </div>
                        )}
                        <img
                          className="h-full object-contain transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1 group-hover:shadow-md"
                          src={`${import.meta.env.VITE_BASE_URL}/images/${product.images?.[0]?.url}`}
                          alt={product.title}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex flex-col justify-between flex-grow p-3">
                        {/* Title + Price */}
                        <div className="space-y-3">
                          <NavLink to={`/products/${product.slug}`}>
                            <h2 className="text-base sm:text-lg font-bold line-clamp-2 capitalize text-gray-800 hover:underline hover:text-gray-700">
                              {product.title}
                            </h2>
                          </NavLink>

                          {isOnSale ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex items-baseline gap-2">
                                <span className="text-gray-400 line-through">
                                  ${product.price.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500">
                                  From
                                </span>
                              </div>
                              <span className="inline-block text-left text-red-700 text-xl font-bold">
                                ${product.discountedPrice?.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <p className="text-lg font-bold text-gray-800">
                              ${product.price.toFixed(2)}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-evenly pt-5">
                          <button
                            onClick={() =>
                              isCartProduct
                                ? removeFromCart(product._id)
                                : addToCart(product._id)
                            }
                            className={`w-2/3 py-2 rounded-full font-medium transition-colors duration-500
                            ${
                              isCartProduct
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "border border-gray-900 text-gray-900 hover:bg-blue-400 hover:text-white hover:border-blue-600"
                            }`}
                          >
                            {isCartProduct
                              ? "Added CartPage"
                              : "Add to CartPage"}
                          </button>

                          <button onClick={() => toggleFavorite(product._id)}>
                            <span>
                              <HeartIcon
                                className={`h-8 w-8 cursor-pointer transition-colors duration-300 ${
                                  isFavoriteProduct
                                    ? "text-red-500 hover:text-red-600"
                                    : "text-gray-400 hover:text-red-400"
                                }`}
                              />
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <CarouselArrows onNext={scrollNext} onPrev={scrollPrev} />
          </div>
        </div>
      </section>
    </>
  );
};
export default CartSlider;
