import { useState } from "react";

function Menu() {
  const [menuItems] = useState([
    { name: "Tacos", description: "Soft corn tortillas with your choice of meat, onions, and cilantro", price: 3.5 },
    { name: "Burrito", description: "Large flour tortilla filled with rice, beans, cheese, and protein", price: 10.99 },
    { name: "Quesadilla", description: "Grilled tortilla with melted cheese and optional meat", price: 8.99 },
    { name: "Enchiladas", description: "Rolled tortillas covered in red or green sauce with cheese", price: 11.99 },
    { name: "Nachos", description: "Tortilla chips topped with cheese, jalapeños, and salsa", price: 7.99 },
    { name: "Guacamole & Chips", description: "Fresh avocado dip with crispy tortilla chips", price: 6.99 },
    { name: "Churros", description: "Fried dough pastry with cinnamon sugar", price: 4.99 },
    { name: "Horchata", description: "Sweet rice milk drink with cinnamon", price: 3.99 }
  ]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌮 Menu</h1>

      {menuItems.map((item, index) => (
        <div key={index} style={{ marginBottom: "15px" }}>
          <h3>{item.name} - ${item.price}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Menu;
