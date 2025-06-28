import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, requireAdmin = false }) {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("is_admin") === "true"; // نحفظ is_admin في LocalStorage بعد تسجيل الدخول

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/products" replace />;
  }

  return children;
}
