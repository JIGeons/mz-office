import React from "react";

// CSS
import "../../styles/components/footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <p>&copy; {new Date().getFullYear()} MZOffice. All rights reserved.</p>
        </footer>
    );
}

export default Footer;