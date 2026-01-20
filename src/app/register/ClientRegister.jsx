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
import SuccessModal from "@/app/components/SuccessModal/SuccessModal";
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
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // File size validation - max 200 KB
  const MAX_FILE_SIZE = 200 * 1024; // 200 KB in bytes

  const validateFileSize = (file) => {
    if (file && file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds 200 KB. Please choose a smaller file.`);
      return false;
    }
    return true;
  };

  const handleVatFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (validateFileSize(file)) {
        setVatFile(file);
        setError(null); // Clear any previous errors
      } else {
        // Clear the file input
        e.target.value = "";
        setVatFile(null);
      }
    } else {
      setVatFile(null);
    }
  };

  const handleCommercialFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (validateFileSize(file)) {
        setCommercialFile(file);
        setError(null); // Clear any previous errors
      } else {
        // Clear the file input
        e.target.value = "";
        setCommercialFile(null);
      }
    } else {
      setCommercialFile(null);
    }
  };

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

    Register(formData, setError, setLoading, () => {
      setShowSuccessModal(true);
    });
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
                  onChange={handleVatFileChange}
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
                  onChange={handleCommercialFileChange}
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
            {error && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  backgroundColor: "#fee",
                  border: "1px solid #fcc",
                  borderRadius: "8px",
                  color: "#c33",
                  fontSize: "0.9rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>⚠️</span>
                <span>{error}</span>
              </div>
            )}
            <button onClick={handleRegister}>
              {loading ? "Creating..." : "Create an account"}
            </button>
          </div>
        </div>
      </div>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default ClientRegister;
