import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Menu from "./pages/Menu";

function App() {
    return (
        <Router>
            <Navbar />

            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/menu" element={<Menu />} />
            </Routes>
        </Router>
    );
}

export default App;
