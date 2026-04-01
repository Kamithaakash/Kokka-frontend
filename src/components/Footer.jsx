import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-icon">💕</span>
              <span>SoulMatch</span>
            </div>
            <p className="footer-tagline">
              Find your perfect life partner among thousands of verified Sri Lankan profiles.
            </p>
          </div>
          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/browse">Browse Profiles</Link>
            <Link to="/register">Create Profile</Link>
            <Link to="/login">Login</Link>
          </div>
          <div className="footer-links-col">
            <h4>Support</h4>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
            <a href="#">FAQ</a>
          </div>
          <div className="footer-links-col">
            <h4>Follow Us</h4>
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">Twitter</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SoulMatch. All rights reserved.</p>
          <p>Made with 💕 in Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
}
