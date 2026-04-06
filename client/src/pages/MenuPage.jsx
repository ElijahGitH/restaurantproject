import { useEffect, useState } from "react";
import SiteNavbar from "../components/SiteNavbar";
import "./SiteTheme.css";

function MenuPage() {
  const [seasonalItems, setSeasonalItems] = useState([]);
  const [pageMessage, setPageMessage] = useState("");

  useEffect(() => {
    loadSeasonalItems();
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

  const staticMenu = [
    {
      category: "STARTERS",
      items: [
        {
          itemName: "Chips & Queso",
          price: 4.99,
          description: "Warm, creamy queso blanco served with crispy tortilla chips."
        },
        {
          itemName: "Chips & Salsa",
          price: 4.99,
          description: "Freshly made tortilla chips served with our house-made jalapeño salsa."
        },
        {
          itemName: "Guacamole & Chicharrones",
          price: 9.99,
          description: "Prepared-to-order guacamole served with crispy pork belly for dipping."
        },
        {
          itemName: "Sol Sampler",
          price: 15.99,
          description: "Taquitos, cheese quesadilla, nachos, and a chicken flauta with guacamole and sour cream."
        },
        {
          itemName: "Taquitos Dorados",
          price: 8.99,
          description: "Crispy rolled corn tortillas filled with seasoned chicken or beef."
        }
      ]
    },
    {
      category: "SMALL PLATES",
      items: [
        {
          itemName: "Sol Street Corn",
          price: 7.99,
          description: "Grilled corn topped with cotija cheese, chili powder, and lime."
        },
        {
          itemName: "Jamon Croquetas",
          price: 8.99,
          description: "Crispy croquettes filled with creamy potatoes and savory ham."
        },
        {
          itemName: "Sol Salad",
          price: 11.99,
          description: "Romaine, tomatoes, avocado, red onions, cucumbers, cheese, and grilled chicken."
        },
        {
          itemName: "Yuca Fries",
          price: 6.99,
          description: "Golden fried yuca served with creamy garlic sauce."
        },
        {
          itemName: "Pollo Asado Skewers",
          price: 10.99,
          description: "Marinated chicken skewers grilled over an open flame."
        }
      ]
    },
    {
      category: "SPECIALS",
      items: [
        {
          itemName: "Pegasus Plate",
          price: 18.99,
          description: "Grilled arrachera steak and chicken with a cheese enchilada, rice, and beans."
        },
        {
          itemName: "Knight's Feast",
          price: 17.99,
          description: "Steak fajitas with peppers, onions, rice, beans, and Mexican street corn."
        },
        {
          itemName: "Charge On Combo",
          price: 16.99,
          description: "A beef taco, chicken enchilada, and cheese quesadilla with rice and beans."
        }
      ]
    },
    {
      category: "ENTREES",
      items: [
        {
          itemName: "Tamales",
          price: 12.99,
          description: "Traditional masa filled with seasoned meat and served with rice and beans."
        },
        {
          itemName: "Burritos",
          price: 14.99,
          description: "Large flour tortilla stuffed with meat, rice, beans, and cheese."
        },
        {
          itemName: "Quesadillas",
          price: 13.99,
          description: "Grilled flour tortillas loaded with melted cheese and your choice of protein."
        },
        {
          itemName: "Enchiladas",
          price: 13.49,
          description: "Corn tortillas rolled with filling and smothered in red or green sauce."
        },
        {
          itemName: "Chile Rellenos",
          price: 14.49,
          description: "Roasted poblano peppers stuffed with cheese or meat."
        },
        {
          itemName: "Nachos",
          price: 12.99,
          description: "Loaded nachos topped with savory ingredients and house flavors."
        },
        {
          itemName: "Molcajete",
          price: 21.99,
          description: "A sizzling stone bowl with grilled meats, shrimp, and vegetables."
        },
        {
          itemName: "Fajitas Tapatias",
          price: 19.99,
          description: "Steak, chicken, and shrimp with peppers and onions."
        },
        {
          itemName: "Arrachera",
          price: 19.99,
          description: "Juicy marinated skirt steak served with rice, beans, and tortillas."
        }
      ]
    },
    {
      category: "KID'S MENU",
      items: [
        {
          itemName: "Quesadilla",
          price: 5.99,
          description: "Warm toasted tortilla filled with melted cheese."
        },
        {
          itemName: "Burrito",
          price: 5.99,
          description: "Soft flour tortilla filled with chicken or beef, rice, and cheese."
        },
        {
          itemName: "Chicken Tenders",
          price: 5.99,
          description: "Crispy chicken tenders served with fries."
        }
      ]
    },
    {
      category: "DESSERTS",
      items: [
        {
          itemName: "Creamy Flan",
          price: 5.99,
          description: "Silky custard dessert topped with caramel sauce."
        },
        {
          itemName: "Cinnamon Churros",
          price: 8.99,
          description: "Golden-fried churros served warm with chocolate dipping sauce."
        },
        {
          itemName: "Arroz con Leche",
          price: 6.99,
          description: "Creamy rice pudding infused with cinnamon and sweetened milk."
        },
        {
          itemName: "Tres Leches Cake",
          price: 6.99,
          description: "Light sponge cake soaked in three milks and topped with whipped cream."
        }
      ]
    },
    {
      category: "DRINKS & BEVERAGES",
      items: [
        {
          itemName: "Soft Drinks",
          price: 2.99,
          description: "Coca-Cola, Sprite, Fanta, Dr Pepper, and more."
        },
        {
          itemName: "Lemonade",
          price: 2.49,
          description: "Classic, strawberry, raspberry, blueberry, or peach."
        },
        {
          itemName: "Iced Tea",
          price: 1.99,
          description: "Sweet or unsweet black tea, peach, lemon, or raspberry."
        }
      ]
    }
  ];

  return (
    <div className="menu-page">
      <SiteNavbar />

      <div className="container mt-5 mb-5">
        <h1 className="text-center display-3">~ Menu ~</h1>

        {pageMessage && <p className="site-message">{pageMessage}</p>}

        {staticMenu.map((oneSection) => (
          <div key={oneSection.category} className="menu-category-block">
            <h2>
              <u>{oneSection.category}</u>
            </h2>

            {oneSection.items.map((oneItem) => (
              <div
                className="card shadow h-100 menu-card-spacing"
                key={`${oneSection.category}-${oneItem.itemName}`}
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">{oneItem.itemName}</h5>
                    <span className="fw-bold">${oneItem.price.toFixed(2)}</span>
                  </div>

                  <p className="card-text mt-2 mb-0">{oneItem.description}</p>
                </div>
              </div>
            ))}
          </div>
        ))}

        <div className="menu-category-block">
          <h2>
            <u>SEASONAL MENU</u>
          </h2>

          {seasonalItems.length === 0 ? (
            <div className="card shadow h-100 menu-card-spacing">
              <div className="card-body">
                <p className="card-text mb-0">No seasonal items right now.</p>
              </div>
            </div>
          ) : (
            seasonalItems.map((oneItem) => (
              <div className="card shadow h-100 menu-card-spacing" key={oneItem._id}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">{oneItem.itemName}</h5>
                    <span className="fw-bold">
                      ${Number(oneItem.price).toFixed(2)}
                    </span>
                  </div>

                  <h6 className="card-subtitle mt-2 text-muted">
                    {oneItem.category}
                  </h6>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuPage;