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

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [menuItems, setMenuItems] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [partySize, setPartySize] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [reservations, setReservations] = useState([]);
  const [editReservationId, setEditReservationId] = useState("");
  const [selectedTable, setSelectedTable] = useState("");

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadAdminStats();
    loadMenuItems();
    loadReservations();
    loadOrders();
  }, []);

  function loadAdminStats() {
    fetch("http://localhost:5000/api/admin/stats")
      .then((response) => response.json())
      .then((data) => {
        setAdminStats(data);
      })
      .catch(() => {
        setPageMessage("Could not load admin stats");
      });
  }

  function loadMenuItems() {
    fetch("http://localhost:5000/api/menuitems")
      .then((response) => response.json())
      .then((data) => {
        setMenuItems(data);
      })
      .catch(() => {
        setPageMessage("Could not load seasonal menu items");
      });
  }

  function loadReservations() {
    fetch("http://localhost:5000/api/reservations")
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
      })
      .catch(() => {
        setPageMessage("Could not load reservations");
      });
  }

  function loadOrders() {
    fetch("http://localhost:5000/api/orders")
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
      })
      .catch(() => {
        setPageMessage("Could not load orders");
      });
  }

  function logoutUser() {
    localStorage.clear();
    navigate("/");
  }

  function clearMenuItemForm() {
    setItemName("");
    setCategory("");
    setPrice("");
  }

  function saveMenuItem(event) {
    event.preventDefault();

    const menuItemData = {
      itemName: itemName,
      category: category,
      price: price
    };

    fetch("http://localhost:5000/api/menuitems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(menuItemData)
    })
      .then((response) => response.json())
      .then(() => {
        clearMenuItemForm();
        loadMenuItems();
        loadAdminStats();
        setPageMessage("Seasonal menu item added");
      })
      .catch(() => {
        setPageMessage("Could not add seasonal menu item");
      });
  }

  function deleteMenuItem(menuItemId) {
    fetch(`http://localhost:5000/api/menuitems/${menuItemId}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then(() => {
        loadMenuItems();
        loadAdminStats();
        setPageMessage("Seasonal menu item deleted");
      })
      .catch(() => {
        setPageMessage("Could not delete seasonal menu item");
      });
  }

  function formatReservationTime(value) {
    if (!value) {
      return "";
    }

    const dateObject = new Date(value);

    if (Number.isNaN(dateObject.getTime())) {
      return value;
    }

    return dateObject.toLocaleString([], {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  }

  function formatForDateTimeLocal(value) {
    if (!value) {
      return "";
    }

    const dateObject = new Date(value);

    if (Number.isNaN(dateObject.getTime())) {
      return value.slice(0, 16);
    }

    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    const hour = String(dateObject.getHours()).padStart(2, "0");
    const minute = String(dateObject.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hour}:${minute}`;
  }

  function formatPrice(value) {
    if (value === undefined || value === null || value === "") {
      return "0.00";
    }

    return Number(value).toFixed(2);
  }

  function isBlockingReservation(oneReservation) {
    return oneReservation && oneReservation.approvalStatus !== "Denied";
  }

  function getSavedOrderItemName(oneItem) {
    if (oneItem.itemName) {
      return oneItem.itemName;
    }

    if (oneItem.menuItemId && oneItem.menuItemId.itemName) {
      return oneItem.menuItemId.itemName;
    }

    return "Unknown Item";
  }

  function getSavedOrderItemPrice(oneItem) {
    if (oneItem.itemPrice !== undefined && oneItem.itemPrice !== null) {
      return Number(oneItem.itemPrice);
    }

    if (oneItem.menuItemId && oneItem.menuItemId.price !== undefined) {
      return Number(oneItem.menuItemId.price);
    }

    return 0;
  }

  function clearReservationForm() {
    setCustomerName("");
    setTableNumber("");
    setPartySize("");
    setReservationTime("");
    setEditReservationId("");
    setSelectedTable("");
  }

  function saveReservation(event) {
    event.preventDefault();

    const reservationData = {
      userId: userId,
      customerName: customerName,
      tableNumber: tableNumber,
      reservationTime: reservationTime,
      approvalStatus: "Approved",
      partySize: partySize
    };

    if (editReservationId !== "") {
      fetch(`http://localhost:5000/api/reservations/${editReservationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerName: customerName,
          tableNumber: tableNumber,
          reservationTime: reservationTime,
          approvalStatus: "Approved",
          partySize: partySize
        })
      })
        .then((response) => response.json())
        .then(() => {
          clearReservationForm();
          loadReservations();
          loadAdminStats();
          setPageMessage("Reservation updated");
        })
        .catch(() => {
          setPageMessage("Could not update reservation");
        });
    } else {
      fetch("http://localhost:5000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reservationData)
      })
        .then((response) => response.json())
        .then(() => {
          clearReservationForm();
          loadReservations();
          loadAdminStats();
          setPageMessage("Reservation added");
        })
        .catch(() => {
          setPageMessage("Could not add reservation");
        });
    }
  }

  function startEditReservation(oneReservation) {
    setCustomerName(oneReservation.customerName);
    setTableNumber(String(oneReservation.tableNumber));
    setPartySize(oneReservation.partySize ? String(oneReservation.partySize) : "");
    setReservationTime(formatForDateTimeLocal(oneReservation.reservationTime));
    setEditReservationId(oneReservation._id);
    setSelectedTable(String(oneReservation.tableNumber));
    setPageMessage("Editing reservation");
  }

  function deleteReservation(reservationId) {
    fetch(`http://localhost:5000/api/reservations/${reservationId}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then(() => {
        loadReservations();
        loadAdminStats();
        setPageMessage("Reservation deleted");
      })
      .catch(() => {
        setPageMessage("Could not delete reservation");
      });
  }

  function updateReservationApproval(reservationId, newStatus) {
    fetch(`http://localhost:5000/api/reservations/${reservationId}/approval`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        approvalStatus: newStatus
      })
    })
      .then((response) => response.json())
      .then(() => {
        loadReservations();
        setPageMessage("Reservation approval updated");
      })
      .catch(() => {
        setPageMessage("Could not update approval");
      });
  }

  function updateOrderStatus(orderId, newStatus) {
    fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: newStatus
      })
    })
      .then((response) => response.json())
      .then(() => {
        loadOrders();
        setPageMessage("Order status updated");
      })
      .catch(() => {
        setPageMessage("Could not update order status");
      });
  }

  function deleteOrder(orderId) {
    fetch(`http://localhost:5000/api/orders/${orderId}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then(() => {
        loadOrders();
        loadAdminStats();
        setPageMessage("Order deleted");
      })
      .catch(() => {
        setPageMessage("Could not delete order");
      });
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-top-bar">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Welcome, {username}.</p>
        </div>

        <button className="logout-button" onClick={logoutUser}>
          Logout
        </button>
      </div>

      {pageMessage && <p className="page-message">{pageMessage}</p>}

      <div className="card-grid">
        <div className="dashboard-card">
          <h3>Total Users</h3>
          <p>{adminStats.totalUsers}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Seasonal Items</h3>
          <p>{adminStats.totalMenuItems}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Orders</h3>
          <p>{adminStats.totalOrders}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Reservations</h3>
          <p>{adminStats.totalReservations}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Tables</h3>
          <p>{adminStats.totalTables}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Seasonal Menu Form</h2>

        <form onSubmit={saveMenuItem} className="dashboard-form">
          <input
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(event) => setItemName(event.target.value)}
          />

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />

          <button type="submit">Add Seasonal Item</button>
        </form>
      </div>

      <div className="dashboard-section">
        <h2>Seasonal Menu Items</h2>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {menuItems.map((oneMenuItem) => (
              <tr key={oneMenuItem._id}>
                <td>{oneMenuItem.itemName}</td>
                <td>{oneMenuItem.category}</td>
                <td>${formatPrice(oneMenuItem.price)}</td>
                <td>
                  <button onClick={() => deleteMenuItem(oneMenuItem._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-section">
        <h2>Reservation Form</h2>

        <form onSubmit={saveReservation} className="dashboard-form">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
          />

          <input
            type="text"
            placeholder="Table Number or Bar Seat"
            value={tableNumber}
            onChange={(event) => setTableNumber(event.target.value)}
          />

          <input
            type="number"
            min="1"
            placeholder="Party Size"
            value={partySize}
            onChange={(event) => setPartySize(event.target.value)}
          />

          <input
            type="datetime-local"
            value={reservationTime}
            onChange={(event) => setReservationTime(event.target.value)}
          />

          <button type="submit">
            {editReservationId !== "" ? "Update Reservation" : "Add Reservation"}
          </button>

          {editReservationId !== "" && (
            <button
              type="button"
              className="cancel-button"
              onClick={clearReservationForm}
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="dashboard-section">
        <h2>Seating Layout</h2>

        <div className="seating-legend">
          <span className="legend-item available-legend">Available</span>
          <span className="legend-item occupied-legend">Reserved</span>
          <span className="legend-note">
            Round = table (max 4) | Rectangle = booth (max 6)
          </span>
        </div>

        <div className="bar-area">
          <span className="bar-label">Bar</span>
          <div className="bar-seats">
            {[...Array(17)].map((_, i) => {
              const seatNum = i + 21;

              const foundReservation = reservations.find(
                (r) => String(r.tableNumber) === `bar-${seatNum}`
              );

              const reserved = isBlockingReservation(foundReservation);

              return (
                <div
                  key={seatNum}
                  className={`bar-seat ${
                    reserved ? "bar-seat-reserved" : "bar-seat-available"
                  }`}
                  title={
                    reserved
                      ? `Seat ${seatNum} — Reserved: ${foundReservation.customerName}`
                      : `Seat ${seatNum} — Available`
                  }
                  onClick={() => {
                    setTableNumber(`bar-${seatNum}`);
                    setSelectedTable(`bar-${seatNum}`);
                  }}
                >
                  {seatNum}
                </div>
              );
            })}
          </div>
        </div>

        <div className="seating-layout">
          {[...Array(20)].map((_, index) => {
            const tableNum = index + 1;

            const foundReservation = reservations.find(
              (r) => String(r.tableNumber) === String(tableNum)
            );

            const reservation = isBlockingReservation(foundReservation)
              ? foundReservation
              : null;

            const isBooth = tableNum % 5 === 0;
            const isSelected = selectedTable === String(tableNum);

            return (
              <div
                key={tableNum}
                className={`table-wrapper ${isBooth ? "large" : ""} ${
                  reservation ? "occupied" : "available"
                }`}
                onClick={() => {
                  setTableNumber(String(tableNum));
                  setSelectedTable((prev) =>
                    prev === String(tableNum) ? "" : String(tableNum)
                  );
                }}
              >
                <div className="table-shape">
                  <span>{tableNum}</span>
                </div>

                {reservation && (
                  <p className="table-label">{reservation.customerName}</p>
                )}

                {reservation && isSelected && (
                  <div className="reserved-tag">
                    Party of {reservation.partySize || "?"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Reservations</h2>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Account Username</th>
              <th>Reservation Name</th>
              <th>Table Number</th>
              <th>Party Size</th>
              <th>Reservation Time</th>
              <th>Approval</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map((oneReservation) => (
              <tr key={oneReservation._id}>
                <td>
                  {oneReservation.userId ? oneReservation.userId.username : "Unknown"}
                </td>
                <td>{oneReservation.customerName}</td>
                <td>{oneReservation.tableNumber}</td>
                <td>{oneReservation.partySize}</td>
                <td>{formatReservationTime(oneReservation.reservationTime)}</td>
                <td>
                  <div>
                    <p>{oneReservation.approvalStatus}</p>
                    <button
                      className="small-button"
                      onClick={() =>
                        updateReservationApproval(oneReservation._id, "Approved")
                      }
                    >
                      Approve
                    </button>
                    <button
                      className="small-button"
                      onClick={() =>
                        updateReservationApproval(oneReservation._id, "Denied")
                      }
                    >
                      Deny
                    </button>
                  </div>
                </td>
                <td>
                  <button onClick={() => startEditReservation(oneReservation)}>
                    Edit
                  </button>
                </td>
                <td>
                  <button onClick={() => deleteReservation(oneReservation._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-section">
        <h2>Orders</h2>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Items</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((oneOrder) => (
              <tr key={oneOrder._id}>
                <td>{oneOrder.userId ? oneOrder.userId.username : "Unknown User"}</td>
                <td>
                  {oneOrder.items.map((oneItem, index) => (
                    <div key={index}>
                      {getSavedOrderItemName(oneItem)} - $
                      {formatPrice(getSavedOrderItemPrice(oneItem))} x{" "}
                      {oneItem.quantity}
                    </div>
                  ))}
                </td>
                <td>{oneOrder.status}</td>
                <td>
                  <button
                    className="small-button"
                    onClick={() => updateOrderStatus(oneOrder._id, "Preparing")}
                  >
                    Preparing
                  </button>
                  <button
                    className="small-button"
                    onClick={() => updateOrderStatus(oneOrder._id, "Completed")}
                  >
                    Completed
                  </button>
                  <button
                    className="small-button"
                    onClick={() => updateOrderStatus(oneOrder._id, "Cancelled")}
                  >
                    Cancelled
                  </button>
                </td>
                <td>
                  <button onClick={() => deleteOrder(oneOrder._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;