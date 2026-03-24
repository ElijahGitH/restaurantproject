import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav style={styles.nav}>
            <h2 style={styles.logo}>Restaurant App</h2>

            <div style={styles.links}>
                <Link to="/" style={styles.link}>Login</Link>
                <Link to="/admin" style={styles.link}>Admin</Link>
                <Link to="/user" style={styles.link}>User</Link>
                <Link to="/menu" style={styles.link}>Menu</Link>
                <Link to="/reservations" style={styles.link}>Reservations</Link>
                <Link to="/help" style={styles.link}>Help</Link>
            </div>
        </nav>
    );
}

const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        background: "#222",
        color: "white",
    },
    logo: {
        margin: 0,
    },
    links: {
        display: "flex",
        gap: "15px",
    },
    link: {
        color: "white",
        textDecoration: "none",
    },
};

export default Navbar;
