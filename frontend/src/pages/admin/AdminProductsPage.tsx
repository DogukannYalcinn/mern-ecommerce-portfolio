import { useEffect, useState } from "react";
import AdminProductComponent from "@pages/admin/AdminProductsComponent.tsx";
import Spinner from "@components/ui/Spinner.tsx";
import AdminProductForm from "@pages/admin/AdminProductForm.tsx";
import Modal from "@components/ui/Modal.tsx";
import ImageFileReader, { ImageFile } from "@utils/ImageFileReader.ts";
import useUIContext from "@hooks/useUIContext.ts";
import { ProductType } from "@types";
import productApi from "@api/productApi.ts";

export type AdminProductPageStateType = {
  isModalOpen: boolean;
  searchTerm: string[];
  products: ProductType[];
  page: number;
  limit: number;
  filter: string;
  totalCount: number;
  isLoading: boolean;
};

const AdminProductsPage = () => {
  const [state, setState] = useState<AdminProductPageStateType>({
    isModalOpen: false,
    searchTerm: [],
    products: [],
    page: 1,
    totalCount: 0,
    filter: "",
    limit: 10,
    isLoading: false,
  });
  const { showToast } = useUIContext();
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setState((prevState) => ({ ...prevState, isLoading: true }));
      try {
        const response = await productApi.fetchSearchProducts({
          page: state.page,
          limit: state.limit,
          filter: state.filter,
          query: state.searchTerm,
        });
        setState((prevState) => ({
          ...prevState,
          products: response.products,
          totalCount: response.totalCount,
        }));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };
    fetchProducts();
  }, [state.page, state.filter, state.searchTerm, state.limit]);

  const handlePageChange = (pageNumber: number) => {
    setState((prevState) => ({
      ...prevState,
      page: prevState.page + pageNumber,
    }));
  };

  const handleCreateProduct = async (formData: FormData) => {
    //Append image files from state
    uploadedImages.forEach((image) => {
      formData.append("images", image.file);
    });
    try {
      setState((prevState) => ({
        ...prevState,
        isLoading: true,
      }));
      await productApi.createProduct(formData);
      showToast("success", "product created successfully.");
    } catch (error: any) {
      const message = error.response?.data?.message;
      showToast("error", message || "product creation failed!");
    } finally {
      setUploadedImages([]);
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
        isModalOpen: false,
      }));
    }
  };

  const handleFileSelect = async (files: File[]) => {
    try {
      ImageFileReader(files, (newImages) => {
        setUploadedImages((prevState) => [...prevState, ...newImages]);
      });
    } catch (err) {
      console.log(err);
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  };

  const handleImageRemove = async (id: string) => {
    if (!id) return;
    const image = uploadedImages.findIndex((img) => img.id === id) !== -1;
    if (!image) return;
    setUploadedImages((prevState) => prevState.filter((img) => img.id !== id));
  };

  const handleFilterChange = (filter: string) =>
    setState((prevState) => ({ ...prevState, filter, page: 1 }));

  const handleSearchTermChange = (term: string[]) =>
    setState((prevState) => ({
      ...prevState,
      searchTerm: term,
      page: 1,
      filter: "",
    }));

  const handleOpenModal = () =>
    setState((prevState) => ({ ...prevState, isModalOpen: true }));
  const handleFormClose = () =>
    setState((prevState) => ({ ...prevState, isModalOpen: false }));

  return (
    <>
      {state.isLoading && <Spinner />}
      <Modal
        isOpen={state.isModalOpen}
        onClose={() => handleFormClose()}
        isLayer={false}
        size="x-large"
      >
        <AdminProductForm
          product={undefined}
          uploadedImages={uploadedImages}
          onImagesSelect={handleFileSelect}
          onSubmit={handleCreateProduct}
          onImageRemove={handleImageRemove}
        />
      </Modal>

      <AdminProductComponent
        value={state}
        handleSearchTermChange={handleSearchTermChange}
        onFilterChange={handleFilterChange}
        onPageChange={handlePageChange}
        onOpenModal={handleOpenModal}
      />
    </>
  );
};

export default AdminProductsPage;
