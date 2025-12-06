"use client";
import React, { useState } from "react";
import "./login.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import Login from "@/API/Login/Login";
const ClientLogin = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    const data = {
      email,
      password,
    };
    Login(data, setError, setLoading);
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
          <h1>Sign In</h1>
          <p>
            Don’t have an account? <a href="/register">Sign Up</a>
          </p>
          <a href="/">Go To Home Page</a>
          <div className="form-content">
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
                Password<span>*</span>
              </h3>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button onClick={handleLogin}>
              {loading ? "loaindg ..." : "Sign In"}
            </button>
            {error}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
