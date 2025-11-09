import React from "react";
import "./ContactUs.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPhone,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
const ContactUs = () => {
  return (
    <div className="ContactUs">
      <h1>Contact Us</h1>
      <p>Contact us to start your journey today</p>
      <div className="ContactUs_list">
        <div className="ContactUs_item">
          <FontAwesomeIcon icon={faEnvelope} />
          <h3>Email</h3>
          <p>Office : hello@skyline.co</p>
          <div className="ContactUs_item_btn">
            <button>Contact us</button>
            <p>*available 24 hrs</p>
          </div>
        </div>
        <div className="ContactUs_item">
          <FontAwesomeIcon icon={faPhone} />
          <h3>Phone</h3>
          <p>Office : +91 8932-1151-22</p>
          <div className="ContactUs_item_btn">
            <button>Contact us</button>
            <p>*available 24 hrs</p>
          </div>
        </div>
        <div className="ContactUs_item">
          <FontAwesomeIcon icon={faLocationDot} />
          <h3>Location</h3>
          <p>Office : 123 Maple Street, Springfield</p>
          <div className="ContactUs_item_btn">
            <button>Contact us</button>
            <p>*available 24 hrs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
