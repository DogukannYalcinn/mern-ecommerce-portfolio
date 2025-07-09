import { NavLink } from "react-router-dom";
import useProductContext from "@hooks/useProductContext.ts";

const CategoryDropdown = () => {
  const { categories } = useProductContext().state.filters;

  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 justify-center">
        {categories.slice(0, 4).map((category) => (
          <li key={category._id} className=" flex flex-col items-center gap-2">
            <div className="relative cursor-pointer before:content-[''] before:absolute before:w-0 before:h-[3px] before:bg-blue-600 before:bottom-0 before:left-0 before:rounded before:transition-all before:duration-700 hover:before:w-full ">
              <h3 className="text-2xl font-extrabold capitalize text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 overflow-visible  ">
                <NavLink to={`products?categorySlugs=${category.slug}`}>
                  {category.name}
                </NavLink>
              </h3>
            </div>
            <NavLink to={`products?categorySlugs=${category.slug}`}>
              <img
                className="h-32 w-32 object-cover cursor-pointer hover:scale-110 transition-transform duration-500"
                src={`${import.meta.env.VITE_BASE_URL}/images/${category.imageUrl}`}
                alt=""
              />
            </NavLink>

            <div className="mt-4">
              <ul className="space-y-4">
                {category.children.map((child) => (
                  <li key={child._id} className="w-full">
                    <NavLink
                      to={`products?categorySlugs=${child.slug}`}
                      className="inline-flex"
                    >
                      <p className="font-medium text-gray-600 capitalize cursor-pointer list-outside  -translate-x-5 hover: hover:translate-x-0 hover:text-red-500 transition-all duration-500 ease-in-out">
                        {child.name}
                      </p>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default CategoryDropdown;
