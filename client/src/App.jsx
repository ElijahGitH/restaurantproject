import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import HomePage from "./pages/HomePage";
import MenuPage from "./pages/MenuPage";
import LocationsPage from "./pages/LocationsPage";
import ReservationsPage from "./pages/ReservationsPage";
import OnlineOrdersPage from "./pages/OnlineOrdersPage";
import ContactPage from "./pages/ContactPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/user" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/online-orders" element={<OnlineOrdersPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;