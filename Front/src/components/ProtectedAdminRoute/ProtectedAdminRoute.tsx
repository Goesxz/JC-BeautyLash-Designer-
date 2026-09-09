import { Navigate } from "react-router-dom";
import { isAdminAuthenticated } from "../../utils/adminAuth";

type ProtectedAdminRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedAdminRoute({
  children,
}: ProtectedAdminRouteProps) {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
