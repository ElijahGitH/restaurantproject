
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Menu from "./pages/Menu";
import AddAdmin from "./pages/AddAdmin";
import AddCustomer from "./pages/AddCustomer";
import AddCustomer from "./pages/Reservations";


function App() {
    return (
        <Router>
            <Navbar />

            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/loginpage" element={<LoginPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/user" element={<UserDashboard />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/reservations" element={<Reservations />} />
                <Route path="/userregister" element={<AddCustomer />} />
                <Route path="/adminregister" element={<AddAdmin />} />
            </Routes>
        </Router>
    );
}

export default App;
