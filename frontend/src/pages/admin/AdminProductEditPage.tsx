import { useEffect, useState } from "react";
import { ProductType, ProductImageType } from "@types";
import { NavLink, useParams } from "react-router-dom";
import productApi from "@api/productApi.ts";
import CloseCircleIcon from "@icons/CloseCircleIcon.tsx";
import Modal from "@components/ui/Modal.tsx";
import { ImageFile } from "@components/ui/AdminImagePicker.tsx";
import ImageFileReader from "@utils/ImageFileReader.ts";
import AdminProductForm from "@pages/admin/AdminProductForm.tsx";
import useUIContext from "@hooks/useUIContext.ts";
import Spinner from "@components/ui/Spinner.tsx";
import ConfirmDeleteContent from "@pages/admin/ConfirmDeleteContent.tsx";
import CaretLeftIcon from "@icons/CaretLeftIcon.tsx";

type StateType = {
  product: ProductType | null;
  isLoading: boolean;
  previewImage: ProductImageType | null;
  isProductDeleteModalOpen: boolean;
  uploadedImages: ImageFile[];
};

const AdminProductEditPage = () => {
  const { showToast } = useUIContext();
  const { slug } = useParams<{ slug: string }>();
  const [state, setState] = useState<StateType>({
    product: null,
    isLoading: false,
    previewImage: null,
    isProductDeleteModalOpen: false,
    uploadedImages: [],
  });
  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setState((prevState) => ({ ...prevState, isLoading: true }));

      try {
        const product = await productApi.fetchProductBySlug(slug);

        setState((prevState) => ({
          ...prevState,
          product,
          previewImage: product.images[0],
        }));
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };

    fetchProduct();
  }, [slug]);

  const handleEditProduct = async (formData: FormData) => {
    if (!state.product) return;
    //APPEND UPLOADED IMAGES
    console.log("handle product edit before create http req");
    state.uploadedImages.forEach((image) => {
      formData.append("images", image.file);
    });
    try {
      const updatedProduct = await productApi.updateProduct(
        state.product._id,
        formData,
      );
      setState((prevState) => ({
        ...prevState,
        product: updatedProduct,
        previewImage: updatedProduct.images[0] ?? null,
        uploadedImages: [],
      }));
      showToast("success", "product updated successfully.");
    } catch (error) {
      showToast("error", "product edit failed!");
    }
  };

  const handleFileSelect = async (files: File[]) => {
    try {
      ImageFileReader(files, (newImages) => {
        setState((prevState) => ({
          ...prevState,
          uploadedImages: [...prevState.uploadedImages, ...newImages],
        }));
      });
    } catch (err) {
      console.log(err);
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  };

  const setSelectedPreviewImage = (_id: string) => {
    if (!state.product?.images) return;
    const selectedImage = state.product.images.find((img) => img._id === _id);
    if (!selectedImage) return;
    setState((prevState) => ({ ...prevState, previewImage: selectedImage }));
  };

  const handleRemoveSelectedProductImage = async () => {
    if (!state.previewImage || !state.product) return;

    if (state.product.images.length === 1) {
      setState((prevState) => ({
        ...prevState,
        isProductDeleteModalOpen: false,
      }));
      showToast("error", "You must have at least one product image.");
      return;
    }

    try {
      await productApi.deleteProductImage(
        state.product._id,
        state.previewImage._id,
      );

      setState((prevState) => {
        const updatedImages = prevState.product!.images.filter(
          (img) => img._id !== prevState.previewImage!._id,
        );

        return {
          ...prevState,
          previewImage: updatedImages[0],
          product: {
            ...prevState.product!,
            images: updatedImages,
          },
        };
      });

      showToast("success", "Image deleted successfully.");
    } catch (err) {
      console.error(err);
      showToast("error", "Failed to delete image. Please try again.");
    } finally {
      setState((prevState) => ({
        ...prevState,
        isProductDeleteModalOpen: false,
      }));
    }
  };

  const handleRemoveUploadedImage = async (id: string) => {
    if (!id) return;

    const image = state.uploadedImages.findIndex((img) => img.id === id) !== -1;

    if (!image) return;

    console.log(image);
    setState((prevState) => ({
      ...prevState,
      uploadedImages: prevState.uploadedImages.filter((img) => img.id !== id),
    }));
  };

  const handleCloseDeleteModal = () => {
    setState((prevState) => ({
      ...prevState,
      isProductDeleteModalOpen: false,
    }));
  };

  if (state.isLoading || !state.product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Modal
        isOpen={state.isProductDeleteModalOpen}
        onClose={handleCloseDeleteModal}
      >
        <ConfirmDeleteContent
          onCancel={handleCloseDeleteModal}
          onConfirm={handleRemoveSelectedProductImage}
        />
      </Modal>

      <div className="max-w-7xl mx-auto p-4 min-h-screen space-y-4">
        <div className="flex gap-4">
          <NavLink
            to="/admin/products"
            className="p-2 bg-blue-300 backdrop-blur-md hover:bg-blue-500 rounded-full shadow-md transition duration-300 hover:scale-105 active:scale-95"
          >
            <CaretLeftIcon className="w-6 h-6 text-white" />
          </NavLink>
          <h1 className="text-2xl font-bold text-gray-500">Back to Products</h1>
        </div>
        {/*<div className="mb-6">*/}
        {/*  <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>*/}
        {/*</div>*/}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Images */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              {state.product.images.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:4000/images/${img.url}`}
                  alt={state.product?.title}
                  className="w-28 h-28 object-cover rounded cursor-pointer border border-gray-300 hover:border-blue-400 shadow-sm"
                  onClick={() => setSelectedPreviewImage(img._id)}
                />
              ))}
            </div>
            {/*PREVIEW*/}
            <div className="flex-1">
              {state.previewImage && (
                <div className="relative shadow-sm">
                  <img
                    src={`http://localhost:4000/images/${state.previewImage.url}`}
                    alt={state.product.title}
                    className="w-full max-h-[590px] object-contain rounded-lg border"
                  />
                  <button
                    className="absolute top-2 right-2"
                    onClick={() =>
                      setState((prevState) => ({
                        ...prevState,
                        isProductDeleteModalOpen: true,
                      }))
                    }
                  >
                    <CloseCircleIcon className="w-10 h-10 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </div>
          {/*EDIT FORM*/}
          <div className="flex-1">
            <AdminProductForm
              product={state.product}
              uploadedImages={state.uploadedImages}
              onImagesSelect={handleFileSelect}
              onImageRemove={handleRemoveUploadedImage}
              onSubmit={handleEditProduct}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProductEditPage;
