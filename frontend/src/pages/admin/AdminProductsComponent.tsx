import { useNavigate } from "react-router-dom";
import { AdminProductPageStateType } from "@pages/admin/AdminProductsPage.tsx";
import { useRef } from "react";
import StarIcon from "@icons/StarIcon.tsx";
import CogIcon from "@icons/CogIcon.tsx";
import FireIcon from "@icons/FireIcon.tsx";
import ExclamationIcon from "@icons/ExclamationIcon.tsx";
import BadgeDollarSignIcon from "@icons/BadgeDollarSignIcon.tsx";
import AdminTable from "@pages/admin/AdminTable";
import NoResults from "@components/ui/NoResults.tsx";
import Legend, { LegendItem } from "@pages/admin/Legend.tsx";
import RocketIcon from "@icons/RocketIcon.tsx";

type Props = {
  value: AdminProductPageStateType;
  onPageChange: (page: number) => void;
  handleSearchTermChange: (term: string[]) => void;
  onFilterChange: (filter: string) => void;
  onOpenModal: () => void;
};

const LEGEND_ITEMS: LegendItem[] = [
  {
    value: "boosted_on_sale_low_stock",
    label: "Boosted & On Sale & Low Stock",
    className: "bg-purple-200 text-purple-700",
    icon: <FireIcon className="w-5 h-5 text-purple-800" />,
  },
  {
    value: "boosted",
    label: "Boosted",
    className: "bg-green-200 text-green-600",
    icon: <RocketIcon className="w-5 h-5 text-green-800" />,
  },
  {
    value: "on_sale",
    label: "On Sale",
    className: "bg-yellow-200 text-yellow-600",
    icon: <BadgeDollarSignIcon className="w-5 h-5 text-yellow-700" />,
  },
  {
    value: "low_stock",
    label: "Low Stock",
    className: "bg-red-200 text-red-600",
    icon: <ExclamationIcon className="w-5 h-5 text-red-800" />,
  },
  {
    value: "most_popular",
    label: "Most Popular",
    className: "bg-blue-200 text-blue-500",
    icon: <StarIcon className="w-5 h-5 text-blue-800" />,
  },
];

const AdminProductsComponent = ({
  value,
  onPageChange,
  onFilterChange,
  onOpenModal,
  handleSearchTermChange,
}: Props) => {
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const handleNavigateProductEdit = (slug: string) => {
    if (!slug) return;
    navigate(`edit/${slug}`);
  };

  const onSearchTermChange = (rawTerm: string) => {
    const searchTerms = rawTerm
      .trim()
      .toLowerCase()
      .replace(/\s/g, ",")
      .split(",");

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearchTermChange(searchTerms);
    }, 800);
  };

  const getLegendValue = (product: any): string | null => {
    const isBoosted = product.isBoosted;
    const isLowStock = product.stock <= 5;
    const isOnSale = product.discountedRatio > 0 && product.discountedPrice > 0;
    const isMostPopular = product.averageRating >= 3;

    if (isBoosted && isOnSale && isLowStock) return "boosted_on_sale_low_stock";
    if (isBoosted) return "boosted";
    if (isOnSale) return "on_sale";
    if (isLowStock) return "low_stock";
    if (isMostPopular) return "most_popular";
    return null;
  };

  const getClassNameAndIcon = (product: any) => {
    const value = getLegendValue(product);
    const legend = LEGEND_ITEMS.find((item) => item.value === value);

    if (legend) {
      return {
        className: legend.className,
        icon: legend.icon,
      };
    }
    // fallback
    return {
      className: "hover:bg-gray-100 transition-colors duration-200",
      icon: null,
    };
  };

  return (
    <>
      <section className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-7xl mx-auto space-y-2">
          <Legend items={LEGEND_ITEMS} />
          <AdminTable
            title="Product Management"
            pagination={{
              page: value.page,
              limit: value.limit,
              totalCount: value.totalCount,
              onPageChange: onPageChange,
            }}
            headers={[
              "Product Name",
              "Category",
              "Brand",
              "Price",
              "Stock",
              "Rating",
              "Actions",
            ]}
            onSearchTermChange={onSearchTermChange}
            filter={{
              enabled: true,
              value: value.filter,
              options: [
                { value: "latest", label: "Latest" },
                { value: "popular", label: "Most Popular" },
                { value: "boosted", label: "Boosted" },
                { value: "low-stock", label: "Low Stock" },
                { value: "on-sale", label: "On Sale" },
              ],
              onChange: onFilterChange,
            }}
            onAddClick={onOpenModal}
            searchInputPlaceholder="Search products by name, brand, or tags..."
          >
            {value.products.length === 0 && (
              <tr>
                <td colSpan={10}>
                  <NoResults
                    title="no product found."
                    subtitle="try adjusting your search or filters."
                  />
                </td>
              </tr>
            )}

            {value.products.length > 0 &&
              value.products.map((product) => {
                const { className, icon } = getClassNameAndIcon(product);

                return (
                  <tr
                    key={product._id}
                    className={`cursor-pointer transition-colors duration-200 ${className}`}
                    onClick={() => handleNavigateProductEdit(product.slug)}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                      {icon && <span className="text-lg">{icon}</span>}
                      {product.title}
                    </td>
                    <td className="px-6 py-4">PC</td>
                    <td className="px-6 py-4">{product.brand}</td>
                    <td className="px-6 py-4">${product.price}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>
                            {i < Math.round(product.averageRating) ? (
                              <StarIcon className="w-4 h-4 text-yellow-500" />
                            ) : (
                              <StarIcon className="w-4 h-4 text-gray-300" />
                            )}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="space-x-1 text-gray-600 hover:text-gray-900 transition">
                        <span className="text-xs font-medium">Edit</span>
                        <CogIcon className="w-6 h-6 inline" />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </AdminTable>
        </div>
      </section>
    </>
  );
};

export default AdminProductsComponent;
