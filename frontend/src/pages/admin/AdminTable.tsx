import SearchIcon from "@icons/SearchIcon.tsx";
import CirclePlusIcon from "@icons/CirclePlusIcon.tsx";
import CaretRightIcon from "@icons/CaretRightIcon.tsx";
import RightArrowIcon from "@icons/RightArrowIcon.tsx";

type Props = {
  title: string;
  headers: string[];
  searchInputPlaceholder?: string;
  onSearchTermChange?: (val: string) => void;
  filter?: FilterProps;
  pagination: PaginationProps;
  onAddClick?: () => void;
  children: React.ReactNode;
};

type FilterOption = { value: string; label: string };

type FilterProps = {
  enabled: boolean;
  value: string;
  options: FilterOption[];
  onChange: (val: string) => void;
};

type PaginationProps = {
  page: number;
  limit: number;
  totalCount: number;
  onPageChange: (step: number) => void;
};

const AdminTable = ({
  title,
  headers,
  onSearchTermChange,
  filter,
  pagination,
  onAddClick,
  children,
  searchInputPlaceholder,
}: Props) => {
  const displayedItemStart = (pagination.page - 1) * pagination.limit + 1;
  const displayedItemEnd = Math.min(
    pagination.page * pagination.limit,
    pagination.totalCount,
  );

  const totalPageCount = Math.ceil(pagination.totalCount / pagination.limit);
  const canNavigatePrev = pagination.page > 1;
  const canNavigateNext = pagination.page < totalPageCount;

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <span className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-medium text-gray-900">
            {displayedItemStart}–{displayedItemEnd}
          </span>{" "}
          of{" "}
          <span className="font-medium text-gray-900">
            {pagination.totalCount}
          </span>
        </span>
      </div>

      {/* Tools */}
      <div className="flex flex-col md:flex-row justify-between gap-4 p-4 border-b">
        {/* SearchProductsPage */}
        <div className="w-full md:w-1/2">
          {onSearchTermChange && (
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <SearchIcon className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder={searchInputPlaceholder}
                className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => onSearchTermChange(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-2 flex-shrink-0">
            {onAddClick && (
              <button
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow"
                onClick={onAddClick}
              >
                <CirclePlusIcon className="h-4 w-4 mr-2" />
                Add
              </button>
            )}
            {filter?.enabled && (
              <div className="relative inline-block">
                <select
                  className="appearance-none flex items-center pr-8 pl-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 bg-white hover:bg-gray-100 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                >
                  {filter.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2">
                  <CaretRightIcon className="w-4 h-4 text-gray-500 rotate-90" />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {canNavigatePrev && (
              <button
                className="p-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
                onClick={() => pagination.onPageChange(-1)}
              >
                <RightArrowIcon className="w-4 h-4 rotate-180" />
              </button>
            )}
            {canNavigateNext && (
              <button
                className="p-2 rounded-lg border text-gray-600 hover:bg-gray-100 transition"
                onClick={() => pagination.onPageChange(1)}
              >
                <RightArrowIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wide">
            <tr>
              {headers.map((head, i) => (
                <th key={i} className="px-6 py-4 text-left">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">{children}</tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminTable;
