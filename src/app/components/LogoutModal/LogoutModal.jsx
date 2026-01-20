"use client";
import React from "react";
import "./LogoutModal.css";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="logout-modal-overlay" onClick={onClose}>
      <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="logout-modal-icon">
          <svg
            className="logout-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>
        <h2 className="logout-modal-title">Are you sure you want to logout?</h2>
        <p className="logout-modal-message">
          You will need to login again to access your account
        </p>
        <div className="logout-modal-buttons">
          <button className="logout-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="logout-modal-confirm" onClick={handleConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;

