import { ReactNode } from "react";
import useAuthContext from "@hooks/useAuthContext.ts";
import { Navigate } from "react-router-dom";
type Role = "user" | "admin";

type ProtectedRouteProps = {
  children: ReactNode;
  requiredRole: Role;
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { currentUser } = useAuthContext().state;

  if (!currentUser || currentUser.role !== requiredRole) {
    return (
      <Navigate
        to={requiredRole === "admin" ? "/admin/login" : "/auth/login"}
      />
    );
  }

  return <>{children}</>;
};
export default ProtectedRoute;
