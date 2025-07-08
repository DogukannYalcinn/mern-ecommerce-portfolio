import { NavLink } from "react-router-dom";
import useProductContext from "@hooks/useProductContext.ts";

const MostPopularBrandsDropdown = () => {
  const parentCategories = useProductContext().state.filters.categories.slice(
    0,
    2,
  );
  const popularBrands = useProductContext().state.filters.popularBrands;

  return (
    <div className="flex items-center justify-center space-x-4 p-4">
      <div className="w-1/5 flex items-center justify-center text-center">
        {parentCategories.slice(0, 1).map((category, index) => (
          <div key={index} className="group perspective-1000">
            <NavLink
              to={`products?categorySlugs=${category.slug}`}
              className="text-sm font-semibold xl:text-lg text-stone-700 capitalize cursor-pointer group-hover:underline"
            >
              Explore Our{" "}
              <span className="font-bold text-red-500">{category.name}</span>
            </NavLink>
            <div className="relative w-auto h-full">
              <img
                src={`http://localhost:4000/images/${category.imageUrl}`}
                alt={category.name}
                className="w-auto max-h-80 object-cover rounded-lg cursor-pointer transition-transform duration-500 group-hover:scale-105 group-hover:rotate-x-6"
                style={{ transformOrigin: "center", perspective: "1000px" }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="w-3/5 grid grid-cols-4 gap-4 justify-center text-center">
        {popularBrands.map((brand, index) => (
          <div
            key={index}
            className="col-span-1 transform transition-transform duration-300 hover:translate-x-2 cursor-pointer text-center"
          >
            <NavLink
              to={`products?brands=${brand}`}
              className="text-sm font-semibold xl:text-lg text-stone-700 capitalize hover:text-red-500"
            >
              {brand}
            </NavLink>
          </div>
        ))}
      </div>

      <div className="w-1/5 flex items-center justify-center text-center">
        {parentCategories.slice(1, 2).map((category, index) => (
          <div key={index} className="group perspective-1000">
            <p className="text-sm font-semibold xl:text-lg text-stone-700 capitalize hover:underline cursor-pointer">
              Explore Our{" "}
              <NavLink
                to={`products?categorySlugs=${category.slug}`}
                className="font-bold text-red-500"
              >
                {category.name}
              </NavLink>
            </p>
            <div className="relative w-auto h-full">
              <img
                src={`http://localhost:4000/images/${category.imageUrl}`}
                alt={category.name}
                className="w-auto max-h-80 object-cover rounded-lg cursor-pointer transition-transform duration-500 group-hover:scale-105 group-hover:rotate-x-6"
                style={{ transformOrigin: "center", perspective: "1000px" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MostPopularBrandsDropdown;
