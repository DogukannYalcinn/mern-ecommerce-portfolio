import { NavLink } from "react-router-dom";
import useProductContext from "@hooks/useProductContext.ts";
import StarIcon from "@icons/StarIcon.tsx";
import FireIcon from "@icons/FireIcon.tsx";

import CartToggleButton from "@components/ui/CartToggleButton.tsx";

const OnSaleDropdown = () => {
  const products = useProductContext().state.products.onSale.slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-1">
      {/* Sale Title and Hot Deals Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-red-600">Up to 35% Sale</h1>
        <div className="flex items-center justify-center mt-2">
          <span className="text-xl font-bold text-red-800 mr-2">Hot Deals</span>
          <FireIcon className="w-6 h-6 text-red-600" />
        </div>
      </div>

      {/* Shop all link*/}
      <div className="text-right">
        <NavLink
          to="/products/on-sale"
          className="text-sm text-red-500 underline font-medium"
        >
          Shop All
        </NavLink>
      </div>

      <div className="grid grid-cols-3 gap-4 justify-center">
        {products.map((product) => {
          return (
            <div
              key={product._id}
              className={`group p-2 xl:p-4 flex flex-col gap-2 transition-shadow duration-300 border-2  border-red-200 rounded-lg shadow-md `}
            >
              <div className="relative overflow-hidden rounded-lg transform group-hover:perspective-1000">
                <div className=" absolute left-0 top-0 z-10 p-2 bg-red-400 rounded-lg text-white text-sm font-medium">
                  %{product.discountedRatio.toFixed(1)}
                </div>
                <img
                  src={`http://localhost:4000/images/${product.images[0].url}`}
                  alt={product.title}
                  className={`w-32 h-32 mx-auto object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2`}
                />
              </div>

              <div className="flex flex-col gap-1">
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

                  <div className="flex items-center gap-1">
                    <FireIcon className="w-6 h-6 text-red-600" />
                    <p className="text-sm  font-medium text-gray-600">
                      Best Price
                    </p>
                  </div>
                </div>

                <NavLink
                  to={`/products/${product.slug}`}
                  className={`text-lg capitalize font-semibold hover:underline cursor-pointer text-gray-900 truncate overflow-hidden whitespace-nowrap`}
                >
                  {product.title}
                </NavLink>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-4">
                    <p className="font-medium text-gray-400 line-through">
                      ${product.price.toFixed(1)}
                    </p>
                    <p className="font-bold text-lg text-green-600">
                      ${product.discountedPrice.toFixed(2)}
                    </p>
                  </div>
                  <CartToggleButton productId={product._id} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default OnSaleDropdown;
