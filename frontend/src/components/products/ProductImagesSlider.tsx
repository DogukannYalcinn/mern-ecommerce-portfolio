import { useState } from "react";

type Props = { images: { id?: string | number; url: string }[] };

const ProductImagesSlider = ({ images }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            currentIndex === index ? "opacity-100 scale-105" : "opacity-0"
          }`}
        >
          <img
            className="h-full w-full object-contain"
            src={`http://localhost:4000/images/${image.url}`}
            alt={`Product Image ${index + 1}`}
          />
        </div>
      ))}

      <div className="absolute -bottom-6 flex space-x-3">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-110 hover:bg-blue-300  ${
              currentIndex === index ? "bg-blue-500 scale-125" : "bg-gray-300"
            }`}
            onClick={() => setCurrentIndex(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ProductImagesSlider;
