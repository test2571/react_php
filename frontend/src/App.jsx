import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Register from "./pages/Register.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProvider from "./context/AdminContext.jsx";
import Profile from "./pages/Profile.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import CategoryForm from "./pages/CategoryForm.jsx";
import CategoryList from "./pages/CategoryList.jsx";
import ProductForm from "./pages/ProductForm.jsx";
import ProductList from "./pages/ProductList.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import UserLandingPage from "./pages/UserLandingPage.jsx";
import ProductView from "./pages/ProductView.jsx";
import ProductsByCategory from "./pages/ProductsByCategory.jsx";
import NotFoundPage from "./components/NotFoundPage.jsx";

function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/user" element={<UserLandingPage />} />
          <Route path="/user/productView" element={<ProductView />} />
          <Route
            path="/user/productsbycategory"
            element={<ProductsByCategory />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="*" element={<NotFoundPage />} />
          {/* protected route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/updatePassword"
            element={
              <ProtectedRoute>
                <UpdatePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addCategory"
            element={
              <ProtectedRoute>
                <CategoryForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewCategory"
            element={
              <ProtectedRoute>
                <CategoryList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addProduct"
            element={
              <ProtectedRoute>
                <ProductForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewProduct"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </AdminProvider>
  );
}

export default App;
