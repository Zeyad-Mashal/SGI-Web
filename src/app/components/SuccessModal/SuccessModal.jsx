"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./SuccessModal.css";

const SuccessModal = ({ isOpen, onClose }) => {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Auto-close and redirect after 5 seconds
      const timer = setTimeout(() => {
        onClose();
        router.push("/");
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, router]);

  const handleGoHome = () => {
    onClose();
    router.push("/");
  };

  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay" onClick={handleGoHome}>
      <div className="success-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="success-modal-icon">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark-check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <h2 className="success-modal-title">Your Request set Successfully</h2>
        <p className="success-modal-message">
          We take it into consideration, wait for review
        </p>
        <button className="success-modal-button" onClick={handleGoHome}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;

