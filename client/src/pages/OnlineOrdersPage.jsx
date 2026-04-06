import { useEffect, useState } from "react";
import SiteNavbar from "../components/SiteNavbar";
import "./SiteTheme.css";

function OnlineOrdersPage() {
  const userId = localStorage.getItem("userId") || "";

  const [pageMessage, setPageMessage] = useState("");
  const [seasonalItems, setSeasonalItems] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [selectedItemValue, setSelectedItemValue] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [orderCart, setOrderCart] = useState([]);

  const currentMenuSections = [
    {
      category: "STARTERS",
      items: [
        { itemName: "Chips & Queso", price: 4.99 },
        { itemName: "Chips & Salsa", price: 4.99 },
        { itemName: "Guacamole & Chicharrones", price: 9.99 },
        { itemName: "Sol Sampler", price: 15.99 },
        { itemName: "Taquitos Dorados", price: 8.99 }
      ]
    },
    {
      category: "SMALL PLATES",
      items: [
        { itemName: "Sol Street Corn", price: 7.99 },
        { itemName: "Jamon Croquetas", price: 8.99 },
        { itemName: "Sol Salad", price: 11.99 },
        { itemName: "Yuca Fries", price: 6.99 },
        { itemName: "Pollo Asado Skewers", price: 10.99 }
      ]
    },
    {
      category: "SPECIALS",
      items: [
        { itemName: "Pegasus Plate", price: 18.99 },
        { itemName: "Knight's Feast", price: 17.99 },
        { itemName: "Charge On Combo", price: 16.99 }
      ]
    },
    {
      category: "ENTREES",
      items: [
        { itemName: "Tamales", price: 12.99 },
        { itemName: "Burritos", price: 14.99 },
        { itemName: "Quesadillas", price: 13.99 },
        { itemName: "Enchiladas", price: 13.49 },
        { itemName: "Chile Rellenos", price: 14.49 },
        { itemName: "Nachos", price: 12.99 },
        { itemName: "Molcajete", price: 21.99 },
        { itemName: "Fajitas Tapatias", price: 19.99 },
        { itemName: "Arrachera", price: 19.99 }
      ]
    },
    {
      category: "KID'S MENU",
      items: [
        { itemName: "Quesadilla", price: 5.99 },
        { itemName: "Burrito", price: 5.99 },
        { itemName: "Chicken Tenders", price: 5.99 }
      ]
    },
    {
      category: "DESSERTS",
      items: [
        { itemName: "Creamy Flan", price: 5.99 },
        { itemName: "Cinnamon Churros", price: 8.99 },
        { itemName: "Arroz con Leche", price: 6.99 },
        { itemName: "Tres Leches Cake", price: 6.99 }
      ]
    },
    {
      category: "DRINKS & BEVERAGES",
      items: [
        { itemName: "Soft Drinks", price: 2.99 },
        { itemName: "Lemonade", price: 2.49 },
        { itemName: "Iced Tea", price: 1.99 }
      ]
    }
  ];

  useEffect(() => {
    loadSeasonalItems();

    if (userId !== "") {
      loadMyOrders();
    }
  }, []);

  function loadSeasonalItems() {
    fetch("http://localhost:5000/api/menuitems")
      .then((response) => response.json())
      .then((data) => {
        setSeasonalItems(data);
      })
      .catch(() => {
        setPageMessage("Could not load seasonal menu");
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

  function formatPrice(value) {
    if (value === undefined || value === null || value === "") {
      return "0.00";
    }

    return Number(value).toFixed(2);
  }

  function findStaticMenuItem(itemName) {
    for (const oneSection of currentMenuSections) {
      const foundItem = oneSection.items.find(
        (oneItem) => oneItem.itemName === itemName
      );

      if (foundItem) {
        return foundItem;
      }
    }

    return null;
  }

  function addItemToCart() {
    if (selectedItemValue === "") {
      setPageMessage("Please choose a menu item");
      return;
    }

    const [itemSource, itemValue] = selectedItemValue.split("::");

    if (itemSource === "static") {
      const foundStaticItem = findStaticMenuItem(itemValue);

      if (!foundStaticItem) {
        setPageMessage("Could not find that menu item");
        return;
      }

      const newCartItem = {
        itemSource: "static",
        itemName: foundStaticItem.itemName,
        itemPrice: Number(foundStaticItem.price),
        quantity: Number(selectedQuantity)
      };

      setOrderCart([...orderCart, newCartItem]);
    } else {
      const foundSeasonalItem = seasonalItems.find(
        (oneItem) => oneItem._id === itemValue
      );

      if (!foundSeasonalItem) {
        setPageMessage("Could not find that seasonal item");
        return;
      }

      const newCartItem = {
        itemSource: "seasonal",
        menuItemId: foundSeasonalItem._id,
        itemName: foundSeasonalItem.itemName,
        itemPrice: Number(foundSeasonalItem.price),
        quantity: Number(selectedQuantity)
      };

      setOrderCart([...orderCart, newCartItem]);
    }

    setSelectedItemValue("");
    setSelectedQuantity(1);
    setPageMessage("Item added to order");
  }

  function removeCartItem(indexToRemove) {
    const updatedCart = orderCart.filter((_, index) => index !== indexToRemove);
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
              value={selectedItemValue}
              onChange={(event) => setSelectedItemValue(event.target.value)}
            >
              <option value="">Choose Menu Item</option>

              <optgroup label="Current Menu">
                {currentMenuSections.map((oneSection) =>
                  oneSection.items.map((oneItem) => (
                    <option
                      key={`static-${oneSection.category}-${oneItem.itemName}`}
                      value={`static::${oneItem.itemName}`}
                    >
                      {oneItem.itemName} - ${formatPrice(oneItem.price)}
                    </option>
                  ))
                )}
              </optgroup>

              <optgroup label="Seasonal Menu">
                {seasonalItems.map((oneMenuItem) => (
                  <option
                    key={oneMenuItem._id}
                    value={`seasonal::${oneMenuItem._id}`}
                  >
                    {oneMenuItem.itemName} - ${formatPrice(oneMenuItem.price)}
                  </option>
                ))}
              </optgroup>
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
                <th>Price</th>
                <th>Quantity</th>
                <th>Remove</th>
              </tr>
            </thead>

            <tbody>
              {orderCart.map((oneCartItem, index) => (
                <tr key={index}>
                  <td>{oneCartItem.itemName}</td>
                  <td>${formatPrice(oneCartItem.itemPrice)}</td>
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
                        {getSavedOrderItemName(oneItem)} - $
                        {formatPrice(getSavedOrderItemPrice(oneItem))} x{" "}
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