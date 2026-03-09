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
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import SendCode from "@/API/Password/SendCode";
import CheckCode from "@/API/Password/CheckCode";
import ChangePassword from "@/API/Password/ChangePassword";
import en from "../../translation/en.json";
import ar from "../../translation/ar.json";

const CODE_LENGTH = 5;
const RESEND_COOLDOWN_SECONDS = 30;

const ClientForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(""));
  const [codeVerified, setCodeVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [translations, setTranslations] = useState(en);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successSummary, setSuccessSummary] = useState({
    email: "",
    password: "",
  });
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
    const res = await SendCode(email.trim(), setError, setLoading);
    if (res?.success) {
      setStep(2);
      setCodeVerified(false);
      setCode(Array(CODE_LENGTH).fill(""));
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

  const handleCheckCode = async () => {
    setError(null);
    setSuccessMsg(null);
    const fullCode = code.join("");
    if (fullCode.length !== CODE_LENGTH) {
      setError(
        translations.pleaseEnterFullCode ||
          `Please enter the ${CODE_LENGTH}-digit code`,
      );
      return;
    }
    const res = await CheckCode(email, fullCode, setError, setLoading);
    if (res?.success) {
      setCodeVerified(true);
      setResendCountdown(0);
      setSuccessMsg(
        translations.codeActivatedEnterNewPassword ||
          "Code activated. Enter your new password below.",
      );
    }
  };

  const handleVerify = async () => {
    setError(null);
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
    const res = await ChangePassword(
      email,
      newPassword,
      confirmPassword,
      setError,
      setLoading,
    );
    if (res?.success) {
      setSuccessSummary({ email, password: newPassword });
      setShowSuccessModal(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);
    }
  };

  const handleResend = async () => {
    if (resendCountdown > 0) return;
    setError(null);
    const res = await SendCode(email, setError, setLoading);
    if (res?.success) {
      setCodeVerified(false);
      setCode(Array(CODE_LENGTH).fill(""));
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
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="forget_password_button"
                >
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
                        disabled={codeVerified}
                      />
                    ))}
                  </div>
                </label>
                {!codeVerified && (
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
                )}
                {!codeVerified ? (
                  <button
                    onClick={handleCheckCode}
                    disabled={loading}
                    className="forget_password_button"
                  >
                    {loading
                      ? translations.loading
                      : translations.verifyCode || "Verify code"}
                  </button>
                ) : (
                  <>
                    <div className="forget-message forget-message--success">
                      <span className="forget-message-icon">✓</span>
                      <p>{successMsg}</p>
                    </div>
                    <label>
                      <h3>
                        {translations.newPassword}
                        <span>*</span>
                      </h3>
                      <div className="forget-password-input-wrap">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="forget-password-toggle"
                          onClick={() => setShowNewPassword((v) => !v)}
                          title={
                            showNewPassword
                              ? translations.hidePassword
                              : translations.showPassword
                          }
                          aria-label={
                            showNewPassword
                              ? translations.hidePassword
                              : translations.showPassword
                          }
                        >
                          <FontAwesomeIcon
                            icon={showNewPassword ? faEyeSlash : faEye}
                          />
                        </button>
                      </div>
                    </label>
                    <label>
                      <h3>
                        {translations.confirmPassword}
                        <span>*</span>
                      </h3>
                      <div className="forget-password-input-wrap">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          className="forget-password-toggle"
                          onClick={() => setShowConfirmPassword((v) => !v)}
                          title={
                            showConfirmPassword
                              ? translations.hidePassword
                              : translations.showPassword
                          }
                          aria-label={
                            showConfirmPassword
                              ? translations.hidePassword
                              : translations.showPassword
                          }
                        >
                          <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                          />
                        </button>
                      </div>
                    </label>
                    <button
                      onClick={handleVerify}
                      disabled={loading}
                      className="forget_password_button"
                    >
                      {loading
                        ? translations.loading
                        : translations.resetPassword}
                    </button>
                  </>
                )}
              </>
            )}
            {error && (
              <div className="forget-message forget-message--error">
                <span className="forget-message-icon">!</span>
                <p>{error}</p>
              </div>
            )}
            {successMsg && !codeVerified && (
              <div className="forget-message forget-message--success">
                <span className="forget-message-icon">✓</span>
                <p>{successMsg}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="forget-success-overlay" role="dialog" aria-modal="true">
          <div className="forget-success-modal">
            <div className="forget-success-modal-icon">✓</div>
            <h3>
              {translations.passwordConfirmedTitle || "Password confirmed"}
            </h3>
            <p className="forget-success-modal-text">
              {translations.passwordConfirmedUseNew ||
                "Use your new password to sign in."}
            </p>
            <div className="forget-success-summary">
              <p>
                <strong>{translations.email}:</strong> {successSummary.email}
              </p>
              <p>
                <strong>{translations.newPassword}:</strong>{" "}
                {successSummary.password}
              </p>
            </div>
            <p className="forget-success-redirect">
              {translations.redirectingToLoginIn || "Redirecting to login in"} 5{" "}
              {translations.seconds || "seconds"}...
            </p>
            <div className="forget-success-progress">
              <div className="forget-success-progress-bar" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientForgetPassword;
