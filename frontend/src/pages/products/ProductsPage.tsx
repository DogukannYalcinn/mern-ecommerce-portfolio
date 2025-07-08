import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ProductType } from "@types";
import productApi from "@api/productApi.ts";
import ProductsComponents from "@pages/products/ProductsComponents.tsx";
import Spinner from "@components/ui/Spinner.tsx";
import Sidebar from "@components/ui/Sidebar.tsx";
import FilterSidebarContent from "@pages/products/FilterSidebarContent.tsx";
import useProductContext from "@hooks/useProductContext.ts";

type State = {
  products: ProductType[];
  page: number;
  limit: number;
  totalCount: number;
  sort: string;
  minPrice: null | number;
  maxPrice: null | number;
  brands: string[];
  categorySlugs: string[];
  isLoading: boolean;
  isSidebarOpen: boolean;
};

const ProductsPage = () => {
  const categoryTree = useProductContext().state.filters.categories;

  const [searchParams, setSearchParams] = useSearchParams();

  const rawCategorySlugs = searchParams.get("categorySlugs")?.split(",") || [];

  const resolvedCategorySlugs = [
    ...new Set(
      rawCategorySlugs.flatMap((slug) => {
        const parentCategory = categoryTree.find((cat) => cat.slug === slug);
        if (parentCategory) {
          const childSlugs = parentCategory.children?.map((c) => c.slug) || [];
          return [slug, ...childSlugs];
        }
        return [slug];
      }),
    ),
  ];

  const rawBrandFilters = searchParams.get("brands")?.split(",") || [];

  const [state, setState] = useState<State>({
    isLoading: false,
    products: [],
    page: 1,
    limit: 5,
    totalCount: 0,
    categorySlugs: resolvedCategorySlugs,
    sort: "",
    brands: rawBrandFilters,
    minPrice: null,
    maxPrice: null,
    isSidebarOpen: false,
  });

  useEffect(() => {
    const fromURL = {
      categorySlugs: resolvedCategorySlugs,
      brands: rawBrandFilters,
    };

    const isEqual =
      JSON.stringify(state.categorySlugs) ===
        JSON.stringify(fromURL.categorySlugs) &&
      JSON.stringify(state.brands) === JSON.stringify(fromURL.brands);

    if (!isEqual) {
      setState((prev) => ({
        ...prev,
        ...fromURL,
        page: 1,
      }));
    }
  }, [resolvedCategorySlugs, rawBrandFilters]);

  useEffect(() => {
    const fetchProducts = async () => {
      setState((prevState) => ({ ...prevState, isLoading: true }));
      try {
        const response = await productApi.fetchProducts({
          categorySlugs: state.categorySlugs,
          page: state.page,
          limit: state.limit,
          brands: state.brands,
          maxPrice: state.maxPrice,
          minPrice: state.minPrice,
          sort: state.sort,
        });

        setState((prevState) => ({
          ...prevState,
          products:
            prevState.page === 1
              ? [...response.products]
              : [...prevState.products, ...response.products],
          isLoading: false,
          totalCount: response.totalCount,
        }));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };
    fetchProducts();
  }, [
    state.page,
    state.limit,
    state.brands,
    state.categorySlugs,
    state.maxPrice,
    state.minPrice,
    state.sort,
  ]);

  const handleChangeFilters = ({
    categorySlugs,
    brands,
    minPrice,
    maxPrice,
  }: {
    categorySlugs: string[];
    brands: string[];
    minPrice: number | null;
    maxPrice: number | null;
  }) => {
    setState((prevState) => ({
      ...prevState,
      categorySlugs,
      brands,
      maxPrice,
      minPrice,
      page: 1,
      totalCount: 0,
      isFilterSidebarOpen: false,
    }));

    const newParams: Record<string, string> = {};
    if (categorySlugs?.length) {
      newParams.categorySlugs = categorySlugs.join(",");
    }
    if (brands?.length) {
      newParams.brands = brands.join(",");
    }
    setSearchParams(newParams);
  };

  const handleChangeSortOption = (selectedValue: string) => {
    setState((prevState) => ({
      ...prevState,
      sort: selectedValue,
      page: 1,
      totalCount: 0,
    }));
  };

  const handleLoadMore = () =>
    setState((prevState) => ({ ...prevState, page: prevState.page + 1 }));

  const hasLoadMore = state.page * state.limit < state.totalCount;

  const handleOpenSidebar = () =>
    setState((prevState) => ({ ...prevState, isSidebarOpen: true }));
  const handleCloseSidebar = () =>
    setState((prevState) => ({ ...prevState, isSidebarOpen: false }));

  return (
    <>
      <Sidebar
        isOpen={state.isSidebarOpen}
        direction="left"
        onClose={handleCloseSidebar}
      >
        <FilterSidebarContent
          key={[...state.categorySlugs, ...state.brands].join(",")}
          onFiltersChange={handleChangeFilters}
          initialCategorySlugs={state.categorySlugs}
          initialBrands={state.brands}
          onSidebarClose={handleCloseSidebar}
        />
      </Sidebar>
      {state.isLoading && <Spinner />}

      <ProductsComponents
        selectedCategorySlugs={state.categorySlugs}
        selectedBrands={state.brands}
        products={state.products}
        handleChangeSortOption={handleChangeSortOption}
        totalCount={state.totalCount}
        handleLoadMore={hasLoadMore ? handleLoadMore : undefined}
        onSidebarOpen={handleOpenSidebar}
      />
    </>
  );
};

export default ProductsPage;
