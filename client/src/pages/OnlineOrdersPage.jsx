import { useEffect, useState } from "react";
import SiteNavbar from "../components/SiteNavbar";
import "./SiteTheme.css";

function OnlineOrdersPage() {
  const userId = localStorage.getItem("userId") || "";

  const [pageMessage, setPageMessage] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [orderCart, setOrderCart] = useState([]);

  useEffect(() => {
    loadMenuItems();

    if (userId !== "") {
      loadMyOrders();
    }
  }, []);

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
    <div className="site-simple-page">
      <SiteNavbar />

      <div className="container mt-5 mb-5">
        <h1 className="text-center display-3">Online Orders</h1>

        {pageMessage && <p className="site-message">{pageMessage}</p>}

        <div className="site-panel">
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

        <div className="site-panel">
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

          <button className="site-submit-button" type="button" onClick={submitOrder}>
            Submit Order
          </button>
        </div>

        <div className="site-panel">
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
    </div>
  );
}

export default OnlineOrdersPage;