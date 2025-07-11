import HeroSlider from "@pages/home/HeroSlider.tsx";
import ChildCategories from "@pages/home/ChildCategories.tsx";
import HeroBanner from "@pages/home/HeroBanner.tsx";
import BestSellers from "@pages/home/BestSellers.tsx";
import OnSale from "@pages/home/OnSale.tsx";
import NewArrivals from "@pages/home/NewArrivals.tsx";
import FeaturedProducts from "@pages/home/FeaturedProducts.tsx";
import ProductTabs from "@pages/home/ProductTabs.tsx";
import TodayDeals from "@pages/home/TodayDeals.tsx";

const IndexPage = () => {
  return (
    <>
      <HeroSlider />
      <ChildCategories />
      <HeroBanner />

      {/*<CartSlider />*/}

      <BestSellers />
      <OnSale />
      <NewArrivals />
      <FeaturedProducts />
      <ProductTabs />
      <TodayDeals />
    </>
  );
};

export default IndexPage;
