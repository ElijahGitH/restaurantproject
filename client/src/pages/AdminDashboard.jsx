import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId") || "";
    const username = localStorage.getItem("username") || "Administrator";

    const [adminStats, setAdminStats] = useState({
        totalUsers: 0,
        totalMenuItems: 0,
        totalOrders: 0,
        totalReservations: 0,
        totalTables: 0
    });

    const [pageMessage, setPageMessage] = useState("");

    const [menuItems, setMenuItems] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [orders, setOrders] = useState([]);

    const [itemName, setItemName] = useState("");
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [editMenuItemId, setEditMenuItemId] = useState("");

    const [customerName, setCustomerName] = useState("");
    const [tableNumber, setTableNumber] = useState("");
    const [reservationTime, setReservationTime] = useState("");
    const [editReservationId, setEditReservationId] = useState("");

    useEffect(() => {
        loadAdminStats();
        loadMenuItems();
        loadReservations();
        loadOrders();
    }, []);

    function loadAdminStats() {
        fetch("http://localhost:5000/api/admin/stats")
            .then(res => res.json())
            .then(setAdminStats)
            .catch(() => setPageMessage("Could not load stats"));
    }

    function loadMenuItems() {
        fetch("http://localhost:5000/api/menuitems")
            .then(res => res.json())
            .then(setMenuItems);
    }

    function loadReservations() {
        fetch("http://localhost:5000/api/reservations")
            .then(res => res.json())
            .then(setReservations);
    }

    function loadOrders() {
        fetch("http://localhost:5000/api/orders")
            .then(res => res.json())
            .then(setOrders);
    }

    function logoutUser() {
        localStorage.clear();
        navigate("/");
    }

    function saveMenuItem(e) {
        e.preventDefault();
        const data = { itemName, category, price };

        const method = editMenuItemId ? "PUT" : "POST";
        const url = editMenuItemId
            ? `http://localhost:5000/api/menuitems/${editMenuItemId}`
            : "http://localhost:5000/api/menuitems";

        fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(() => {
            setItemName(""); setCategory(""); setPrice(""); setEditMenuItemId("");
            loadMenuItems(); loadAdminStats();
        });
    }

    function saveReservation(e) {
        e.preventDefault();

        fetch("http://localhost:5000/api/reservations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId,
                customerName,
                tableNumber,
                reservationTime,
                approvalStatus: "Approved"
            })
        }).then(() => {
            setCustomerName("");
            setTableNumber("");
            setReservationTime("");
            loadReservations();
        });
    }

    return (
        <div className="dashboard-page">

            <div className="dashboard-top-bar">
                <h1>Admin Dashboard</h1>
                <button onClick={logoutUser}>Logout</button>
            </div>

            <p>Welcome, {username}</p>

            {/* STATS */}
            <div className="card-grid">
                <div className="dashboard-card">Users: {adminStats.totalUsers}</div>
                <div className="dashboard-card">Menu: {adminStats.totalMenuItems}</div>
                <div className="dashboard-card">Orders: {adminStats.totalOrders}</div>
                <div className="dashboard-card">Reservations: {adminStats.totalReservations}</div>
            </div>

            {/* MENU */}
            <div className="dashboard-section">
                <h2>Menu</h2>
                <form onSubmit={saveMenuItem}>
                    <input placeholder="Name" value={itemName} onChange={e => setItemName(e.target.value)} />
                    <input placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
                    <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
                    <button>Add Item</button>
                </form>
            </div>

            {/* RESERVATION FORM */}
            <div className="dashboard-section">
                <h2>Create Reservation</h2>
                <form onSubmit={saveReservation}>
                    <input placeholder="Customer Name" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                    <input placeholder="Table #" value={tableNumber} onChange={e => setTableNumber(e.target.value)} />
                    <input type="datetime-local" value={reservationTime} onChange={e => setReservationTime(e.target.value)} />
                    <button>Reserve</button>
                </form>
            </div>

            {/* SEATING LAYOUT */}
            <div className="dashboard-section">
                <h2>Seating Layout</h2>

                <div className="seating-grid">
                    {[...Array(20)].map((_, index) => {
                        const tableNum = index + 1;

                        const reservation = reservations.find(
                            (r) => Number(r.tableNumber) === tableNum
                        );

                        return (
                            <div
                                key={tableNum}
                                onClick={() => setTableNumber(tableNum)}
                                className={`seat-box ${reservation ? "occupied" : "available"}`}
                            >
                                <h4>Table {tableNum}</h4>

                                {reservation ? (
                                    <p>{reservation.customerName}</p>
                                ) : (
                                    <p>Available</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;
