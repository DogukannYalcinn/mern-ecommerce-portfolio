import { useState, useEffect } from "react";
import useProductContext from "@hooks/useProductContext.ts";
import { useNavigate } from "react-router-dom";
const HeroSlider = () => {
  const sliders = useProductContext().state.ui.sliderBanners;
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliders.length);
    }, 10000);
    return () => clearInterval(interval);
  });

  return (
    <>
      <div className=" relative w-full h-[50vh] md:h-[70vh] overflow-hidden bg-gray-900 z-0">
        <>
          <div className="lg:hidden absolute inset-0 bg-black opacity-50 z-10"></div>
          {sliders.map((slider, index) => (
            <img
              key={slider._id}
              src={`${import.meta.env.VITE_BASE_URL}/images/${slider.imageUrl}`}
              alt={slider.title || "Slider image"}
              className={`absolute inset-0 w-full h-[70vh] object-cover object-[85%_center] md:object-[95%_center] -z-10
                              ${currentIndex === index ? "animate-slideInLeft z-0" : "animate-slideOutRight"}
                            `}
            />
          ))}
        </>

        {/* Text ve Button  left-1/4*/}
        <div
          key={currentIndex}
          className="relative flex flex-col justify-center max-w-7xl mx-auto h-full text-white z-20 animate-slideDown "
        >
          <div className="flex flex-col gap-4 md:gap-6 p-6 xl:p-2">
            <h1 className="text-2xl leading-tight">
              <strong className="text-teal-300 text-3xl md:text-6xl block capitalize">
                {sliders[currentIndex]?.title}
              </strong>
              <span className="text-white text-2xl md:text-4xl capitalize">
                {sliders[currentIndex]?.subtitle}
              </span>
            </h1>

            <p className="text-sm md:text-xl text-gray-200 capitalize">
              {sliders[currentIndex]?.description}
            </p>

            <button
              className="bg-transparent w-1/2 md:w-1/4 border text-xl py-2 border-white text-white rounded-full hover:bg-white hover:text-black transition-all duration-500"
              onClick={() => navigate(`${sliders[currentIndex]?.link}`)}
            >
              Shop Now
            </button>
          </div>
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex space-x-4 items-center ">
            {sliders.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transform transition-all duration-300 ease-out ${
                  currentIndex === index
                    ? "w-12 h-2 bg-orange-300 scale-y-90 rounded"
                    : "w-5 h-5 bg-gray-500 hover:bg-teal-300 rounded-full"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center bg-orange-500 w-full gap-4 md:gap-6 p-3 group">
        <div className="flex-shrink-0">
          <img
            src="https://cdn.shopify.com/s/files/1/0081/3305/0458/files/icon-ano.png?v=1644987771"
            alt="Icon"
          />
        </div>
        <div className="flex-shrink-0 group-hover:scale-105">
          <h2 className="uppercase font-semibold">
            BUY NOW, PAY LATER STARTING AT 0% APR
          </h2>
        </div>
        <div className="w-full sm:w-auto text-center sm:text-left">
          <button className="px-4 py-2 border border-gray-900 rounded font-semibold capitalize group-hover:text-white group-hover:bg-orange-700 group-hover:border group-hover:border-white transiton duration-500">
            Learn More
          </button>
        </div>
      </div>
    </>
  );
};
export default HeroSlider;
