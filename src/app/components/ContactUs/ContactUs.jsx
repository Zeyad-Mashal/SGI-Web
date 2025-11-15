import React from "react";
import "./ContactUs.css";
import { FiPhone } from "react-icons/fi";
import { SlLocationPin } from "react-icons/sl";
import { AiOutlineMail } from "react-icons/ai";

const ContactUs = () => {
  return (
    <div className="ContactUs">
      <div className="contactUS_container">
        <h1>Contact Us</h1>
        <p>Contact us to start your journey today</p>
        <div className="ContactUs_list">
          <div className="ContactUs_item">
            <AiOutlineMail />

            <h3>Email</h3>
            <p>Office : hello@skyline.co</p>
            <div className="ContactUs_item_btn">
              <button>Contact us</button>
              <p>*available 24 hrs</p>
            </div>
          </div>
          <div className="ContactUs_item">
            <FiPhone />
            <h3>Phone</h3>
            <p>Office : +91 8932-1151-22</p>
            <div className="ContactUs_item_btn">
              <button>Contact us</button>
              <p>*available 24 hrs</p>
            </div>
          </div>
          <div className="ContactUs_item">
            <SlLocationPin />

            <h3>Location</h3>
            <p>Office : 123 Maple Street, Springfield</p>
            <div className="ContactUs_item_btn">
              <button>Contact us</button>
              <p>*available 24 hrs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
