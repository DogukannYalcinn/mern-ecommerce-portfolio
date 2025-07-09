import { NavLink } from "react-router-dom";
import useProductContext from "@hooks/useProductContext.ts";

const HeroBanner = () => {
  const parentCategories = useProductContext().state.filters.categories;

  return (
    <>
      <section className="min-h-screen flex flex-col gap-12 items-center justify-center p-4 bg-gray-50">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-800">
          Featured Categories
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl w-full">
          {parentCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-shadow duration-300 group"
            >
              {/* Image with link */}
              <NavLink
                to={`/products?categorySlugs=${category.slug}`}
                className="block bg-gray-100 h-48"
              >
                <div className="flex items-center justify-center h-full">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/images/${category.imageUrl}`}
                    alt={category.name}
                    className="h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </NavLink>

              {/* Name with link */}
              <div className="py-4 text-center">
                <NavLink
                  to={`/products?categorySlugs=${category.slug}`}
                  className="text-lg font-semibold uppercase text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
                >
                  {category.name}
                </NavLink>
              </div>
            </div>
          ))}
        </div>

        {/* Banners */}
        <div className="flex flex-col md:flex-row gap-6 max-w-7xl w-full">
          {[4, 5].map((num) => (
            <div
              key={num}
              className="relative w-full overflow-hidden rounded-xl shadow group"
            >
              <img
                src={`https://new-ella-demo.myshopify.com/cdn/shop/files/home-19-banner-custom-${num}_665x.jpg`}
                alt={`Banner ${num}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default HeroBanner;
