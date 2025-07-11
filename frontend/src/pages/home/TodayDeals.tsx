import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import useProductContext from "@hooks/useProductContext.ts";
import FireIcon from "@icons/FireIcon.tsx";
import CartToggleButton from "@components/ui/CartToggleButton.tsx";

const TodayDeals = () => {
  const products = useProductContext().state.products.bestSellers;
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = useState(0);
  const progressValue = useRef(0);
  const itemsPerPage = 4;

  useEffect(() => {
    if (products.length === 0) return;

    startInterval();

    return () => {
      stopInterval();
      stopProgress();
    };
  }, [products.length]);

  const startProgress = () => {
    stopProgress();
    progressValue.current = 0;
    setProgress(0);

    progressRef.current = setInterval(() => {
      progressValue.current += 1;
      setProgress(progressValue.current);

      if (progressValue.current >= 100) {
        stopProgress();
      }
    }, 100); // 100 * 50ms = 5000ms
  };

  const stopProgress = () => {
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  };

  const startInterval = () => {
    stopInterval();
    startProgress();

    intervalRef.current = setInterval(() => {
      setIndex((prevIndex) =>
        prevIndex + itemsPerPage >= products.length
          ? 0
          : prevIndex + itemsPerPage,
      );
      startProgress();
    }, 10000);
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleMouseEnter = () => {
    stopInterval();
    stopProgress();
  };

  const handleMouseLeave = () => {
    startInterval();
  };

  const visibleProducts = products.slice(index, index + itemsPerPage);

  return (
    <>
      <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className=" mx-auto max-w-7xl xl:maxw">
          <div className="py-8 px-4 lg:py-16 lg:px-6 w-full">
            <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
              <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 ">
                Today's Deal
              </h2>
              <p className="mb-5 font-light text-gray-500 sm:text-xl">
                Here at VoltBuy we focus on markets where technology,
                innovation, and capital can unlock long-term value and drive
                economic growth.
              </p>
              <div className="max-w-7xl mx-auto h-2 border border-sky-300 bg-sky-100 rounded-full overflow-hidden shadow-sm">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-sky-300 via-sky-400 to-blue-500 transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-6">
              {visibleProducts.map((product, _i) => {
                const isOnSaleProduct =
                  product.discountedPrice > 0 && product.discountedRatio > 1;

                return (
                  <div
                    key={product._id}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      animationDelay: `${_i * 0.3}s`,
                      animationFillMode: "both",
                    }}
                    className="flex flex-col justify-between h-full p-6 text-center text-gray-900 rounded-lg border shadow border-gray-100 animate-slideDown"
                  >
                    <NavLink to={`/products/${product.slug}`}>
                      <div className="relative w-40 h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 mx-auto">
                        <img
                          className="w-full h-full object-cover rounded"
                          src={`${import.meta.env.VITE_BASE_URL}/images/${product.images[0].url}`}
                          alt="product image"
                        />

                        {isOnSaleProduct && (
                          <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded shadow">
                            SALE
                          </div>
                        )}
                      </div>
                    </NavLink>

                    <NavLink
                      to={`/products/${product.slug}`}
                      className="mt-4 text-lg font-medium text-gray-800 line-clamp-1 capitalize hover:underline"
                    >
                      {product.title}
                    </NavLink>

                    <div className="my-4">
                      {isOnSaleProduct ? (
                        <div className="flex gap-4 justify-center items-center w-full px-4">
                          <span className="text-xl text-gray-400 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                          <span className="text-2xl text-red-500 font-extrabold flex items-center gap-1">
                            <FireIcon className="w-5 h-5 text-red-500" />$
                            {product.discountedPrice.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-extrabold">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-1  mb-4 first-letter:uppercase">
                      {product.description}
                    </p>

                    <CartToggleButton productId={product._id} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default TodayDeals;
