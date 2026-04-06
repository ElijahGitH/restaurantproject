import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

function UserDashboard() {
  // Used to move back to login on logout
  const navigate = useNavigate();

  // Get user info from localStorage
  const userId = localStorage.getItem("userId") || "";
  const username = localStorage.getItem("username") || "Standard User";

  // Store page messages
  const [pageMessage, setPageMessage] = useState("");

  /* ------------------------------ */
  /* Reservation states */
  /* ------------------------------ */

  const [customerName, setCustomerName] = useState(username);
  const [tableNumber, setTableNumber] = useState("");
  const [reservationTime, setReservationTime] = useState("");
  const [myReservations, setMyReservations] = useState([]);
  const [editReservationId, setEditReservationId] = useState("");

  /* ------------------------------ */
  /* Order states */
  /* ------------------------------ */

  const [menuItems, setMenuItems] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [orderCart, setOrderCart] = useState([]);

  /* ------------------------------ */
  /* Load page data on page load */
  /* ------------------------------ */

  useEffect(() => {
    loadMenuItems();

    if (userId !== "") {
      loadMyReservations();
      loadMyOrders();
    }
  }, []);

  /* ------------------------------ */
  /* Load data functions */
  /* ------------------------------ */

  function loadMenuItems() {
    fetch("http://localhost:5000/api/menuitems")
      .then((response) => response.json())
      .then((data) => {
        setMenuItems(data);
      })
      .catch(() => {
        setPageMessage("Could not load menu items");
      });
  }

  function loadMyReservations() {
    fetch(`http://localhost:5000/api/my/reservations/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setMyReservations(data);
      })
      .catch(() => {
        setPageMessage("Could not load your reservations");
      });
  }

  function loadMyOrders() {
    fetch(`http://localhost:5000/api/my/orders/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setMyOrders(data);
      })
      .catch(() => {
        setPageMessage("Could not load your orders");
      });
  }

  /* ------------------------------ */
  /* Logout function */
  /* ------------------------------ */

  function logoutUser() {
    localStorage.clear();
    navigate("/");
  }

  /* ------------------------------ */
  /* Reservation functions */
  /* ------------------------------ */

  function clearReservationForm() {
    setCustomerName(username);
    setTableNumber("");
    setReservationTime("");
    setEditReservationId("");
  }

  function saveReservation(event) {
    event.preventDefault();

    if (userId === "") {
      setPageMessage("Please login first");
      return;
    }

    const reservationData = {
      userId: userId,
      customerName: customerName,
      tableNumber: tableNumber,
      reservationTime: reservationTime
    };

    // Update reservation
    if (editReservationId !== "") {
      fetch(`http://localhost:5000/api/my/reservations/${editReservationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reservationData)
      })
        .then((response) => response.json())
        .then(() => {
          clearReservationForm();
          loadMyReservations();
          setPageMessage("Your reservation was updated");
        })
        .catch(() => {
          setPageMessage("Could not update your reservation");
        });
    } else {
      // Add reservation
      fetch("http://localhost:5000/api/my/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reservationData)
      })
        .then((response) => response.json())
        .then(() => {
          clearReservationForm();
          loadMyReservations();
          setPageMessage("Your reservation was submitted");
        })
        .catch(() => {
          setPageMessage("Could not add your reservation");
        });
    }
  }

  function startEditReservation(oneReservation) {
    setCustomerName(oneReservation.customerName);
    setTableNumber(oneReservation.tableNumber);
    setReservationTime(oneReservation.reservationTime);
    setEditReservationId(oneReservation._id);
    setPageMessage("Editing your reservation");
  }

  function deleteReservation(reservationId) {
    fetch(`http://localhost:5000/api/my/reservations/${reservationId}/${userId}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then(() => {
        loadMyReservations();
        setPageMessage("Your reservation was deleted");
      })
      .catch(() => {
        setPageMessage("Could not delete your reservation");
      });
  }

  /* ------------------------------ */
  /* Order functions */
  /* ------------------------------ */

  function addItemToCart() {
    if (selectedMenuItemId === "") {
      setPageMessage("Please choose a menu item");
      return;
    }

    const newCartItem = {
      menuItemId: selectedMenuItemId,
      quantity: Number(selectedQuantity)
    };

    setOrderCart([...orderCart, newCartItem]);
    setSelectedMenuItemId("");
    setSelectedQuantity(1);
    setPageMessage("Item added to order");
  }

  function removeCartItem(indexToRemove) {
    const updatedCart = orderCart.filter((oneItem, index) => index !== indexToRemove);
    setOrderCart(updatedCart);
  }

  function submitOrder() {
    if (userId === "") {
      setPageMessage("Please login first");
      return;
    }

    if (orderCart.length === 0) {
      setPageMessage("Add at least one item to your order");
      return;
    }

    fetch("http://localhost:5000/api/my/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userId,
        items: orderCart
      })
    })
      .then((response) => response.json())
      .then(() => {
        setOrderCart([]);
        loadMyOrders();
        setPageMessage("Your order was submitted");
      })
      .catch(() => {
        setPageMessage("Could not submit your order");
      });
  }

  function deleteOrder(orderId) {
    fetch(`http://localhost:5000/api/my/orders/${orderId}/${userId}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then(() => {
        loadMyOrders();
        setPageMessage("Your order was deleted");
      })
      .catch(() => {
        setPageMessage("Could not delete your order");
      });
  }

  function getMenuItemName(menuItemId) {
    const foundItem = menuItems.find((oneMenuItem) => oneMenuItem._id === menuItemId);

    if (foundItem) {
      return foundItem.itemName;
    }

    return "Unknown Item";
  }

  return (
    <div className="dashboard-page">
      
      <div className="dashboard-top-bar">
        <div>
          <h1>User Dashboard</h1>
          <p>Welcome, {username}.</p>
        </div>

        <button className="logout-button" onClick={logoutUser}>
          Logout
        </button>
      </div>

      
      {pageMessage && <p className="page-message">{pageMessage}</p>}

      
      {userId === "" && (
        <div className="dashboard-section">
          <h2>Login Connection Needed</h2>
          <p>This page needs a saved userId from the login page.</p>
        </div>
      )}

      
      <div className="dashboard-section">
        <h2>My Reservation Form</h2>

        <form onSubmit={saveReservation} className="dashboard-form">
          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
          />

          <input
            type="number"
            placeholder="Table Number"
            value={tableNumber}
            onChange={(event) => setTableNumber(event.target.value)}
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

      {/* My reservations section */}
      <div className="dashboard-section">
        <h2>My Reservations</h2>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Table Number</th>
              <th>Reservation Time</th>
              <th>Approval</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {myReservations.map((oneReservation) => (
              <tr key={oneReservation._id}>
                <td>{oneReservation.customerName}</td>
                <td>{oneReservation.tableNumber}</td>
                <td>{oneReservation.reservationTime}</td>
                <td>{oneReservation.approvalStatus}</td>
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

      {/* Order builder section */}
      <div className="dashboard-section">
        <h2>Build My Order</h2>

        <div className="dashboard-form">
          <select
            value={selectedMenuItemId}
            onChange={(event) => setSelectedMenuItemId(event.target.value)}
          >
            <option value="">Choose Menu Item</option>
            {menuItems.map((oneMenuItem) => (
              <option key={oneMenuItem._id} value={oneMenuItem._id}>
                {oneMenuItem.itemName} - ${oneMenuItem.price}
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={selectedQuantity}
            onChange={(event) => setSelectedQuantity(event.target.value)}
          />

          <button type="button" onClick={addItemToCart}>
            Add To Order
          </button>
        </div>
      </div>

      {/* Current order cart section */}
      <div className="dashboard-section">
        <h2>Current Order</h2>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Remove</th>
            </tr>
          </thead>

          <tbody>
            {orderCart.map((oneCartItem, index) => (
              <tr key={index}>
                <td>{getMenuItemName(oneCartItem.menuItemId)}</td>
                <td>{oneCartItem.quantity}</td>
                <td>
                  <button onClick={() => removeCartItem(index)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" onClick={submitOrder}>
          Submit Order
        </button>
      </div>

      {/* My orders section */}
      <div className="dashboard-section">
        <h2>My Orders</h2>

        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Items</th>
              <th>Status</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {myOrders.map((oneOrder) => (
              <tr key={oneOrder._id}>
                <td>
                  {oneOrder.items.map((oneItem, index) => (
                    <div key={index}>
                      {oneItem.menuItemId ? oneItem.menuItemId.itemName : "Unknown Item"} x{" "}
                      {oneItem.quantity}
                    </div>
                  ))}
                </td>
                <td>{oneOrder.status}</td>
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

export default UserDashboard;