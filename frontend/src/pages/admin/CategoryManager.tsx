import { useEffect, useRef, useState } from "react";
import CirclePlusIcon from "@icons/CirclePlusIcon.tsx";
import EditIcon from "@icons/EditIcon.tsx";
import TrashBinIcon from "@icons/TrashBinIcon.tsx";
import { CategoryType } from "@types";

import AdminImagePicker, {
  ImageFile,
} from "@components/ui/AdminImagePicker.tsx";
import ImageFileReader from "@utils/ImageFileReader.ts";
import Modal from "@components/ui/Modal.tsx";
import useUIContext from "@hooks/useUIContext.ts";
import { AdminGeneralSettingProps } from "@pages/admin/AdminGeneralSettingsPage.tsx";
import useProductContext from "@hooks/useProductContext.ts";
import categoryApi from "@api/categoryApi.ts";
import FormErrorMessage from "@components/ui/FormErrorMessage.tsx";
import ConfirmDeleteContent from "@pages/admin/ConfirmDeleteContent.tsx";

type State = {
  categoryTree: CategoryType[];
  activeDropdownCatId: string | null;
  selectedCategory: CategoryType | null;
  mode: "create" | "edit" | "delete" | null;
  isModalOpen: boolean;
  validationErrors: string[];
};

const CategoryManager = ({ setIsLoading }: AdminGeneralSettingProps) => {
  const initialCategoryTree = useProductContext().state.filters.categories;
  const [state, setState] = useState<State>({
    categoryTree: initialCategoryTree,
    activeDropdownCatId: null,
    selectedCategory: null,
    mode: null,
    validationErrors: [],
    isModalOpen: false,
  });

  const [uploadedImage, setUploadedImage] = useState<ImageFile[]>([]);
  const categoryNameInputRef = useRef<HTMLInputElement | null>(null);
  const { showToast } = useUIContext();

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryTree = await categoryApi.fetchCategories();
      setState((prevState) => ({ ...prevState, categoryTree: categoryTree }));
    };
    fetchCategories();
  }, []);

  const toggleDropdownCategoryId = (id: string) => {
    setState((prevState) => ({
      ...prevState,
      activeDropdownCatId: prevState.activeDropdownCatId === id ? null : id,
    }));
  };

  const handleImageRemove = async (id: string) => {
    if (!id) return;
    const image = uploadedImage.findIndex((img) => img.id === id) !== -1;
    if (!image) return;
    setUploadedImage((prevState) => prevState.filter((img) => img.id !== id));
  };

  const handleFileSelect = async (files: File[]) => {
    try {
      ImageFileReader(files, (newImages) => {
        setUploadedImage((prevState) => [...prevState, ...newImages]);
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSelectedCategoryMode = (
    mode: "create" | "edit" | "delete",
    id?: string,
  ) => {
    let selectedCategory: CategoryType | null = null;

    const parentCategory = state.categoryTree.find((cat) => cat._id === id);
    if (parentCategory) {
      selectedCategory = parentCategory;
    } else {
      for (const parent of state.categoryTree) {
        const child = parent.children.find((childCat) => childCat._id === id);
        if (child) {
          selectedCategory = child;
          break;
        }
      }
    }

    setState((prevState) => ({
      ...prevState,
      mode,
      selectedCategory,
      isModalOpen: true,
    }));
  };

  const handleFormClose = () => {
    setState((prevState) => ({
      ...prevState,
      isModalOpen: false,
      selectedCategory: null,
    }));
    setUploadedImage([]);
  };

  const getFormByMode = () => {
    if (state.mode === "delete") {
      return (
        <ConfirmDeleteContent
          onCancel={handleFormClose}
          onConfirm={handleDeleteCategory}
        />
      );
    }

    const isEdit = state.mode === "edit";
    const category = state.selectedCategory;

    return (
      <div className="space-y-4 p-6">
        <ul className=" list-disc pl-6">
          {state.validationErrors.map((error, index) => (
            <li key={index} className="list-disc">
              <FormErrorMessage message={error} />
            </li>
          ))}
        </ul>

        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category Name
          </label>
          <input
            type="text"
            defaultValue={isEdit ? state.selectedCategory?.name : ""}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            id="category-name"
            ref={categoryNameInputRef}
            onFocus={() =>
              setState((prevState) => ({ ...prevState, validationErrors: [] }))
            }
          />
        </div>

        {/* Image Preview */}
        {isEdit && category?.imageUrl && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Image
            </label>
            <img
              src={`${import.meta.env.VITE_BASE_URL}/images/${category.imageUrl}`}
              alt="Category"
              className="w-32 h-32 object-contain border rounded-md"
            />
          </div>
        )}

        <AdminImagePicker
          pickerId={"category"}
          key={"categoryManager"}
          images={uploadedImage}
          onImagesSelect={handleFileSelect}
          onImageRemove={handleImageRemove}
        />

        {/* Action */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() =>
              setState((prev) => ({ ...prev, isModalOpen: false }))
            }
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() =>
              state.mode === "create"
                ? handleCreateCategory()
                : handleEditCategory()
            }
            className="py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            {state.mode === "create" ? "Create" : "Edit"}
          </button>
        </div>
      </div>
    );
  };

  const handleCreateCategory = async () => {
    const categoryName = categoryNameInputRef.current?.value?.trim();
    const errors: string[] = [];
    if (!categoryName) {
      errors.push("Category name is required.");
    }

    if (uploadedImage.length !== 1) {
      errors.push("Please upload exactly 1 image.");
    }

    if (errors.length > 0) {
      setState((prev) => ({
        ...prev,
        validationErrors: errors,
      }));
      return;
    }

    const formData = new FormData();
    formData.append("name", categoryName as string);
    formData.append("images", uploadedImage[0].file);

    if (state.selectedCategory) {
      formData.append("parentId", state.selectedCategory._id);
    }

    try {
      handleFormClose();
      setIsLoading(true);
      const createdCategory = await categoryApi.createCategory(formData);
      setState((prev) => {
        const isChild = !!createdCategory.parentId;
        const createdCategoryWithChildren: CategoryType = {
          ...createdCategory,
          children: [],
        };

        const updatedTree = isChild
          ? prev.categoryTree.map((parent) => {
              if (parent._id === createdCategory.parentId) {
                return {
                  ...parent,
                  children: [...parent.children, createdCategoryWithChildren],
                };
              }
              return parent;
            })
          : [...prev.categoryTree, createdCategoryWithChildren];

        return {
          ...prev,
          categoryTree: updatedTree,
          selectedCategory: null,
          isModalOpen: false,
          validationErrors: [],
        };
      });
      setUploadedImage([]);
      showToast("success", "category created successfully!");
    } catch (err: any) {
      const message = err.response?.data?.message;
      showToast("error", message || "category creation failed!");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!state.selectedCategory) return;
    const categoryName = categoryNameInputRef.current?.value?.trim();
    if (!categoryName || uploadedImage.length > 1) {
      setState((prevState) => ({
        ...prevState,
        validationErrors: [
          ...prevState.validationErrors,
          "please provide a category name and at least 1 category image",
        ],
      }));
      return;
    }
    const formData = new FormData();
    formData.append("name", categoryName as string);
    if (uploadedImage.length === 1) {
      formData.append("images", uploadedImage[0].file);
    }

    try {
      handleFormClose();
      setIsLoading(true);
      const updatedCategory = await categoryApi.editCategory(
        state.selectedCategory._id,
        formData,
      );
      setState((prevState) => {
        const updatedTree = prevState.categoryTree.map((parent) => {
          if (parent._id === updatedCategory._id) {
            return { ...updatedCategory, children: parent.children };
          }
          const updatedChildren = parent.children.map((child) =>
            child._id === updatedCategory._id ? updatedCategory : child,
          );
          return { ...parent, children: updatedChildren };
        });

        return {
          ...prevState,
          categoryTree: updatedTree,
          selectedCategory: null,
          isModalOpen: false,
          validationErrors: [],
        };
      });
      setUploadedImage([]);
      showToast("success", "category updated successfully");
    } catch (err) {
      showToast("error", "category update failed!");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    const { selectedCategory } = state;
    if (!selectedCategory) return;

    try {
      handleFormClose();
      setIsLoading(true);

      await categoryApi.deleteCategory(selectedCategory._id);
      showToast("success", "Category deleted successfully");

      setState((prevState) => {
        const isParent = prevState.categoryTree.some(
          (cat) => cat._id === selectedCategory._id,
        );

        const updatedTree = isParent
          ? prevState.categoryTree.filter(
              (cat) => cat._id !== selectedCategory._id,
            )
          : prevState.categoryTree.map((parent) => ({
              ...parent,
              children: parent.children.filter(
                (child) => child._id !== selectedCategory._id,
              ),
            }));

        return {
          ...prevState,
          categoryTree: updatedTree,
          selectedCategory: null,
          isModalOpen: false,
          validationErrors: [],
        };
      });
    } catch (err) {
      showToast("error", "Failed to delete category");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        key={state.mode}
        isOpen={state.isModalOpen}
        onClose={handleFormClose}
      >
        {getFormByMode()}
      </Modal>
      <section className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={() => handleSelectedCategoryMode("create")}
            className="inline-flex items-center gap-1 whitespace-nowrap bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            <CirclePlusIcon className="w-4 h-4" />
            <span>Add Main Category</span>
          </button>
        </div>
        <ul className="space-y-4">
          {state.categoryTree.map((category, catIndex) => (
            <li
              key={category._id}
              className="bg-white shadow-md rounded-xl border border-gray-200 animate-fadeInDown"
              style={{ animationDelay: `${catIndex * 100}ms` }}
              onClick={() => toggleDropdownCategoryId(category._id)}
            >
              {/* Parent Header */}
              <div className="flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-blue-50 rounded-t-xl">
                <div className="flex items-center gap-2 w-full">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/images/${category.imageUrl}`}
                    alt={category.name}
                    className="h-8 w-8  md:h-12 md:w-12 object-cover"
                  />
                  <button className="inline-flex whitespace-nowrap">
                    <span className="font-semibold text-gray-800 text-sm md:text-lg hover:underline capitalize">
                      {category.name}
                    </span>
                  </button>
                </div>

                <div className="flex gap-3 text-sm text-gray-500">
                  <button
                    className="hover:text-blue-600 inline-flex gap-1 items-center whitespace-nowrap"
                    onClick={() =>
                      handleSelectedCategoryMode("create", category._id)
                    }
                  >
                    <CirclePlusIcon className="h-4 w-4" />
                    <span className="">Add Sub</span>
                  </button>
                  <button
                    className="hover:text-yellow-500 flex gap-1 items-center"
                    onClick={() =>
                      handleSelectedCategoryMode("edit", category._id)
                    }
                  >
                    <EditIcon className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    className="hover:text-red-500 flex gap-1 items-center"
                    onClick={() =>
                      handleSelectedCategoryMode("delete", category._id)
                    }
                  >
                    <TrashBinIcon className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>

              {/* Child Items */}
              <ul
                className={`transition-all duration-300 ${
                  state.activeDropdownCatId === category._id
                    ? "block"
                    : "hidden"
                } px-6 pb-4 pt-2 space-y-4 bg-gray-50 rounded-b-xl`}
              >
                {category.children.map((subCategory, childIndex) => (
                  <li
                    key={subCategory._id}
                    className="animate-fadeInLeft flex items-center justify-between  p-2 bg-white rounded-md shadow-sm hover:bg-gray-100"
                    style={{
                      animationDelay: `${
                        state.activeDropdownCatId === category._id
                          ? childIndex * 100
                          : 0
                      }ms`,
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}/images/${subCategory.imageUrl}`}
                        alt={category.name}
                        className="h-8 w-8  md:h-12 md:w-12 object-cover"
                      />
                      <span className="text-gray-700 inline-flex whitespace-nowrap text-sm md:text-lg capitalize">
                        {subCategory.name}
                      </span>
                    </div>
                    <div className="flex gap-3 text-sm text-gray-500">
                      <button
                        className="hover:text-yellow-500 flex gap-1 items-center"
                        onClick={() =>
                          handleSelectedCategoryMode("edit", subCategory._id)
                        }
                      >
                        <EditIcon className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        className="hover:text-red-500 flex gap-1 items-center"
                        onClick={() =>
                          handleSelectedCategoryMode("delete", subCategory._id)
                        }
                      >
                        <TrashBinIcon className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default CategoryManager;
