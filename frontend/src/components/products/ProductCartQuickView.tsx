import { useState, useRef, useEffect } from "react";
import { ProductType } from "@types";
import CaretRightIcon from "@icons/CaretRightIcon.tsx";
import CaretLeftIcon from "@icons/CaretLeftIcon.tsx";
import CartToggleButton from "@components/ui/CartToggleButton.tsx";

interface Props {
  product: ProductType;
}

const ProductCartQuickView = ({ product }: Props) => {
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

  console.log(product);

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white w-full mx-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image and HeroSlider Section */}
          <div className="md:w-1/2">
            <div className="w-full aspect-square max-h-94 relative overflow-hidden">
              {product.images.map((image, index) => (
                <div
                  key={image._id}
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ease-in-out ${currentIndex === index ? " opacity-100" : " opacity-0"} border-2 border-gray-200 rounded-lg`}
                >
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}/images/${image.url}`}
                    alt={product.title}
                    className="max-w-lg max-h-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Thumbnail HeroSlider */}
            <div className="grid grid-cols-[10%_1fr_10%] items-center w-full">
              <div>
                <button
                  onClick={handlePrev}
                  className="cursor-pointer select-none"
                >
                  <CaretLeftIcon className="w-8 h-8 text-gray-900" />
                </button>
              </div>

              <div
                className="flex snap-x snap-mandatory  overflow-x-scroll scroll-smooth [scrollbar-width:none]"
                ref={scrollContainerRef}
              >
                {product.images.map((img, index) => (
                  <img
                    key={img._id}
                    src={`${import.meta.env.VITE_BASE_URL}/images/${img.url}`}
                    alt={`Image ${index}`}
                    onClick={() => handleThumbnailClick(index)}
                    className={`w-32 h-32 md:w-36 md:h-36 lg:w-48 lg:h-48 object-cover rounded cursor-pointer 
                                ${currentIndex === index ? "opacity-50" : ""}`}
                  />
                ))}
              </div>

              <div>
                <button
                  onClick={handleNext}
                  className="cursor-pointer select-none"
                >
                  <CaretRightIcon className="w-8 h-8 text-gray-900" />
                </button>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex flex-col justify-between">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-2 capitalize ">
                {product.title}
              </h2>

              <h4 className="font-bold capitalize text-gray-500">
                {product.brand}{" "}
              </h4>

              {isOnSale ? (
                <div className="flex items-center gap-2">
                  <div className="text-gray-500 line-through">
                    ${product.price.toFixed(2)}
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    ${product.discountedPrice.toFixed(2)}
                  </p>
                </div>
              ) : (
                <div className="text-2xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </div>
              )}

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
            <CartToggleButton productId={product._id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCartQuickView;
