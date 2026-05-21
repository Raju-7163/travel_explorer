import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../components/MainLayout.jsx";
import PageLoader from "../components/PageLoader.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

const Favorites = lazy(() => import("../pages/Favorites.jsx"));
const Home = lazy(() => import("../pages/Home.jsx"));
const Login = lazy(() => import("../pages/Login.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));
const PlaceDetails = lazy(() => import("../pages/PlaceDetails.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));
const Register = lazy(() => import("../pages/Register.jsx"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/places/:xid" element={<PlaceDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
