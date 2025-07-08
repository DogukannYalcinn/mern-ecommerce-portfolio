import useProductContext from "@hooks/useProductContext.ts";
import ProductCartGrid from "@components/products/ProductCartGrid.tsx";
import CheckBadgeIcon from "@icons/CheckBadgeIcon.tsx";

const BestSellersPage = () => {
  const bestSellers = useProductContext().state.products.bestSellers;
  return (
    <>
      <main className="mx-auto max-w-7xl p-4 min-h-screen ">
        <div className="flex justify-between items-center  border-b border-gray-200 pb-4">
          <div className="flex gap-1 items-center">
            <CheckBadgeIcon className="w-8 h-8 text-green-500" />
            <h2 className="text-lg md:text-2xl font-semibold text-gray-800">
              Best Sellers
            </h2>
          </div>
          <span className="text-xs text-green-500 bg-green-100 px-2 py-1 rounded-full font-semibold animate-pulse">
            Most Popular
          </span>
        </div>

        <div className="mt-6">
          <ProductCartGrid products={bestSellers} />
        </div>
      </main>
    </>
  );
};
export default BestSellersPage;
