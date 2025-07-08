import { useState } from "react";
import { NavLink } from "react-router-dom";
import { ProductType } from "@types";
import ProductImagesSlider from "./ProductImagesSlider.tsx";
import StarIcon from "@icons/StarIcon.tsx";
import EyeIcon from "@icons/EyeIcon.tsx";
import HeartIcon from "@icons/HeartIcon.tsx";
import useProductContext from "@hooks/useProductContext.ts";
import TruckIcon from "@icons/TruckIcon.tsx";
import BestPriceIcon from "@icons/BestPriceIcon.tsx";
import CartToggleButton from "@components/ui/CartToggleButton.tsx";
import Modal from "@components/ui/Modal.tsx";
import ProductCartQuickView from "@components/products/ProductCartQuickView.tsx";

type Props = {
  products: ProductType[];
};

const productCartGrid = ({ products }: Props) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );

  const userFavoriteProducts = useProductContext().state.products.favorites;
  const { toggleFavorite } = useProductContext();

  return (
    <>
      {selectedProduct && (
        <Modal isOpen={true} onClose={() => setSelectedProduct(null)}>
          <ProductCartQuickView product={selectedProduct} />
        </Modal>
      )}
      <div className="mb-4 grid gap-4 sm:grid-cols-2 md:mb-8 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const isOnSale =
            product.discountedPrice > 1 && product.discountedRatio > 1;

          const isFavorite = userFavoriteProducts.some(
            (prdId) => prdId === product._id,
          );

          return (
            <div
              className=" rounded-lg border border-gray-200 p-6 shadow-sm hover:border-blue-600 transition-colors duration-500"
              key={product._id}
            >
              <div className="h-72 w-full z-0">
                <ProductImagesSlider images={product.images} />
              </div>
              <div className="pt-6">
                <div className="mb-4 flex items-center">
                  {isOnSale && (
                    <span className="me-2 rounded bg-red-400 px-2.5 py-0.5 text-xs font-medium text-white">
                      {" "}
                      Up to {product.discountedRatio}% off{" "}
                    </span>
                  )}
                  <div className="ml-auto flex items-center justify-end gap-1">
                    <button
                      type="button"
                      data-tooltip-target="tooltip-quick-look"
                      onClick={() => setSelectedProduct(product)}
                      className="rounded-lg p-2 bg-transparent hover:bg-blue-400 hover:text-white"
                      aria-label="Quick Look"
                    >
                      <EyeIcon className="w-6 h-6" />
                    </button>
                    <button
                      type="button"
                      data-tooltip-target="tooltip-add-to-favorites"
                      aria-label="Add to Favorites"
                      className={`rounded-lg p-2 bg-transparent hover:bg-red-400 hover:text-white ${
                        isFavorite ? "text-red-500" : "text-gray-500"
                      }`}
                      onClick={() => toggleFavorite(product._id)}
                    >
                      <HeartIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <NavLink
                  to={`/products/${product.slug}`}
                  className="text-lg font-semibold capitalize leading-tight text-gray-900 hover:underline cursor-pointer"
                >
                  {product.title}
                </NavLink>

                <div className="mt-2 flex items-center gap-2">
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

                  <p className="text-sm font-medium text-gray-900">
                    {product.averageRating.toFixed(1)}
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    ({product.totalReviews})
                  </p>
                </div>

                <ul className="mt-2 flex items-center gap-4">
                  <li className="flex items-center gap-2">
                    <TruckIcon className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-500">
                      Fast Delivery
                    </p>
                  </li>

                  <li className="flex items-center gap-2">
                    <BestPriceIcon className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-500">
                      Best Price
                    </p>
                  </li>
                </ul>

                <div className="mt-4 flex flex-col items-center justify-between gap-4">
                  <div className="flex items-center justify-between gap-4">
                    {isOnSale ? (
                      <>
                        <p className="text-xl line-through text-gray-500">
                          {product.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </p>
                        <p className="text-2xl font-extrabold leading-tight text-red-500">
                          {product.discountedPrice.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                          })}
                        </p>
                      </>
                    ) : (
                      <p className="text-2xl font-extrabold leading-tight text-gray-700">
                        {product.price.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </p>
                    )}
                  </div>

                  <CartToggleButton productId={product._id} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default productCartGrid;
