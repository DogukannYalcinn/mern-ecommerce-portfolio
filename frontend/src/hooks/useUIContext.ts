import { useContext} from "react";
import {UIContext} from "../context/UIContext.tsx";

const useUIContext = ()=>{
    const context = useContext(UIContext);

    if (context === undefined) {
        throw new Error("useUIContext must be used within a UI Provider");
    }
    return context;
}

export default useUIContext;