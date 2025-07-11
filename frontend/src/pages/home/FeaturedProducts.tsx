import { useState } from "react";
import AdvanceProductSlider from "@components/products/AdvanceProductSlider.tsx";
import useProductContext from "@hooks/useProductContext.ts";
import ProductCartQuickView from "@components/products/ProductCartQuickView.tsx";
import { ProductType } from "@types";

const FeaturedProducts = () => {
  const boostedProducts = useProductContext().state.products.boosted;
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(
    null,
  );

  const handleSelectedProduct = (_id: string) => {
    const selectedProduct = boostedProducts.find(
      (product) => product._id === _id,
    );
    if (!selectedProduct) return;
    setSelectedProduct(selectedProduct);
  };
  return (
    <>
      {selectedProduct && (
        <ProductCartQuickView
          product={selectedProduct}
          onCloseQuickView={() => setSelectedProduct(null)}
        />
      )}
      <section className="sm:min-h-screen bg-gray-50 overflow-hidden flex flex-col items-center md:justify-center">
        <div className="relative flex flex-col gap-4 w-full lg:w-11/12 mx-auto p-3">
          <div className="px-2 pt-2 xs:px-0 flex flex-col gap-3">
            <h2 className="text-4xl  tracking-tight font-extrabold text-gray-900">
              Featured Products
            </h2>
            <p className="font-light text-gray-500 sm:text-xl">
              Here at VoltBuy we focus on markets where technology, innovation,
              and capital can unlock long-term value and drive economic growth.
            </p>
          </div>

          <AdvanceProductSlider
            products={boostedProducts}
            onQuickLook={handleSelectedProduct}
          />
        </div>
      </section>
    </>
  );
};
export default FeaturedProducts;
