import SimpleProductSlider from "@components/products/SimpleProductSlider.tsx";
import useProductContext from "@hooks/useProductContext.ts";

const NewArrivals = () => {
  const newArrivalProducts = useProductContext().state.products.newArrivals;
  return (
    <>
      <section className="sm:min-h-screen overflow-hidden flex flex-col items-center md:justify-center">
        <div className="relative flex flex-col gap-4 w-full lg:w-11/12 mx-auto p-3">
          <div className="px-2 pt-2 xs:px-0 flex flex-col gap-3">
            <h2 className="text-4xl  tracking-tight font-extrabold text-gray-900">
              New Arrivals
            </h2>
            <p className="font-light text-gray-500 sm:text-xl">
              Here at VoltBuy we focus on markets where technology, innovation,
              and capital can unlock long-term value and drive economic growth.
            </p>
          </div>

          <SimpleProductSlider products={newArrivalProducts} />
        </div>
      </section>
    </>
  );
};
export default NewArrivals;
