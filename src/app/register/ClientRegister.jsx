"use client";
import React, { useState } from "react";
import "./register.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import Register from "@/API/Register/Register";
const ClientRegister = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [taxCard, setTaxCard] = useState("");
  const [businessLicense, setBusinessLicense] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleRegister = () => {
    const data = {
      name,
      phone,
      email,
      taxCard,
      businessLicense,
    };
    Register(data, setError, setLoading);
  };
  return (
    <div className="register">
      <div className="register-container">
        <div className="register-img">
          <Image
            src={"/images/logo.png"}
            alt="register-img"
            loading="lazy"
            width={300}
            height={300}
          />
          <div className="register-img-content">
            <div className="imgs">
              <Image
                src={"/images/contact-us-reg.png"}
                alt="contact us link"
                loading="lazy"
                width={250}
                height={250}
              />
              <a href="https://x.com" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faXTwitter} className="icon" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faLinkedin} className="icon" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={faInstagram} className="icon" />
              </a>
            </div>
            <h3>high-quality cleaning and hygiene solutions</h3>
          </div>
        </div>
        <div className="register-form">
          <h1>Create an account</h1>
          <p>
            Already have an account? <a href="/login">Sign In</a>
          </p>
          <a href="/">Go To Home Page</a>

          <div className="form-content">
            <label>
              <h3>
                Company Name<span>*</span>
              </h3>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label>
              <h3>
                Email<span>*</span>
              </h3>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              <h3>
                Phone Number<span>*</span>
              </h3>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05 XXX XXXX"
              />
            </label>
            <div className="form-optional wrap">
              <label>
                <h3>
                  VAT Registration <span>( optional )</span>
                </h3>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  value={businessLicense}
                  onChange={(e) => setBusinessLicense(e.target.value)}
                />
              </label>
              <label>
                <h3>
                  Tax Registration Number<span>( optional )</span>
                </h3>
                <input
                  type="text"
                  value={taxCard}
                  onChange={(e) => setTaxCard(e.target.value)}
                />
              </label>
            </div>
            <div className="form-optional wrap">
              <label>
                <h3>
                  Commercial License <span>( optional )</span>
                </h3>
                <input type="file" accept=".pdf,.png,.jpg,.jpeg" />
              </label>
              <label>
                <h3>
                  Tax Number<span>( optional )</span>
                </h3>
                <input type="text" />
              </label>
              <label>
                <h3>
                  Expiry Date<span>( optional )</span>
                </h3>
                <input type="text" />
              </label>
            </div>
            <div className="register-terms">
              <input type="checkbox" />
              <h4>Agree to the Terms & Condition</h4>
            </div>
            <button onClick={handleRegister}>
              {loading ? "Creating..." : "Create an account"}
            </button>
            {error}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRegister;
