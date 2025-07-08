import { useContext} from "react";
import {CartContext} from "../context/CartContext.tsx";

const useCartContext = ()=>{
    const context = useContext(CartContext);

    if (context === undefined) {
        throw new Error("useCartContext must be used within a CartContext Provider");
    }
    return context;
}

export default useCartContext;