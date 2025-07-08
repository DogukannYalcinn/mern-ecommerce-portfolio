import { useContext} from "react";
import {AuthContext} from "../context/AuthContext.tsx";

const useAuthContext = ()=>{
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuthContext must be used within a Authentication Provider");
    }
    return context;
}

export default useAuthContext;