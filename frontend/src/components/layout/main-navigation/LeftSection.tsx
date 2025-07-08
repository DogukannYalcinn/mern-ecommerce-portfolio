import { NavLink } from "react-router-dom";
import DesktopMenu from "@components/layout/main-navigation/DesktopMenu.tsx";

type Props = {
  isFixed: boolean;
};

const LeftSection = ({ isFixed }: Props) => {
  return (
    <>
      <div className="flex items-center space-x-8">
        <div className="shrink-0">
          <NavLink to="/" title="" className="">
            <img
              className={`block object-cover h-auto ${isFixed ? " w-48" : " w-44"}`}
              src="/images/dummyLogo.png"
              alt=""
            />
          </NavLink>
        </div>

        <DesktopMenu />
      </div>
    </>
  );
};
export default LeftSection;

// <ul className="hidden lg:flex items-center gap-4 xl:gap-8">
//
//     <li>
//                                     <span
//                                         className="flex text-md font-medium text-white hover:text-red-400 transition-colors duration-500 cursor-pointer"
//                                         onMouseEnter={() => handleOpenMenu("category")}>Our ProductsPage</span>
//         <CategoryDropdown isOpen={activeMenu === "category"} onClose={handleCloseMenu}/>
//     </li>
//
//     <li>
//                                     <span
//                                         className="flex text-md font-medium text-white hover:text-red-400 transition-colors duration-500 cursor-pointer"
//                                         onMouseEnter={() => handleOpenMenu("best_seller")}>Best Seller</span>
//         <BestSellersDropdown isOpen={activeMenu === "best_seller"} onClose={handleCloseMenu}/>
//     </li>
//
//
//     <li>
//                                     <span
//                                         className="flex text-md font-medium text-white hover:text-red-400 transition-colors duration-500 cursor-pointer"
//                                         onMouseEnter={() => handleOpenMenu("popular_brands")}>Popular Brands</span>
//         <MostPopularBrandsDropdown brands={popularBrands} isOpen={activeMenu === "popular_brands"}
//                                    onClose={handleCloseMenu}/>
//     </li>
//
//     <li onMouseEnter={() => handleOpenMenu("on_sale")}>
//                 <span
//                     className="flex text-md font-medium text-white hover:text-red-400 transition-colors duration-500 cursor-pointer">On Sale</span>
//         <OnSaleDropdown brands={popularBrands} isOpen={activeMenu === "on_sale"} onClose={handleCloseMenu}/>
//     </li>
// </ul>
