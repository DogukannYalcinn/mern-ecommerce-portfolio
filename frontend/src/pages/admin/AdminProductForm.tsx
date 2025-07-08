import { FormEvent, useState } from "react";
import AdminImagePicker, {
  ImageFile,
} from "@components/ui/AdminImagePicker.tsx";
import { ProductType } from "@types";
import RocketIcon from "@icons/RocketIcon.tsx";
import { productFormValidation } from "@utils/formValidations.ts";
import useProductContext from "@hooks/useProductContext.ts";
import FormErrorMessage from "@components/ui/FormErrorMessage.tsx";

interface AdminProductFormProps {
  product: ProductType | undefined;
  uploadedImages: ImageFile[];
  onImagesSelect: (files: File[]) => void;
  onImageRemove: (id: string) => void;
  onSubmit: (formData: FormData) => void;
}

type State = {
  price: number;
  discountedRatio: number;
  mode: "create" | "edit";
  selectedCategorySlugs: string[];
  isBoosted: boolean;
};

export const AdminProductForm = ({
  product,
  uploadedImages,
  onImagesSelect,
  onImageRemove,
  onSubmit,
}: AdminProductFormProps) => {
  const categories = useProductContext().state.filters.categories;
  const childCategories = useProductContext().state.filters.categories.flatMap(
    (c) => c.children,
  );
  const allCategories = [
    ...categories.map((cat) => ({ _id: cat._id, slug: cat.slug })),
    ...childCategories.map((child) => ({ _id: child._id, slug: child.slug })),
  ];

  const initialCategorySlugs =
    product?._id && product.categoryIds
      ? allCategories
          .filter((c) => product.categoryIds.includes(c._id))
          .map((c) => c.slug)
      : [];

  //STATE
  const [state, setState] = useState<State>({
    isBoosted: product ? product.isBoosted : false,
    price: product?.price ?? 0,
    discountedRatio: product?.discountedRatio ?? 0,
    mode: product?._id ? "edit" : "create",
    selectedCategorySlugs: initialCategorySlugs,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // Adjusting isBoosted
    formData.set("isBoosted", state.isBoosted ? "true" : "false");

    //Tags
    const rawTags = formData.get("tags") as string;

    state.selectedCategorySlugs.forEach((slug) => {
      formData.append("categorySlugs", slug);
    });

    if (state.discountedRatio > 0) {
      formData.append("discountedRatio", state.discountedRatio.toString());
    }

    let rawDescription = formData.get("description") as string;
    console.log(rawDescription);
    if (rawDescription) {
      const sanitized = rawDescription
        .replace(/\r\n|\r|\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
      console.log("SANITIZED:", JSON.stringify(sanitized));
      formData.set("description", sanitized);
    }

    const formObject = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      brand: formData.get("brand") as string,
      price: state.price,
      stock: parseInt(formData.get("stock") as string),
      categorySlugs: state.selectedCategorySlugs,
      tags: rawTags
        ? rawTags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "")
        : [],
    };

    const errors = productFormValidation(formObject);

    if (Object.values(errors).some((value) => value)) {
      setValidationErrors(errors);
      return;
    }

    if (state.mode === "create") {
      if (uploadedImages.length < 1 || uploadedImages.length > 5) {
        setValidationErrors((prevState) => ({
          ...prevState,
          image: "Please upload between 1 and 5 images.",
        }));
        return;
      }
    } else if (state.mode === "edit") {
      if (!product?._id || !product.images) return;

      const totalImages = uploadedImages.length + product.images.length;

      if (totalImages < 1 || totalImages > 5) {
        setValidationErrors((prevState) => ({
          ...prevState,
          image: "Please upload between 1 and 5 images.",
        }));
        return;
      }
    }
    onSubmit(formData);
  };

  const handlePriceChange = (value: number) => {
    setState((prevState) => ({
      ...prevState,
      price: isNaN(value) ? 0 : value,
    }));
  };

  const handleDiscountedRatioChange = (value: number) => {
    setState((prevState) => ({
      ...prevState,
      discountedRatio: isNaN(value) ? 0 : value,
    }));
  };

  const resetValidationErrors = () => setValidationErrors({});

  const handleSelectedCategory = (categorySlug: string) => {
    if (!categorySlug) return;

    setState((prevState) => {
      const isInclude = prevState.selectedCategorySlugs.includes(categorySlug);

      const updatedCategories = isInclude
        ? prevState.selectedCategorySlugs.filter(
            (slug) => slug !== categorySlug,
          )
        : [...prevState.selectedCategorySlugs, categorySlug];

      return {
        ...prevState,
        selectedCategorySlugs: updatedCategories,
      };
    });
  };

  const handleRemoveCategory = (categorySlug: string) => {
    if (!categorySlug) return;
    setState((prevState) => ({
      ...prevState,
      selectedCategorySlugs: prevState.selectedCategorySlugs.filter(
        (slug) => slug !== categorySlug,
      ),
    }));
  };

  const handleBoostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.currentTarget.checked;
    setState((prevState) => ({ ...prevState, isBoosted: isChecked }));
  };

  const calculatedDiscountedPrice =
    (state.price * (100 - state.discountedRatio)) / 100;

  return (
    <div className="bg-white p-6  rounded-xl shadow-lg">
      <form onSubmit={handleFormSubmit} method="POST" className="space-y-10">
        <div className="flex-1 space-y-4">
          {/* Boosted */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isBoosted"
                name="isBoosted"
                checked={state.isBoosted}
                onChange={handleBoostChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="isBoosted"
                className="text-sm font-medium text-gray-700 flex gap-0.5 items-center cursor-pointer"
              >
                Boost this product
                <RocketIcon
                  className={`text-green-500 ${
                    state.isBoosted
                      ? "animate-pulse w-8 h-8 transition-all duration-300 ease-out"
                      : "w-6 h-6 transition-all duration-300 ease-in"
                  }`}
                />
              </label>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              defaultValue={product?.title || ""}
              onFocus={resetValidationErrors}
              name="title"
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FormErrorMessage message={validationErrors.title} />
          </div>

          {/* Price - BRAND */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Price</label>
              <input
                type="text"
                name="price"
                onFocus={resetValidationErrors}
                defaultValue={state.price}
                onChange={(e) => handlePriceChange(parseFloat(e.target.value))}
                className="mt-1 w-full border rounded px-3 py-2"
              />
              <FormErrorMessage message={validationErrors.price} />
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Brand</label>
              <input
                type="text"
                defaultValue={product?.brand || ""}
                name="brand"
                onFocus={resetValidationErrors}
                className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FormErrorMessage message={validationErrors.brand} />
            </div>
          </div>

          {/* DiscountedRatio and DiscountedPrice */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Discounted Ratio (%)
              </label>
              <input
                type="text"
                defaultValue={state.discountedRatio}
                onFocus={resetValidationErrors}
                onChange={(e) =>
                  handleDiscountedRatioChange(parseFloat(e.target.value))
                }
                className="mt-1 w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Discounted Price
              </label>
              <input
                type="text"
                readOnly
                value={calculatedDiscountedPrice}
                className="mt-1 w-full border bg-gray-100 rounded px-3 py-2 text-gray-500"
              />
            </div>
          </div>

          {/* Selected Categories Slugs */}
          <div className="flex flex-wrap gap-2">
            {state.selectedCategorySlugs.map((slug) => (
              <div
                key={slug}
                className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center gap-2"
              >
                {slug.replace(/-/g, " ")}
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(slug)}
                  className="text-blue-500 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Parent and Child Categories Options */}
          <div className="flex items-center gap-4">
            {/*Parent Categories */}
            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="mainCategory"
              >
                Main Categories
              </label>
              <select
                id="mainCategory"
                onFocus={resetValidationErrors}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleSelectedCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories
                  .filter(
                    (prd) => !state.selectedCategorySlugs.includes(prd.slug),
                  )
                  .map((category) => (
                    <option
                      style={{ textTransform: "uppercase" }}
                      key={category._id}
                      value={category.slug}
                    >
                      {category.name.toUpperCase()}
                    </option>
                  ))}
              </select>
              <FormErrorMessage message={validationErrors.categorySlugs} />
            </div>

            {/*Child Categories */}
            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="childCategory"
              >
                Sub Categories
              </label>
              <select
                id="childCategory"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => handleSelectedCategory(e.target.value)}
                onFocus={resetValidationErrors}
              >
                <option value="">Select a category</option>
                {childCategories
                  .filter(
                    (prd) => !state.selectedCategorySlugs.includes(prd.slug),
                  )
                  .map((category) => (
                    <option
                      style={{ textTransform: "uppercase" }}
                      key={category._id}
                      value={category.slug}
                    >
                      {category.name.toUpperCase()}
                    </option>
                  ))}
              </select>
              <FormErrorMessage message={validationErrors.categorySlugs} />
            </div>
          </div>

          {/* Tags and Stock */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                onFocus={resetValidationErrors}
                defaultValue={product?.stock ?? ""}
                name="stock"
                className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FormErrorMessage message={validationErrors.stock} />
            </div>

            {/* Tags */}
            <div className="flex-1">
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="tags"
              >
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                onFocus={resetValidationErrors}
                name="tags"
                defaultValue={(product?.tags || []).join(", ")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FormErrorMessage message={validationErrors.tags} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              defaultValue={product?.description || ""}
              onFocus={resetValidationErrors}
              name="description"
              className="mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <FormErrorMessage message={validationErrors.description} />
          </div>

          {/* Images */}
          <div>
            <FormErrorMessage message={validationErrors.image} />
            <h3 className="text-md font-semibold text-gray-800 mb-2">
              Product Images
            </h3>

            <AdminImagePicker
              pickerId={"createProduct"}
              images={uploadedImages}
              onImagesSelect={onImagesSelect}
              onImageRemove={onImageRemove}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
