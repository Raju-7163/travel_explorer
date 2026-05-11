import { Route, Routes } from "react-router-dom";
import MainLayout from "../components/MainLayout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Favorites from "../pages/Favorites.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import PlaceDetails from "../pages/PlaceDetails.jsx";
import Profile from "../pages/Profile.jsx";
import Register from "../pages/Register.jsx";

export default function AppRoutes() {
  return (
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
      </Route>
    </Routes>
  );
}
