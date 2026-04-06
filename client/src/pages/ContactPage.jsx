import SiteNavbar from "../components/SiteNavbar";
import "./SiteTheme.css";

function ContactPage() {
  return (
    <div className="site-simple-page">
      <SiteNavbar />

      <div className="container mt-5 mb-5">
        <h1 className="text-center display-3">Contact Us</h1>

        <div className="contact-card">
          <h2>We'd love to hear from you</h2>
          <p>Email: hello@casadelsol.com</p>
          <p>Phone: (407) 555-0199</p>
          <p>Address: 789 Sol Street, Sanford, FL 32771</p>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;