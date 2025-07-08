import CaretLeftIcon from "@icons/CaretLeftIcon.tsx";
import CaretRightIcon from "@icons/CaretRightIcon.tsx";

type Props = {
  onPrev?: () => void;
  onNext?: () => void;
};

const CarouselArrows = ({ onNext, onPrev }: Props) => {
  return (
    <div className="space-x-2">
      <button
        className="p-1 bg-blue-300 backdrop-blur-md hover:bg-blue-500 rounded-full shadow-md transition duration-300 hover:scale-105 active:scale-95"
        onClick={onPrev}
      >
        <CaretLeftIcon className="w-8 h-8 text-white" />
      </button>
      <button
        className="p-1 bg-blue-300 backdrop-blur-md hover:bg-blue-500 rounded-full shadow-md transition duration-300 hover:scale-105 active:scale-95"
        onClick={onNext}
      >
        <CaretRightIcon className="w-8 h-8 text-white" />
      </button>
    </div>
  );
};
export default CarouselArrows;
