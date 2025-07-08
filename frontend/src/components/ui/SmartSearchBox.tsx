import { ChangeEvent, useRef, useState } from "react";
import useProductContext from "@hooks/useProductContext.ts";
import SearchIcon from "@icons/SearchIcon.tsx";
import { Suggestion } from "@components/layout/main-navigation/SearchModalContent.tsx";
import { NavLink, useNavigate } from "react-router-dom";

type Props = {
  suggestions: Suggestion[];
  handleSearchTermsChange: (searchTerms: string) => void;
  isLoading: boolean;
  defaultPlaceHolder: string | undefined;
};

const SmartSearchBox = ({
  handleSearchTermsChange,
  isLoading,
  suggestions,
  defaultPlaceHolder,
}: Props) => {
  const [searchTerms, setSearchTerms] = useState<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { state } = useProductContext();

  const boostedProducts = state.products.boosted.slice(0, 10);
  const trendingTags = [
    ...new Set(
      boostedProducts.flatMap((prd) =>
        prd.tags.flatMap((tag) => tag.split(",").map((t) => t.trim())),
      ),
    ),
  ];

  const navigate = useNavigate();

  const onSearchTermChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.toLowerCase();
    triggerSearch(value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (searchTerms.length > 1) {
        const searchTermsArray = searchTerms
          .trim()
          .split(" ")
          .filter((term) => term.trim() !== "");
        navigate(`/products/search?q=${searchTermsArray.join(",")}`);
      }
    }
  };

  const triggerSearch = (value: string) => {
    setSearchTerms(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      handleSearchTermsChange(value);
    }, 500);
  };

  const handleSelectedTag = (tag: string) => {
    setSearchTerms(tag);
    triggerSearch(tag);
  };

  return (
    <div className="space-y-4 w-full">
      {/* SearchProductsPage Input */}
      <div className="flex justify-center">
        <div className="relative w-full max-w-4xl">
          <input
            type="text"
            onChange={onSearchTermChange}
            onKeyDown={handleSearchKeyDown}
            value={searchTerms}
            placeholder={
              defaultPlaceHolder || "Search products by name, brand, or tags..."
            }
            className="w-full p-3 pr-12 text-base md:text-lg text-gray-800 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2"
            aria-label={"Search"}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <SearchIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && searchTerms && (
        <div className="bg-white border border-gray-300 rounded-lg w-full max-w-4xl mx-auto mt-2 shadow-lg overflow-y-auto z-10 animate-fadeInDown">
          <ul className="divide-y divide-gray-200">
            {suggestions.slice(0, 5).map((suggestion, index) => (
              <li
                key={index}
                className="p-3 text-gray-700 hover:bg-gray-100 cursor-pointer transition"
              >
                <NavLink to={`/products/${suggestion.slug}`}>
                  <span className="capitalize text-sm font-medium">
                    {suggestion.title}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Trending Tags */}
      {trendingTags.length > 0 && (
        <div className="flex flex-wrap justify-center items-center gap-2 text-sm text-gray-600 max-w-5xl mx-auto px-2">
          <span className="font-semibold whitespace-nowrap">Trending:</span>
          <div className="flex flex-wrap gap-2">
            {trendingTags.slice(0, 5).map((tag, index) => (
              <button
                key={index}
                onClick={() => handleSelectedTag(tag)}
                className="px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-600 rounded-md transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearchBox;
