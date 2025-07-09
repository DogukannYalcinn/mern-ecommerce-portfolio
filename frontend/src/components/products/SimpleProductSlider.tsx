import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { ProductType } from "@types";
import Modal from "@components/ui/Modal.tsx";
import ProductCartQuickView from "./ProductCartQuickView.tsx";
import useProductContext from "@hooks/useProductContext.ts";
import StarIcon from "@icons/StarIcon.tsx";
import FireIcon from "@icons/FireIcon.tsx";
import HeartIcon from "@icons/HeartIcon.tsx";
import EyeIcon from "@icons/EyeIcon.tsx";
import RightArrowIcon from "@icons/RightArrowIcon.tsx";
import CartToggleButton from "@components/ui/CartToggleButton.tsx";
import CarouselArrows from "@components/ui/CarouselArrows.tsx";

type Props = {
  products: ProductType[];
};
const SimpleProductSlider = ({ products }: Props) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );
  const userFavoriteProducts = useProductContext().state.products.favorites;
  const toggleFavorite = useProductContext().toggleFavorite;

  const handleScroll = (direction: "next" | "prev") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const productEl = container.firstChild as HTMLElement;
    if (!productEl) return;

    const isAtEnd =
      Math.ceil(container.scrollLeft + container.offsetWidth) >=
      container.scrollWidth;

    const isAtStart = container.scrollLeft <= 0;

    const scrollAmount = productEl.offsetWidth;

    if (direction === "next") {
      if (isAtEnd) {
        container.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    } else if (direction === "prev") {
      if (isAtStart) {
        container.scrollTo({ left: container.scrollWidth, behavior: "smooth" });
      } else {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    }
  };

  const handleSelectedProduct = (_id: string) => {
    if (!_id) return;
    const selectedProduct = products.find((prd) => prd._id === _id);
    if (!selectedProduct) return;
    setIsModalOpen(true);
    setSelectedProduct(selectedProduct);
  };

  const onClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onClose}>
        {selectedProduct && <ProductCartQuickView product={selectedProduct} />}
        {/*{selectedProduct && (<InfiniteSliderTest product={selectedProduct}/>)}*/}
      </Modal>

      <div className="animate-slideDown">
        <div className="space-y-10">
          <div className="hidden lg:flex items-center justify-end mt-8">
            <CarouselArrows
              onNext={() => handleScroll("next")}
              onPrev={() => handleScroll("prev")}
            />
          </div>

          <div
            ref={scrollContainerRef}
            className="relative grid grid-flow-col auto-cols-[50%] md:auto-cols-[33.33%] lg:auto-cols-[25%] xl:auto-cols-[20%] overflow-x-auto scrollbar-hide [scrollbar-width:none] snap-x snap-mandatory"
          >
            {/* Carousel Card */}
            {products.map((product) => {
              const isOnSaleProduct =
                product.discountedPrice > 1 && product.discountedRatio > 1;
              const isFavoriteProduct = userFavoriteProducts.some(
                (prdId) => prdId === product._id,
              );

              return (
                <div
                  key={product._id}
                  className={` group snap-start flex flex-col gap-2 transition-shadow duration-300 p-2`}
                >
                  <div className="relative group w-full h-48 z-0 cursor-pointer overflow-hidden">
                    {isOnSaleProduct && (
                      <div className="absolute left-0 top-0 flex items-center p-2 bg-red-500 rounded-full animate-pulse text-white text-sm font-medium z-10">
                        %{product.discountedRatio.toFixed(1)}
                        <span>
                          <RightArrowIcon className="rotate-90 w-4 h-4" />
                        </span>
                      </div>
                    )}

                    {/* First image – primary display */}
                    <NavLink to={`/products/${product.slug}`}>
                      <img
                        className={`w-full h-full object-contain absolute transition-all duration-1000 ease-in-out ${
                          product.images.length > 1
                            ? "group-hover:opacity-0 group-hover:scale-125"
                            : "group-hover:scale-110"
                        }`}
                        src={`${import.meta.env.VITE_BASE_URL}/images/${product.images[0].url}`}
                        alt="Product Image"
                      />
                    </NavLink>

                    {/* second image showing if exists */}
                    {product.images.length > 1 && (
                      <>
                        <NavLink to={`/products/${product.slug}`}>
                          <img
                            className="w-full h-full object-cover absolute transition-all duration-1000 ease-in-out scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100"
                            src={`${import.meta.env.VITE_BASE_URL}/images/${product.images[1].url}`}
                            alt="Product Hover Image"
                          />
                        </NavLink>
                      </>
                    )}
                  </div>
                  <NavLink to={`/products/${product.slug}`}>
                    <h3
                      className={`text-lg font-semibold capitalize hover:underline cursor-pointer text-gray-900 truncate overflow-hidden whitespace-nowrap`}
                    >
                      {product.title}
                    </h3>
                  </NavLink>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        <div className="flex items-center">
                          {Array.from({
                            length: Math.ceil(product.averageRating),
                          }).map((_, index) => (
                            <StarIcon
                              key={index}
                              className="h-4 w-4 text-yellow-400 fill-yellow-400"
                            />
                          ))}
                        </div>

                        <p className="text-sm font-medium text-gray-900 ">
                          {product.averageRating.toFixed(1)}
                        </p>
                        <p className="text-sm font-medium text-gray-500 ">
                          ({product.totalReviews})
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(product._id)}
                          className={`rounded-lg p-2 transition-all duration-200 ease-in-out ${isFavoriteProduct ? " text-red-500" : " text-gray-500 hover:text-red-500 hover:scale-110"} hover:bg-gray-100`}
                        >
                          <span className="sr-only">Add to Favorites</span>
                          <HeartIcon className="h-5 w-5" />
                        </button>

                        <button
                          type="button"
                          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                          onClick={() => handleSelectedProduct(product._id)}
                        >
                          <span className="sr-only">Quick look</span>
                          <EyeIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="flex items-center">
                        {isOnSaleProduct ? (
                          <div className="flex gap-2  items-center w-full ">
                            <span className=" text-gray-400 line-through">
                              ${product.price.toFixed(2)}
                            </span>

                            <span className="text-2xl text-red-500 font-extrabold">
                              ${product.discountedPrice?.toFixed(2)}
                            </span>
                            <FireIcon className="w-6 h-6 text-red-600" />
                          </div>
                        ) : (
                          <span className="text-2xl font-extrabold">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <CartToggleButton productId={product._id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className=" flex items-center lg:hidden justify-center mt-10">
            <CarouselArrows
              onNext={() => handleScroll("next")}
              onPrev={() => handleScroll("prev")}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default SimpleProductSlider;
