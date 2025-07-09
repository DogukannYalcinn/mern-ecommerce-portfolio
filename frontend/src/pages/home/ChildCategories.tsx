import { NavLink } from "react-router-dom";
import useProductContext from "@hooks/useProductContext.ts";
import { useState } from "react";

const ChildCategories = () => {
  const allCategories = useProductContext().state.filters.categories;
  const childCategories = allCategories.flatMap(
    (category) => category.children || [],
  );

  const [showMore, setShowMore] = useState(false);
  const displayedCategories = showMore
    ? childCategories
    : childCategories.slice(0, 12);

  return (
    <div className="flex bg-gray-400/20">
      <div className="container mx-auto py-8 text-center">
        <div className="flex flex-col gap-6">
          <h2 className="font-semibold text-xl">Top Categories</h2>
          <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 pb-4">
            {displayedCategories.map((category) => (
              <NavLink
                to={`/products?categorySlugs=${category.slug}`}
                key={category._id}
                className="flex flex-col items-center text-center cursor-pointer"
              >
                <div className="aspect-square w-36">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/images/${category.imageUrl}`}
                    alt={category.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <p className="mt-2 text-sm font-medium capitalize">
                  {category.name}
                </p>
              </NavLink>
            ))}
          </div>

          {childCategories.length > 10 && (
            <button
              onClick={() => setShowMore((prev) => !prev)}
              className="self-end text-lg font-medium text-blue-500 hover:underline transition-all p-4"
            >
              {showMore ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildCategories;
