import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAuthContext from "@hooks/useAuthContext.ts";
import useUIContext from "@hooks/useUIContext.ts";
import Spinner from "@components/ui/Spinner.tsx";
import ProductDetailsComponent from "@pages/products/ProductDetailsComponent.tsx";
import productApi from "@api/productApi.ts";
import userApi from "@api/userApi.ts";
import { ProductType } from "@types";

export type Review = {
  _id: string;
  rating: number;
  comment: string;
  user: { firstName: string; lastName: string };
  createdAt: string;
};

type State = {
  product: null | ProductType;
  isLoading: boolean;
  isStarSendButtonOpen: boolean;
  isError: boolean;
  productReviews: Review[];
};

const ProductDetailsPage = () => {
  const [state, setState] = useState<State>({
    product: null,
    isLoading: false,
    isError: false,
    isStarSendButtonOpen: false,
    productReviews: [],
  });
  const { slug } = useParams();
  const currentUser = useAuthContext().state.currentUser;
  const isAuth = currentUser && currentUser.role === "user";
  const { showToast } = useUIContext();

  useEffect(() => {
    if (!slug) return;
    const getProductBySlug = async () => {
      setState((prevState) => ({ ...prevState, isLoading: true }));
      try {
        const product = await productApi.fetchProductBySlug(slug);
        const productReviews = await productApi.fetchProductReviews(
          product._id,
        );
        setState((prevState) => ({
          ...prevState,
          product: product,
          productReviews: productReviews,
        }));
      } catch (e) {
        showToast("error", "product not found!");
      } finally {
        setState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };
    getProductBySlug();
  }, [slug]);

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (!isAuth || !state.product) return;
    if (!rating) {
      showToast("error", "please provide a rating!");
      return;
    }
    setState((prevState) => ({ ...prevState, isLoading: true }));
    try {
      let newReview = await userApi.createUserReview(
        state.product!._id,
        rating,
        comment,
      );
      const reviewWithUserInfo = {
        ...newReview,
        user: {
          _id: currentUser._id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
        },
      };

      setState((prevState) => ({
        ...prevState,
        productReviews: [...prevState.productReviews, reviewWithUserInfo],
      }));
      showToast("success", "review created successfully!");
    } catch (error) {
      console.error(error);
      // UI
    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  };

  return (
    <>
      {state.isLoading && <Spinner />}
      <ProductDetailsComponent
        product={state.product}
        productReviews={state.productReviews}
        handleSubmitReview={handleSubmitReview}
      />
    </>
  );
};
export default ProductDetailsPage;
