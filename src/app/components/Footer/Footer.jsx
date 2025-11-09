import React from "react";
import "./Footer.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faSquareFacebook,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
const Footer = () => {
  return (
    <div className="Footer">
      <div className="Footer_container">
        <div className="Footer_logo">
          <Image
            src={"/images/logo-black.png"}
            alt="footer logo"
            loading="lazy"
            width={200}
            height={200}
          />
          <p>
            We provide high-quality cleaning and hygiene solutions designed
            specifically for businesses and organizations. Our wide range of
            liquid detergents and professional cleaning products .
          </p>
        </div>
        <div className="footer_company">
          <h3>Company</h3>
          <ul>
            <li>Home</li>
            <li>Shop</li>
            <li>About us</li>
          </ul>
        </div>
        <div className="footer_company">
          <h3>Support</h3>
          <ul>
            <li>Contact us</li>
            <li>Blogs</li>
          </ul>
        </div>
        <div className="footer_company">
          <h3>Resources</h3>
          <ul>
            <li>Help center</li>
            <li>FAQs</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="footer_copyright">
        <p>© sgi Inc. All Rights Reserved.</p>
        <div className="footer_social">
          <FontAwesomeIcon icon={faXTwitter} />
          <FontAwesomeIcon icon={faSquareFacebook} />
          <FontAwesomeIcon icon={faInstagram} />
          <FontAwesomeIcon icon={faLinkedin} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
