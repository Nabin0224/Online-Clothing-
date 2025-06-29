import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const isAdmin = isAuthenticated && user?.role === "admin";
  const isAdminPath = location.pathname.startsWith("/admin");
  const isAuthPath =
    location.pathname.includes("/login") ||
    location.pathname.includes("/register")

  

  // Allow everyone on root ("/")
  if (location.pathname === "/") {
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" />;
    }
    return <>{children}</>;
  }

  // If not authenticated, redirect to login (except auth pages)
  if (!isAuthenticated && !isAuthPath) {
    return <Navigate to="/auth/login" />;
  }

  // If authenticated, prevent access to login/register
  if (isAuthenticated && isAuthPath) {
    return isAdmin ? <Navigate to="/admin/dashboard" /> : <Navigate to="/" />;
  }

  // Admins should only access admin routes
  if (isAdmin && !isAdminPath) {
    return <Navigate to="/admin/dashboard" />;
  }

  // Non-admin users should not access admin routes
  if (!isAdmin && isAdminPath) {
    return <Navigate to="/unauth-page" />;
  }

  return <>{children}</>;
}

export default CheckAuth;