import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useProductContext from "@hooks/useProductContext.ts";
import useCartContext from "@hooks/useCartContext.ts";
import HeartIcon from "@icons/HeartIcon.tsx";
import TruckProgress from "@components/ui/TruckProgress.tsx";
import ProductCartGridItem from "@components/products/ProductCartGridItem.tsx";
import RightArrowIcon from "@icons/RightArrowIcon.tsx";
import ProductCartGrid from "@components/products/ProductCartGrid.tsx";
import useAuthContext from "@hooks/useAuthContext.ts";
import useUIContext from "@hooks/useUIContext.ts";

import productApi from "@api/productApi.ts";
import { ProductType } from "@types";

const CartPage = () => {
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const currentUser = useAuthContext().state.currentUser;
  const isAuth = currentUser && currentUser.role === "user";
  const { state: cartState, cartSummary } = useCartContext();
  const categoryTree = useProductContext().state.filters.categories;
  const { showToast } = useUIContext();
  const navigate = useNavigate();

  const handleCheckOut = () => {
    if (!isAuth) return showToast("error", "please login or sig in");
    navigate("/cart/checkout");
  };

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      const productCategoryIds = cartState.list.flatMap(
        (product) => product.categoryIds,
      );

      const flatCategories = categoryTree.flatMap((parent) => [
        parent,
        ...(parent.children || []),
      ]);

      const categorySlugs = flatCategories
        .filter((cat) => productCategoryIds.includes(cat._id))
        .map((cat) => cat.slug);

      const uniqueSlugs = [...new Set(categorySlugs)];

      if (!uniqueSlugs.length) return;

      try {
        const { products } = await productApi.fetchProducts({
          categorySlugs: uniqueSlugs,
        });

        const cartProductIds = cartState.list.map((product) => product._id);
        const filteredRelatedProducts = products.filter(
          (product) => !cartProductIds.includes(product._id),
        );
        setRelatedProducts(filteredRelatedProducts);
        // Handle the related products here
      } catch (err) {
        console.error("Failed to fetch related products:", err);
      }
    };

    fetchRelatedProducts();
  }, [cartState.list, categoryTree]);

  if (cartState.list.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <HeartIcon className="w-5 h-5" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          You have no products in cart yet.
        </h3>

        <p className="text-gray-500 mb-6 max-w-md">
          Start exploring our amazing products and add your favorites to this
          list!
        </p>
        <NavLink
          to={`/`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Browse Products
        </NavLink>
      </div>
    );
  }

  return (
    <>
      <main className="antialiased">
        <div className="space-y-4 mx-auto max-w-screen-xl p-4 2xl:px-0">
          {/*Truck Progress*/}
          {cartState.list.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                Shopping Cart
              </h2>
              <TruckProgress />

              {/*CartPage Summary*/}
              <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
                <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                  <div className="space-y-6">
                    {cartState.list.map((cartItem) => (
                      <ProductCartGridItem
                        key={cartItem._id}
                        cartItem={cartItem}
                      />
                    ))}
                  </div>
                </div>

                {/*Order Summary*/}
                <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                  <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-xl font-semibold text-gray-900">
                      Order Summary
                    </p>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 ">
                            Original price
                          </dt>
                          <dd className="text-base font-medium text-gray-900 ">
                            ${cartSummary.originalPrice.toFixed(2)}
                          </dd>
                        </dl>

                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 ">
                            Savings
                          </dt>
                          <dd className="text-base font-medium text-green-600">
                            -${cartSummary.totalSaving.toFixed(2)}
                          </dd>
                        </dl>

                        {/*<dl className="flex items-center justify-between gap-4">*/}
                        {/*    <dt className="text-base font-normal text-gray-500 ">Shipping Fee*/}
                        {/*    </dt>*/}
                        {/*    {cartSummary.freeShippingQualified ? <span*/}
                        {/*            className="text-base font-medium text-green-600">Free</span> :*/}
                        {/*        <dd className="text-base font-medium text-gray-900">${shippingFee.toFixed(2)}</dd>}*/}

                        {/*</dl>*/}

                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 ">
                            Tax
                          </dt>
                          <dd className="text-base font-medium text-gray-900 ">
                            ${cartSummary.taxAmount.toFixed(2)}
                          </dd>
                        </dl>

                        <dl className="flex items-center justify-between gap-4">
                          <dt className="text-base font-normal text-gray-500 ">
                            Subtotal
                          </dt>
                          <dd className="text-base font-medium text-gray-900">
                            ${cartSummary.subtotal.toFixed(2)}
                          </dd>
                        </dl>
                      </div>

                      <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2">
                        <dt className="text-base font-bold text-gray-900">
                          Total
                        </dt>
                        <dd className="text-base font-bold text-gray-900">
                          ${cartSummary.grandTotal.toFixed(2)}
                        </dd>
                      </dl>
                    </div>

                    <button
                      className="flex w-full items-center justify-center rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      onClick={handleCheckOut}
                    >
                      Proceed to Checkout
                    </button>

                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-normal text-gray-500 ">
                        {" "}
                        or{" "}
                      </span>
                      <NavLink
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 underline hover:no-underline "
                      >
                        Continue Shopping
                        <RightArrowIcon className="h-5 w-5" />
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*Related Products*/}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              {cartState.list.length === 0
                ? "People Also Buy"
                : "Related Products"}{" "}
            </h2>
            <ProductCartGrid products={relatedProducts.slice(0, 5)} />
          </div>
        </div>
      </main>
    </>
  );
};

export default CartPage;
