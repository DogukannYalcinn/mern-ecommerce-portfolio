import useProductContext from "@hooks/useProductContext.ts";
import ProductCartGrid from "@components/products/ProductCartGrid.tsx";
import FireIcon from "@icons/FireIcon.tsx";

const OnSalePage = () => {
  const onSaleProducts = useProductContext().state.products.onSale;
  return (
    <>
      <main className="mx-auto max-w-7xl p-4 min-h-screen ">
        <div className="flex justify-between items-center  border-b border-gray-200 pb-4">
          <div className="flex gap-1 items-center">
            <FireIcon className="w-8 h-8 text-red-500" />
            <h2 className="text-lg md:text-2xl font-semibold text-gray-800">
              On Sale Now
            </h2>
          </div>
          <span className="text-xs text-red-500 bg-red-100 px-2 py-1 rounded-full font-semibold animate-pulse">
            Hot Deals
          </span>
        </div>

        <div className="mt-6">
          <ProductCartGrid products={onSaleProducts} />
        </div>
      </main>
    </>
  );
};
export default OnSalePage;
