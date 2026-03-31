// basic homepage
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [featuredItems, setFeaturedItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch menu items from backend
        fetch("/api/menu")
            .then((res) => res.json())
            .then((data) => {
                // Show only first 3 items
                setFeaturedItems(data.slice(0, 3));
            })
            .catch((err) => console.error("Error fetching menu:", err));
    }, []);

    return (
        <div style={{ padding: "20px" }}>

            {/* HERO SECTION */}
            <section style={{ textAlign: "center", marginBottom: "40px" }}>
                <h1> Authentic Mexican Cuisine</h1>
                <p>Order online or reserve your table today</p>
            </section>

            {/* FEATURED MENU */}
            <section style={{ marginBottom: "40px", textAlign: "center" }}>
                <h2> Popular Dishes</h2>

                <div>
                    {featuredItems.map((item) => (
                        <div key={item._id} style={{ border: "1px solid black", padding: "10px", marginTop: "10px" }}>
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                            <p><strong>${item.price}</strong></p>
                        </div>
                    ))}
                </div>

                <button onClick={() => navigate("/menu")} style={{ marginTop: "15px" }}>
                    View Full Menu
                </button>
            </section>

            {/* RESERVATION CTA */}
            <section style={{ marginBottom: "40px", textAlign: "center" }}>
                <h2> Book a Table</h2>
                <p>Reserve your spot quickly and easily</p>

                <button onClick={() => navigate("/reservations")}>
                    Reserve Now
                </button>
            </section>

            {/* ACCOUNT SECTION */}
            <section style={{ textAlign: "center", marginBottom: "40px" }}>
                <h2> Your Account</h2>
                <button onClick={() => navigate("/loginpage")}>
                    Login
                </button>
            </section>

            {/* ABOUT SECTION */}
            <section style={{ textAlign: "center" }}>
                <h2>About Us</h2>
                <p>
                    We are a family-owned Mexican restaurant serving fresh, authentic dishes
                    made with quality ingredients.
                </p>
            </section>

        </div>
    );
}
