"use client";
import React, { useEffect, useState } from "react";
import "./Toast.css";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const Toast = ({ message, type = "success", onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    // Trigger entrance animation
    setTimeout(() => setIsVisible(true), 10);

    // Auto close after 3 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheckCircle />;
      case "error":
        return <FaTimesCircle />;
      case "info":
        return <FaInfoCircle />;
      case "warning":
        return <FaExclamationTriangle />;
      default:
        return <FaCheckCircle />;
    }
  };

  return (
    <div
      className={`toast toast-${type} ${isVisible ? "toast-visible" : ""} ${
        isLeaving ? "toast-leaving" : ""
      }`}
    >
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={handleClose}>
        <IoClose />
      </button>
    </div>
  );
};

export default Toast;

