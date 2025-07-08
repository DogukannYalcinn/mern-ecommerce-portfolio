import { useState, useEffect } from "react";
import useProductContext from "@hooks/useProductContext.ts";
import SimpleProductSlider from "@components/products/SimpleProductSlider.tsx";
import productApi from "@api/productApi.ts";
import { ProductType, CategoryType } from "@types";

const ProductTabs = () => {
  const [tabProductsList, setTabProductsList] = useState<ProductType[]>([]);
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null);
  const [pickedCategories, setPickedCategories] = useState<CategoryType[]>([]);

  const { categories } = useProductContext().state.filters;

  const displayedProducts = tabProductsList.filter((prd) =>
      currentCategory ? prd.categoryIds.includes(currentCategory._id) : false,
  );

  useEffect(() => {
    if (!categories.length) return;

    const childCategories = categories.flatMap((c) => c.children);
    const shuffled = childCategories
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

    setPickedCategories(shuffled);
    setCurrentCategory(shuffled[0]);

    const pickedSlugs = shuffled.map((cat) => cat.slug);

    const fetchProducts = async () => {
      try {
        const productResults = await Promise.all(
            pickedSlugs.map((slug) =>
                productApi.fetchProducts({ categorySlugs: [slug], limit: 10 }),
            ),
        );

        const allProducts = productResults.flatMap((res) => res.products);

        const uniqueProductsMap = new Map<string, ProductType>();
        allProducts.forEach((product) =>
            uniqueProductsMap.set(product._id, product),
        );

        setTabProductsList(Array.from(uniqueProductsMap.values()));
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, [categories]);

  return (
    <section className="flex min-h-screen items-center justify-center overflow-hidden">
      <div className="flex flex-col gap-2 xl:gap-16 w-full  max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
            Explore Our Products
          </h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl">
            Here at Plasarf we focus on markets where technology, innovation,
            and capital can unlock long-term value and drive economic growth.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 px-2 md:px-0">
          {pickedCategories.map((category) => {
            const isCurrentTab = category._id === currentCategory?._id;
            return (
              <div key={category._id} className="w-full max-w-lg">
                <button
                  onClick={() => setCurrentCategory(category)}
                  className={`relative w-full h-16 md:h-14 px-4 flex items-center justify-center rounded-md 
            font-medium text-sm lg:text-base transition-all duration-300 
            ${
              isCurrentTab
                ? "text-red-500 bg-gray-100 shadow-md"
                : "text-gray-600 bg-gray-200 hover:bg-gray-300"
            }`}
                >
                  <span className=" z-10 capitalize">{category.name}</span>

                  {/* Animated underline */}
                  <span
                    className={`absolute left-0 right-0 bottom-0 h-[3px] rounded-full transition-all duration-500
              ${isCurrentTab ? "bg-red-500 scale-x-100" : "bg-red-500 scale-x-0 group-hover:scale-x-100"}
            `}
                  />
                </button>
              </div>
            );
          })}
        </div>

        <SimpleProductSlider
          key={currentCategory?._id}
          products={displayedProducts}
        />
      </div>
    </section>
  );
};
export default ProductTabs;
