import { useEffect, useState } from "react";
import SiteNavbar from "../components/SiteNavbar";
import "./SiteTheme.css";

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [pageMessage, setPageMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/menuitems")
      .then((response) => response.json())
      .then((data) => {
        setMenuItems(data);
      })
      .catch(() => {
        setPageMessage("Could not load menu items");
      });
  }, []);

  function getItemsByCategory(categoryName) {
    return menuItems.filter(
      (oneItem) => oneItem.category.toLowerCase() === categoryName.toLowerCase()
    );
  }

  const categories = [...new Set(menuItems.map((oneItem) => oneItem.category))];

  return (
    <div className="menu-page">
      <SiteNavbar />

      <div className="container mt-5 mb-5">
        <h1 className="text-center display-3">~ Menu ~</h1>

        {pageMessage && <p className="site-message">{pageMessage}</p>}

        {categories.map((oneCategory) => (
          <div key={oneCategory} className="menu-category-block">
            <h2>
              <u>{oneCategory.toUpperCase()}</u>
            </h2>

            {getItemsByCategory(oneCategory).map((oneMenuItem) => (
              <div className="menu-item-card" key={oneMenuItem._id}>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{oneMenuItem.itemName}</h5>
                  <span className="fw-bold">
                    ${Number(oneMenuItem.price).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuPage;