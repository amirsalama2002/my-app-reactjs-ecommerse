import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import OrderDetails from "./pages/OrderDetails";
import OrderList from "./pages/OrderList";
import ProductCreate from "./pages/ProductCreate";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* صفحات عامة */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* صفحات محمية للمستخدمين المسجلين */}
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrderList />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <PrivateRoute>
              <OrderDetails />
            </PrivateRoute>
          }
        />
        {/* صفحة إضافة منتج متاحة لأي مستخدم مسجّل */}
        <Route
          path="/products/create"
          element={
            <PrivateRoute>
              <ProductCreate />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
