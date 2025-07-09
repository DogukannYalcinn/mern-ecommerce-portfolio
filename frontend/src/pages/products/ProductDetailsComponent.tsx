import { useRef, useState } from "react";
import { Review } from "@pages/products/ProductDetailsPage.tsx";
import { ProductType } from "@types";
import CheckBadgeIcon from "@icons/CheckBadgeIcon.tsx";
import ShoppingCartPlusIcon from "@icons/ShoppingCartPlusIcon.tsx";
import StarIcon from "@icons/StarIcon.tsx";
import HeartIcon from "@icons/HeartIcon.tsx";
import useProductContext from "@hooks/useProductContext.ts";
import useCartContext from "@hooks/useCartContext.ts";
import SearchIcon from "@icons/SearchIcon.tsx";
import useAuthContext from "@hooks/useAuthContext.ts";
import useUIContext from "@hooks/useUIContext.ts";
import { formatDate } from "@utils/formatDate.ts";

type Props = {
  product: ProductType | null;
  productReviews: Review[];
  handleSubmitReview: (rating: number, comment: string) => void;
};

const ProductDetailsComponent = ({
  product,
  productReviews,
  handleSubmitReview,
}: Props) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [starIndex, setStarIndex] = useState(0);
  const userFavoriteProducts = useProductContext().state.products.favorites;
  const { showToast } = useUIContext();
  const { toggleFavorite } = useProductContext();
  const currentUser = useAuthContext().state.currentUser;
  const isAuth = currentUser && currentUser.role === "user";
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const onSubmitUserReview = async () => {
    if (!product) return;
    if (!isAuth) {
      showToast("error", "oops! you must be logged in to review this item.");
      return;
    }

    handleSubmitReview(starIndex, commentRef?.current?.value || "");
    if (commentRef.current) {
      commentRef.current.value = "";
    }
  };

  const handleMouseEnter = (rating: number) => {
    setStarIndex(rating);
  };
  const { addToCart, state: cartState, removeFromCart } = useCartContext();

  const isCartProduct = cartState.list.some((prd) => prd._id === product?._id);

  const handlePostUserFavorite = async () => {
    if (!isAuth || !product) {
      showToast("error", "oops! you must be logged in to favorite this item.");
      return;
    }

    toggleFavorite(product._id);
  };

  let isFavorite = userFavoriteProducts.some((prdId) => prdId === product?._id);

  const paragraphs = product?.description.split("\n\n");

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <SearchIcon className="w-12 h-12 mb-4 text-gray-400" />
        <p className="text-lg font-semibold">No Products Found</p>
        <p className="text-sm mt-2 text-gray-400">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <main className=" min-h-screen flex flex-col items-center mt-10 ">
        <div className="flex flex-col gap-8 max-w-screen-xl p-4">
          <section className="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-16">
            {/*className="shrink-0 max-w-md lg:max-w-lg mx-auto"*/}
            <div className="w-full flex flex-col-reverse md:flex-row gap-4">
              {/* Thumbnails */}
              <div className="flex justify-center md:flex-col flex-row gap-3 overflow-x-auto md:overflow-visible">
                {product.images.map((image, index) => (
                  <div
                    key={image._id}
                    className={`shrink-0 rounded-md border-2 transition-all duration-300 
          ${index === imageIndex ? "border-red-500" : "border-transparent"}`}
                  >
                    <img
                      onClick={() => setImageIndex(index)}
                      className="h-20 w-20 object-cover rounded-md cursor-pointer"
                      src={`${import.meta.env.VITE_BASE_URL}/images/${image.url}`}
                      alt={`Product Thumbnail ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 flex justify-center items-center">
                <div className="relative w-full max-w-lg aspect-square overflow-hidden rounded-md border">
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/images/${product.images[imageIndex].url}`}
                    alt="Selected Product"
                    className="w-full h-full object-contain transition duration-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 lg:mt-0">
              <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl lg:text-3xl  hover:underline cursor-pointer capitalize">
                {product.title}
              </h1>
              <div className="mt-4 sm:items-center sm:gap-4 sm:flex">
                <p className="text-xl font-extrabold text-gray-900 sm:text-xl lg:text-2xl">
                  ${product.price.toFixed(2).replace(".", ",")}
                </p>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  <div className="flex  gap-1">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const starRating = product ? product.averageRating : 0;
                      const starColor =
                        index < starRating
                          ? "text-yellow-300"
                          : "text-gray-300";

                      return (
                        <button key={index}>
                          <StarIcon className={`w-6 h-6 ${starColor}`} />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-sm font-medium leading-none text-gray-500 ">
                    <span>
                      ({product ? product.averageRating.toFixed(1) : 0})
                    </span>
                  </p>
                  <a
                    href="#"
                    className="text-sm font-medium leading-none text-gray-500 underline hover:no-underline"
                  >
                    {product ? `(${product.totalReviews}) Reviews` : null}
                  </a>
                </div>
              </div>

              <div className="mt-6 grid gap-2 md:grid-cols-3 md:gap-2">
                <button
                  onClick={handlePostUserFavorite}
                  className={`flex items-center justify-center py-2.5 px-5 text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4  transition-all duration-500 ${
                    isFavorite
                      ? "bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 focus:ring-red-400"
                      : "bg-gray-600 text-gray-100 border-gray-600 hover:bg-gray-700 focus:ring-gray-700"
                  }`}
                  role="button"
                >
                  <HeartIcon className="w-5 h-5 -ms-2 me-2 transition-all" />

                  {isFavorite ? "Your Favorite" : "Add To Favorite"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    isCartProduct
                      ? removeFromCart(product!._id)
                      : addToCart(product!._id)
                  }
                  className={`inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white capitalize  focus:outline-none focus:ring-4 ${isCartProduct ? "bg-green-500 hover:bg-green-600 focus:ring-green-300" : "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300"}`}
                >
                  {isCartProduct ? (
                    <>
                      <CheckBadgeIcon className="-ms-2 me-2 h-5 w-5" />
                      Added
                    </>
                  ) : (
                    <>
                      <ShoppingCartPlusIcon className="-ms-2 me-2 h-5 w-5" />
                      Add to cart
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-2">
                <hr className="my-6 md:my-8 border-gray-800" />
                <div className="flex flex-wrap gap-2 mt-4">
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-sm bg-gray-100 text-blue-500 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                {paragraphs &&
                  paragraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="space-y-4 text-gray-800 text-base leading-relaxed capitalize"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>
          </section>

          {/*REVIEWS SECTION*/}
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-medium">Comments</h2>
            <div className="mt-6 divide-y divide-gray-200">
              {productReviews.map((review) => (
                <div
                  key={review._id}
                  className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-md bg-white shadow-sm mb-4"
                >
                  {/* LEFT - User Info */}
                  <div className="sm:w-64 space-y-2">
                    {/* Stars */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({
                        length: Math.ceil(product!.averageRating),
                      }).map((_, index) => (
                        <StarIcon
                          key={index}
                          className="h-4 w-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>

                    {/* User Name + Date */}
                    <div className="space-y-0.5">
                      <p className="text-base font-semibold text-gray-900">
                        {review.user.firstName} {review.user.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>

                    {/* Verified Badge */}
                    <div className="inline-flex items-center gap-1">
                      <CheckBadgeIcon className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-700 font-medium">
                        Verified purchase
                      </span>
                    </div>
                  </div>

                  {/* RIGHT - Comment */}
                  <div className="flex-1 bg-gray-50 p-4 rounded-md">
                    <p className="text-sm md:text-base text-gray-800 leading-relaxed whitespace-pre-line">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">Leave a Review</h2>
              <div className="flex flex-col gap-4">
                {/* Star Rating */}
                <div className="flex space-x-2">
                  {[...Array(5)].map((_, index) => (
                    <button
                      key={index}
                      onMouseEnter={() => handleMouseEnter(index + 1)}
                    >
                      <StarIcon
                        className={`w-8 h-8 cursor-pointer ${index < starIndex ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  className="w-full p-2 bg-gray-200 border rounded-md focus:ring-2 focus:ring-gray-400 focus:outline-none"
                  rows={4}
                  name="comment"
                  ref={commentRef}
                  placeholder="Write your review..."
                />

                {/* Submit Button */}
                <button
                  type="button"
                  className="self-end bg-blue-500 text-white w-1/3 py-2 rounded-lg hover:bg-blue-600"
                  onClick={onSubmitUserReview}
                >
                  Send Review({starIndex})
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default ProductDetailsComponent;
