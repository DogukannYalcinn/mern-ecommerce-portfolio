import { useState, useRef, useEffect } from "react";
import { ProductType } from "@types";
import CartToggleButton from "@components/ui/CartToggleButton.tsx";
import CarouselArrows from "@components/ui/CarouselArrows.tsx";
import Modal from "@components/ui/Modal.tsx";

interface Props {
  product: ProductType | null | undefined;
  onCloseQuickView: () => void;
}

const ProductCartQuickView = ({ product, onCloseQuickView }: Props) => {
  if (!product) return null;

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    // Smooth scroll to the current thumbnail
    if (scrollContainerRef.current) {
      const thumbnails = scrollContainerRef.current.children;
      const currentThumbnail = thumbnails[currentIndex] as HTMLElement;

      scrollContainerRef.current.scrollTo({
        left:
          currentThumbnail.offsetLeft -
          scrollContainerRef.current.offsetWidth / 2 +
          currentThumbnail.offsetWidth / 2,
        behavior: "smooth",
      });
    }
  }, [currentIndex]);

  const isOnSale = product.discountedPrice > 1 && product.discountedRatio > 1;
  const paragraphs = product?.description.split("\n\n");

  return (
    <>
      <Modal isOpen={true} onClose={onCloseQuickView} key={product._id}>
        <div className="flex flex-col md:flex-row py-6 gap-4">
          {/* Image & Thumbnails */}
          <div className="md:w-1/2 flex flex-col gap-6 p-4 justify-center">
            <div className="w-full aspect-square relative overflow-hidden rounded-xl shadow-sm">
              {product.images.map((image, index) => (
                <div
                  key={image._id}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${
                    currentIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/images/${image.url}`}
                    alt={product.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-center items-center">
              {/* Thumbnails */}
              <div className="flex overflow-x-auto gap-2 scrollbar-hide">
                {product.images.map((img, idx) => (
                  <img
                    key={img._id}
                    src={`${import.meta.env.VITE_BASE_URL}/images/${img.url}`}
                    alt={`Image ${idx}`}
                    onClick={() => handleThumbnailClick(idx)}
                    className={`w-16 h-16 md:w-20 md:h-20 object-contain rounded-lg cursor-pointer border-2 ${
                      currentIndex === idx
                        ? "border-teal-500"
                        : "border-transparent"
                    } transition-all duration-150`}
                  />
                ))}
              </div>
              {/* Slider Arrows */}
              <CarouselArrows onNext={handleNext} onPrev={handlePrev} />
            </div>
          </div>
          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col justify-between p-6 gap-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold capitalize">{product.title}</h2>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 capitalize">
                  {product.brand}
                </span>
                {isOnSale && (
                  <span className="ml-2 bg-pink-100 text-pink-700 px-2 py-0.5 rounded text-xs font-semibold uppercase">
                    On Sale
                  </span>
                )}
              </div>
              {isOnSale ? (
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-2xl font-extrabold text-red-600">
                    ${product.discountedPrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <div className="text-2xl font-extrabold text-gray-900">
                  ${product.price.toFixed(2)}
                </div>
              )}
              {paragraphs &&
                paragraphs.map((paragraph, idx) => (
                  <p
                    key={idx}
                    className="text-gray-800 text-base leading-relaxed capitalize"
                  >
                    {paragraph}
                  </p>
                ))}
            </div>
            <CartToggleButton productId={product._id} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductCartQuickView;
