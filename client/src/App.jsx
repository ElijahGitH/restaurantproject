import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Menu from "./pages/Menu";
import Reservations from "./pages/Reservations";
import Help from "./pages/Help";
function App() {
    return (
        <Router>
            <Navbar />

            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/user" element={<Menu />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/help" element={<Help />} />
            </Routes>
        </Router>
    );
}

export default App;
