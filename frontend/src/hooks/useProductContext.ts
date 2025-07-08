import { useContext} from "react";
import {ProductContext} from "../context/ProductContext.tsx";

const useProductContext = ()=>{
    const context = useContext(ProductContext);

    if (context === undefined) {
        throw new Error("useProductContext must be used within a ProductProvider");
    }
    return context;
}

export default useProductContext;