import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { signed } = useContext(AuthContext);

  if (!signed) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
