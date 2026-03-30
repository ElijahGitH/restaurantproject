// pages/AdminDashboard.jsx
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    fetch("/api/tables")
      .then((res) => res.json())
      .then((data) => setTables(data))
      .catch((err) => console.error("Error fetching tables:", err));

    fetch("/api/reservations")
      .then((res) => res.json())
      .then((data) => setReservations(data))
      .catch((err) => console.error("Error fetching reservations:", err));
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      
      <h1>Admin Dashboard</h1>
      <p>Welcome, Administrator.</p>

      {/* MENU MANAGEMENT */}
      <section style={{ marginTop: "40px" }}>
        <h2>Manage Menu</h2>
        <p>Add, edit, or delete menu items.</p>
      </section>

      {/* RESERVATIONS */}
      <section style={{ marginTop: "40px" }}>
        <h2>Reservations</h2>

        {reservations.map((res) => (
          <div key={res._id} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
            <p><strong>Name:</strong> {res.name}</p>
            <p><strong>Date:</strong> {res.date}</p>
            <p><strong>Time:</strong> {res.time}</p>
            <p><strong>Guests:</strong> {res.guests}</p>
          </div>
        ))}
      </section>

      {/* SEATING LAYOUT */}
      <section style={{ marginTop: "40px" }}>
        <h2>Seating Layout</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 100px)", gap: "10px", justifyContent: "center" }}>
          {tables.map((table) => {
            const reservation = reservations.find(
              (r) => r.tableId?.toString() === table._id.toString()
            );

            return (
              <div
                key={table._id}
                style={{
                  border: "1px solid black",
                  padding: "10px",
                  backgroundColor: reservation ? "lightcoral" : "lightgreen"
                }}
              >
                <h4>Table {table.number}</h4>
                <p>Seats: {table.capacity}</p>

                {reservation ? (
                  <p>{reservation.name}</p>
                ) : (
                  <p>Available</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ORDERS */}
      <section style={{ marginTop: "40px" }}>
        <h2>Orders</h2>
        <p>Order management coming soon...</p>
      </section>

    </div>
  );
}
