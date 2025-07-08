import { ProductType } from "@types";
import ProductImagesSlider from "./ProductImagesSlider.tsx";
import EyeIcon from "../../icons/EyeIcon.tsx";
import HeartIcon from "@icons/HeartIcon.tsx";
import StarIcon from "@icons/StarIcon.tsx";
import TruckIcon from "@icons/TruckIcon.tsx";
import BestPriceIcon from "@icons/BestPriceIcon.tsx";
import FireIcon from "@icons/FireIcon.tsx";

import useProductContext from "@hooks/useProductContext.ts";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import CarouselArrows from "../ui/CarouselArrows.tsx";
import CartToggleButton from "../ui/CartToggleButton.tsx";

type Props = { products: ProductType[]; onQuickLook: (_id: string) => void };

const AdvanceProductSlider = ({ products, onQuickLook }: Props) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleItemCount, setVisibleItemCount] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const userFavoriteProducts = useProductContext().state.products.favorites;
  const toggleFavorite = useProductContext().toggleFavorite;

  const getVisibleItemCount = () => {
    const container = scrollContainerRef.current;
    if (!container) return 1;

    const productEl = container.firstChild as HTMLElement;
    if (!productEl) return 1;

    return Math.round(container.offsetWidth / productEl.offsetWidth);
  };

  const scrollByAmount = (itemCount: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const productEl = container.firstChild as HTMLElement;
    if (!productEl) return;

    const scrollAmount = productEl.offsetWidth * itemCount;

    const isAtEnd =
      Math.ceil(container.scrollLeft + container.offsetWidth) >=
      container.scrollWidth;

    const isAtStart = container.scrollLeft <= 0;

    if (itemCount > 0 && isAtEnd) {
      container.scrollTo({ left: 0, behavior: "smooth" });
    } else if (itemCount < 0 && isAtStart) {
      container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
    } else {
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => scrollByAmount(visibleItemCount);
  const handlePrev = () => scrollByAmount(-visibleItemCount);

  const handleAutoScroll = () => scrollByAmount(1);

  const startAutoScroll = () => {
    stopAutoScroll();
    intervalRef.current = setInterval(() => {
      handleAutoScroll();
    }, 3500);
  };

  const stopAutoScroll = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!products || products.length === 0) return;
    const updateVisibleItemCount = () => {
      setVisibleItemCount(getVisibleItemCount());
    };

    updateVisibleItemCount();
    window.addEventListener("resize", updateVisibleItemCount);

    startAutoScroll();
    return () => {
      stopAutoScroll();
      window.removeEventListener("resize", updateVisibleItemCount);
    };
  }, [products.length]);

  return (
    <div
      className="relative"
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
      onPointerDown={stopAutoScroll}
    >
      <div className="absolute top-4 right-0 z-10">
        <CarouselArrows onNext={handleNext} onPrev={handlePrev} />
      </div>
      <div
        ref={scrollContainerRef}
        className="grid grid-flow-col auto-cols-[100%] sm:auto-cols-[50%] md:auto-cols-[33.33%] xl:auto-cols-[25%]  overflow-x-auto scrollbar-hide [scrollbar-width:none] snap-x snap-mandatory "
      >
        {products.map((product) => {
          const isOnSaleProduct =
            product.discountedRatio > 0 && product.discountedPrice > 0;
          const isFavoriteProduct = userFavoriteProducts.some(
            (prdId) => prdId === product._id,
          );
          return (
            <div
              key={product._id}
              className="snap-start flex flex-col gap-2 p-2.5"
            >
              <div className="h-72">
                <ProductImagesSlider images={product.images} />
              </div>
              <div className="flex items-center">
                {isOnSaleProduct && (
                  <span className="me-2 rounded bg-pink-100 px-2.5 py-0.5 font-medium text-pink-800 ">
                    {" "}
                    Up to {product.discountedRatio}% off{" "}
                  </span>
                )}
                <div className="ml-auto">
                  <div className="relative group inline-block">
                    <button
                      onClick={() => onQuickLook(product._id)}
                      type="button"
                      className="rounded-lg p-2 text-gray-500 hover:bg-teal-300 hover:text-white"
                    >
                      <span className="sr-only">Quick look</span>
                      <EyeIcon className="h-6 w-6" />
                    </button>
                    <div className="absolute bottom-full left-1/2 mb-2 hidden w-max -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-md group-hover:block">
                      Quick look
                    </div>
                  </div>

                  <div className="relative group inline-block">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(product._id)}
                      className={`rounded-lg p-2 transition-all duration-200 ease-in-out ${isFavoriteProduct ? " text-red-500" : " text-gray-500 hover:text-red-500 hover:scale-110"} hover:bg-pink-200`}
                    >
                      <span className="sr-only">Add to Favorites</span>
                      <HeartIcon className="h-6 w-6" />
                    </button>

                    <div className="absolute bottom-full left-1/2 mb-2 hidden w-max -translate-x-1/2 rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-md group-hover:block">
                      Add to Favorites
                    </div>
                  </div>
                </div>
              </div>

              <NavLink
                to={`products/${product.slug}`}
                className="text-lg font-semibold leading-tight text-gray-900 hover:underline capitalize"
              >
                {product.title}
              </NavLink>

              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center">
                  {Array.from({
                    length: Math.ceil(product.averageRating),
                  }).map((_, index) => (
                    <StarIcon key={index} className="h-4 w-4 text-yellow-400" />
                  ))}
                </div>

                <p className="text-sm font-medium text-gray-900 ">
                  {product.averageRating.toFixed(1)}
                </p>
                <p className="text-sm font-medium text-gray-500 ">
                  ({product.totalReviews})
                </p>
              </div>

              <ul className="flex items-center justify-between p-1">
                <li className="flex items-center gap-2">
                  <TruckIcon className="h-4 w-4 text-gray-500 " />
                  <p className="text-sm font-medium text-gray-500 ">
                    Fast Delivery
                  </p>
                </li>

                <li className="flex items-center gap-2">
                  <BestPriceIcon className="h-4 w-4 text-gray-500 " />
                  <p className="text-sm font-medium text-gray-500 ">
                    Best Price
                  </p>
                </li>
              </ul>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {isOnSaleProduct ? (
                    <>
                      <p className="text-md line-through text-gray-500">
                        ${product.price}
                      </p>
                      <p className="text-2xl font-extrabold leading-tight text-red-600">
                        ${product.discountedPrice}
                      </p>
                      <FireIcon className="w-6 h-6 text-red-600" />
                    </>
                  ) : (
                    <p className="text-2xl font-extrabold leading-tight text-gray-900">
                      ${product.price}
                    </p>
                  )}
                </div>
                <CartToggleButton productId={product._id} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdvanceProductSlider;
