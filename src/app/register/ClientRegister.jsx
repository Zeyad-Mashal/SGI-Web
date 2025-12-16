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
  const [taxRegistration, setTaxRegistration] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [vatFile, setVatFile] = useState(null);
  const [commercialFile, setCommercialFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    // Validation
    if (!name.trim()) {
      setError("Please enter company name");
      return;
    }
    if (!email.trim()) {
      setError("Please enter email");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter phone number");
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("phone", phone.trim());
    formData.append("taxRegistration", taxRegistration.trim());
    formData.append("taxNumber", taxNumber.trim());
    formData.append("expiryDate", expiryDate.trim());

    // Append files if they exist
    if (vatFile) {
      formData.append("vatFile", vatFile);
    }
    if (commercialFile) {
      formData.append("commercialFile", commercialFile);
    }

    Register(formData, setError, setLoading);
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
                  Tax Registration Number<span>( optional )</span>
                </h3>
                <input
                  type="text"
                  value={taxRegistration}
                  onChange={(e) => setTaxRegistration(e.target.value)}
                />
              </label>
              <label>
                <h3>
                  Tax Number<span>( optional )</span>
                </h3>
                <input
                  type="text"
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                />
              </label>
            </div>
            <div className="form-optional wrap">
              <label>
                <h3>
                  VAT File <span>( optional )</span>
                </h3>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setVatFile(e.target.files[0] || null)}
                />
                {vatFile && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginTop: "0.25rem",
                    }}
                  >
                    {vatFile.name}
                  </p>
                )}
              </label>
              <label>
                <h3>
                  Commercial File <span>( optional )</span>
                </h3>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={(e) => setCommercialFile(e.target.files[0] || null)}
                />
                {commercialFile && (
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#666",
                      marginTop: "0.25rem",
                    }}
                  >
                    {commercialFile.name}
                  </p>
                )}
              </label>
              <label>
                <h3>
                  Expiry Date<span>( optional )</span>
                </h3>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
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
