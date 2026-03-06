"use client";
import React, { useState, useEffect, useRef } from "react";
import "./forget-password.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import {
  sendForgotPasswordCode,
  verifyForgotPasswordCode,
} from "@/API/ForgotPassword/ForgotPassword";
import en from "../../translation/en.json";
import ar from "../../translation/ar.json";

const CODE_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 30;

const ClientForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [translations, setTranslations] = useState(en);
  const codeInputRefs = useRef([]);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setTranslations(savedLang === "ar" ? ar : en);
    const handleStorageChange = () => {
      const newLang = localStorage.getItem("lang") || "en";
      setTranslations(newLang === "ar" ? ar : en);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => setResendCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleSendCode = async () => {
    setError(null);
    setSuccessMsg(null);
    if (!email.trim()) {
      setError(translations.pleaseEnterEmail || "Please enter your email");
      return;
    }
    const res = await sendForgotPasswordCode(
      email.trim(),
      setError,
      setLoading,
    );
    if (res?.success) {
      setStep(2);
      setResendCountdown(RESEND_COOLDOWN_SECONDS);
      setSuccessMsg(translations.codeSentToEmail || "Code sent to your email");
    }
  };

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < CODE_LENGTH - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH);
    if (!pasted) return;
    const newCode = [...code];
    for (let i = 0; i < pasted.length; i++) newCode[i] = pasted[i];
    setCode(newCode);
    const nextIndex = Math.min(pasted.length, CODE_LENGTH - 1);
    codeInputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    setError(null);
    const fullCode = code.join("");
    if (fullCode.length !== CODE_LENGTH) {
      setError(
        translations.pleaseEnterFullCode || "Please enter the 6-digit code",
      );
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError(
        translations.passwordMinLength ||
          "Password must be at least 6 characters",
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(translations.passwordsDoNotMatch || "Passwords do not match");
      return;
    }
    const res = await verifyForgotPasswordCode(
      email,
      code,
      newPassword,
      setError,
      setLoading,
    );
    if (res?.success) {
      setSuccessMsg(
        translations.passwordResetSuccess || "Password reset successfully!",
      );
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setError(null);
    const res = await sendForgotPasswordCode(email, setError, setLoading);
    if (res?.success) {
      setResendCountdown(RESEND_COOLDOWN_SECONDS);
      setSuccessMsg(
        translations.codeSentToEmail || "Code sent again to your email",
      );
    }
  };

  return (
    <div className="register">
      <div className="register-container">
        <div className="register-img">
          <Image
            src={"/images/logo.png"}
            alt="logo"
            loading="lazy"
            width={300}
            height={300}
          />
          <div className="register-img-content">
            <div className="imgs">
              <Image
                src={"/images/contact-us-reg.png"}
                alt="contact"
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
            <h3>{translations.highQualityCleaningSolutions}</h3>
          </div>
        </div>
        <div className="register-form">
          <h1>{translations.forgetPassword}</h1>
          <p>
            {step === 1
              ? translations.forgetPasswordDescription
              : translations.enterCodeSentToEmail}
          </p>
          <a href="/login">{translations.backToLogin}</a>
          <div className="form-content">
            {step === 1 && (
              <>
                <label>
                  <h3>
                    {translations.email}
                    <span>*</span>
                  </h3>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                  />
                </label>
                <button onClick={handleSendCode} disabled={loading}>
                  {loading ? translations.loading : translations.sendCode}
                </button>
              </>
            )}
            {step === 2 && (
              <>
                <label>
                  <h3>
                    {translations.verificationCode}
                    <span>*</span>
                  </h3>
                  <div className="code-inputs" onPaste={handlePaste}>
                    {code.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (codeInputRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(i, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(i, e)}
                        className={digit ? "filled" : ""}
                      />
                    ))}
                  </div>
                </label>
                <div className="resend-row">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCountdown > 0 || loading}
                  >
                    {resendCountdown > 0
                      ? `${translations.resendCodeIn || "Resend in"} ${resendCountdown}s`
                      : translations.resendCode}
                  </button>
                </div>
                <label>
                  <h3>
                    {translations.newPassword}
                    <span>*</span>
                  </h3>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </label>
                <label>
                  <h3>
                    {translations.confirmPassword}
                    <span>*</span>
                  </h3>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </label>
                <button onClick={handleVerify} disabled={loading}>
                  {loading ? translations.loading : translations.resetPassword}
                </button>
              </>
            )}
            {error && <p className="forget-error">{error}</p>}
            {successMsg && <p className="forget-success">{successMsg}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientForgetPassword;
