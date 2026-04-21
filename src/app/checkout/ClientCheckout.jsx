"use client";
import React, { useCallback, useEffect, useState } from "react";
import "./checkout.css";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import GetAddress from "@/API/Address/GetAddress";
import AddAddress from "@/API/Address/AddAddress";
import CreateOrder from "@/API/Orders/CreateOrder";
import CreatePayment from "@/API/Payment/CreatePayment";
import { resolveOppwaWidgetHost } from "@/constants/payment";
import { getCart, getCartTotal, clearCart } from "@/utils/cartUtils";
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa6";
import SuccessModal from "@/app/components/SuccessModal/SuccessModal";
import en from "../../translation/en.json";
import ar from "../../translation/ar.json";

// UAE Cities with translations
const UAE_CITIES = [
  { value: "abu-dhabi", en: "Abu Dhabi", ar: "أبو ظبي" },
  { value: "dubai", en: "Dubai", ar: "دبي" },
  { value: "sharjah", en: "Sharjah", ar: "الشارقة" },
  { value: "ajman", en: "Ajman", ar: "عجمان" },
  { value: "ras-al-khaimah", en: "Ras Al Khaimah", ar: "رأس الخيمة" },
  { value: "fujairah", en: "Fujairah", ar: "الفجيرة" },
  { value: "umm-al-quwain", en: "Umm Al Quwain", ar: "أم القيوين" },
  { value: "al-ain", en: "Al Ain", ar: "العين" },
];

const PENDING_ORDER_KEY = "pendingOrderAfterPayment";
/** Same-tab metadata; optional for support / debugging */
const PENDING_GATEWAY_CHECKOUT_KEY = "pendingGatewayCheckoutId";

const isCardGatewayPayment = (way) =>
  way === "Cash by Visa/Mastercard" || way === "Cash by credit";

const ClientCheckout = () => {
  const router = useRouter();

  // Personal Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");

  // Address Information
  const [city, setCity] = useState("");
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [writtenAddress, setWrittenAddress] = useState(""); // For non-logged-in users

  // Language
  const [lang, setLang] = useState("en");
  const [translations, setTranslations] = useState(en);

  // Payment
  const [paymentWay, setPaymentWay] = useState("Cash on Delivery");
  const [checkoutSessionId, setCheckoutSessionId] = useState(null);
  const [paymentSessionLoading, setPaymentSessionLoading] = useState(false);
  const [paymentSessionError, setPaymentSessionError] = useState("");
  const [paymentReturnUrl, setPaymentReturnUrl] = useState("");
  /** Form valid + pending order written to sessionStorage for /payment/result */
  const [gatewayOrderReady, setGatewayOrderReady] = useState(false);
  const [gatewayMissingFieldsMsg, setGatewayMissingFieldsMsg] = useState("");

  // Address Management
  const [newAddress, setNewAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [id, setId] = useState("");

  // Cart and Order
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [discount, setDiscount] = useState(0);

  // State Management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Helper function to decode JWT token and get userId
  const getUserIdFromToken = () => {
    try {
      const token = localStorage.getItem("sgitoken");
      if (!token) return null;

      // JWT format: header.payload.signature
      const payload = token.split(".")[1];
      if (!payload) return null;

      // Decode base64 payload
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.id || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const getAddresses = () => {
    GetAddress(setAddresses, setError, setLoading);
  };

  // Calculate shipping based on order value
  const calculateShipping = (orderValue) => {
    if (orderValue >= 1 && orderValue <= 99) {
      return 30;
    } else if (orderValue >= 100 && orderValue <= 199) {
      return 20;
    } else if (orderValue >= 200 && orderValue <= 299) {
      return 10;
    } else if (orderValue >= 300) {
      return 0;
    }
    return 0; // Default case
  };

  useEffect(() => {
    // Check for token (logged in status)
    const token = localStorage.getItem("sgitoken");
    const userId = token ? getUserIdFromToken() : null;

    setId(userId || "");

    // Load language
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    setTranslations(savedLang === "ar" ? ar : en);

    // Load cart items
    const cart = getCart();
    setCartItems(cart);

    // Calculate total amount
    const calculatedSubtotal = getCartTotal();
    const calculatedShipping = calculateShipping(calculatedSubtotal);
    // Tax is 5% of (subtotal + shipping)
    const calculatedTax = (calculatedSubtotal + calculatedShipping) * 0.05;
    const totalBeforeDiscount =
      calculatedSubtotal + calculatedShipping + calculatedTax; // Subtotal + Shipping + Tax

    setSubtotal(calculatedSubtotal);
    setShipping(calculatedShipping);
    setTax(calculatedTax);

    // Check for saved coupon discount
    const savedCoupon = localStorage.getItem("savedCoupon");
    if (savedCoupon) {
      const { discount: discountPercent } = JSON.parse(savedCoupon);
      // Discount is applied to the total (subtotal + shipping + tax)
      const discountAmount = totalBeforeDiscount * (discountPercent / 100);
      setDiscount(discountAmount);
      setTotalAmount(totalBeforeDiscount - discountAmount);
    } else {
      setDiscount(0);
      setTotalAmount(totalBeforeDiscount);
    }

    // Load addresses if user is logged in
    if (userId) {
      getAddresses();
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const origin =
      process.env.NEXT_PUBLIC_PAYMENT_RETURN_ORIGIN?.trim()?.replace(/\/$/, "") ||
      window.location.origin;
    setPaymentReturnUrl(`${origin}/payment/result`);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isCardGatewayPayment(paymentWay)) {
      sessionStorage.removeItem(PENDING_ORDER_KEY);
      sessionStorage.removeItem(PENDING_GATEWAY_CHECKOUT_KEY);
      setGatewayOrderReady(false);
    }
  }, [paymentWay]);

  useEffect(() => {
    if (!paymentReturnUrl) return;
    if (!isCardGatewayPayment(paymentWay)) {
      setCheckoutSessionId(null);
      setPaymentSessionError("");
      setPaymentSessionLoading(false);
      return;
    }
    if (cartItems.length === 0 || totalAmount <= 0) {
      setCheckoutSessionId(null);
      return;
    }

    let cancelled = false;

    const startSession = async () => {
      setPaymentSessionLoading(true);
      setPaymentSessionError("");
      setCheckoutSessionId(null);

      const result = await CreatePayment(
        { amount: Number(totalAmount.toFixed(2)) },
        (msg) => {
          if (!cancelled) {
            setPaymentSessionError(
              msg || (lang === "ar" ? "تعذر بدء الدفع" : "Payment setup failed")
            );
          }
        },
        () => {}
      );

      if (cancelled) return;

      setPaymentSessionLoading(false);

      if (!result) {
        setCheckoutSessionId(null);
        return;
      }

      const cid =
        result.checkoutId ?? result.id ?? result.data?.id ?? result.data?.checkoutId;
      if (cid) {
        setCheckoutSessionId(String(cid));
      } else {
        setCheckoutSessionId(null);
        if (!cancelled) {
          setPaymentSessionError(
            lang === "ar"
              ? "لم يُرجع الخادم رقم الجلسة"
              : "No checkout session from server"
          );
        }
      }
    };

    startSession();

    return () => {
      cancelled = true;
    };
  }, [paymentWay, totalAmount, cartItems.length, paymentReturnUrl, lang]);

  useEffect(() => {
    if (!checkoutSessionId || !paymentReturnUrl || !gatewayOrderReady) return undefined;

    const scriptId = "oppwa-payment-widgets-script";
    const existing = document.getElementById(scriptId);
    if (existing) existing.remove();
    try {
      delete window.wpwl;
    } catch {
      /* ignore */
    }

    window.wpwlOptions = {
      locale: lang === "ar" ? "ar" : "en",
    };

    const script = document.createElement("script");
    script.id = scriptId;
    const widgetHost = resolveOppwaWidgetHost(checkoutSessionId);
    script.src = `${widgetHost}/v1/paymentWidgets.js?checkoutId=${encodeURIComponent(
      checkoutSessionId
    )}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
      try {
        delete window.wpwl;
      } catch {
        /* ignore */
      }
    };
  }, [checkoutSessionId, paymentReturnUrl, lang, gatewayOrderReady]);

  const persistGatewayPendingOrder = useCallback(() => {
    if (typeof window === "undefined") return false;
    if (!isCardGatewayPayment(paymentWay) || !checkoutSessionId) return false;

    if (!firstName.trim() || !lastName.trim()) return false;
    if (!userPhone.trim()) return false;
    if (!city.trim()) return false;

    let deliveryAddress = "";
    if (id) {
      if (selectedAddressIndex === null || !addresses[selectedAddressIndex]) {
        return false;
      }
      deliveryAddress = addresses[selectedAddressIndex];
    } else {
      if (!writtenAddress.trim()) return false;
      deliveryAddress = writtenAddress.trim();
    }

    if (cartItems.length === 0) return false;

    const formattedCartItems = cartItems.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
      sku: item.sku || item._id,
      name: item.name,
      price: item.price,
    }));

    const orderData = {
      paymentWay,
      userName: `${firstName.trim()} ${lastName.trim()}`,
      userPhone: userPhone.trim(),
      email: email.trim() || undefined,
      totalAmount,
      city: city.trim(),
      address: deliveryAddress,
      cartItems: formattedCartItems,
    };

    try {
      sessionStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(orderData));
      sessionStorage.setItem(PENDING_GATEWAY_CHECKOUT_KEY, checkoutSessionId);
      return true;
    } catch {
      return false;
    }
  }, [
    paymentWay,
    checkoutSessionId,
    firstName,
    lastName,
    userPhone,
    email,
    city,
    id,
    selectedAddressIndex,
    addresses,
    writtenAddress,
    cartItems,
    totalAmount,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isCardGatewayPayment(paymentWay) || !checkoutSessionId) {
      if (isCardGatewayPayment(paymentWay) && !checkoutSessionId) {
        setGatewayOrderReady(false);
      }
      setGatewayMissingFieldsMsg("");
      return;
    }
    const ok = persistGatewayPendingOrder();
    setGatewayOrderReady(ok);
    if (!ok) {
      sessionStorage.removeItem(PENDING_ORDER_KEY);
      sessionStorage.removeItem(PENDING_GATEWAY_CHECKOUT_KEY);
      setGatewayMissingFieldsMsg(translations.completeFormForGatewayPayment);
    } else {
      setGatewayMissingFieldsMsg("");
    }
  }, [
    paymentWay,
    checkoutSessionId,
    persistGatewayPendingOrder,
    translations.completeFormForGatewayPayment,
  ]);

  const HandleAddAddress = () => {
    if (newAddress.trim() === "") return;

    const updatedAddresses = [...addresses, newAddress];
    const data = {
      addresses: updatedAddresses,
      userId: id,
    };
    AddAddress(data, setError, setLoading, getAddresses);
    setNewAddress("");
  };

  const removeAddress = (index) => {
    const updated = addresses.filter((_, i) => i !== index);

    const data = {
      userId: id,
      addresses: updated,
    };

    AddAddress(data, setError, setLoading, getAddresses);
  };

  const selectAddress = (index) => {
    setSelectedAddressIndex(index);
  };

  useEffect(() => {
    if (!id) return;
    if (selectedAddressIndex !== null) return;
    if (!addresses?.length) return;
    // Auto-select first saved address to avoid blocking gateway payment readiness.
    setSelectedAddressIndex(0);
  }, [id, addresses, selectedAddressIndex]);

  const handleSubmitOrder = async () => {
    if (isCardGatewayPayment(paymentWay)) return;

    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      setError(translations.pleaseEnterFullName);
      return;
    }
    if (!userPhone.trim()) {
      setError(translations.pleaseEnterPhone);
      return;
    }
    if (!city.trim()) {
      setError(translations.pleaseSelectCity);
      return;
    }

    // Address validation: for logged-in users, require selected address; for non-logged-in, require written address
    let deliveryAddress = "";
    if (id) {
      // Logged-in user: must select an address
      if (selectedAddressIndex === null || !addresses[selectedAddressIndex]) {
        setError(translations.pleaseSelectDeliveryAddress);
        return;
      }
      deliveryAddress = addresses[selectedAddressIndex];
    } else {
      // Non-logged-in user: must write an address
      if (!writtenAddress.trim()) {
        setError(translations.pleaseEnterDeliveryAddress);
        return;
      }
      deliveryAddress = writtenAddress.trim();
    }

    if (cartItems.length === 0) {
      setError(translations.yourCartIsEmpty);
      return;
    }

    setError("");
    setSuccess("");

    // Format cart items for order
    const formattedCartItems = cartItems.map((item) => ({
      productId: item._id,
      quantity: item.quantity,
      sku: item.sku || item._id, // Use SKU if available, otherwise use product ID
      name: item.name,
      price: item.price,
    }));

    const userName = `${firstName.trim()} ${lastName.trim()}`;
    const userPhoneVal = userPhone.trim();

    const orderData = {
      paymentWay: paymentWay,
      userName,
      userPhone: userPhoneVal,
      email: email.trim() || undefined,
      totalAmount: totalAmount,
      city: city.trim(),
      address: deliveryAddress,
      cartItems: formattedCartItems,
    };

    // Cash on Delivery & bank transfer: create order مباشرة
    const result = await CreateOrder(orderData, setError, setLoading, () => {});

    if (result) {
      setSuccess(translations.orderPlacedSuccessfully);
      clearCart();
      localStorage.removeItem("savedCoupon");
    }
  };

  return (
    <div className="checkout">
      <h1>{translations.checkout}</h1>

      {error && (
        <div
          style={{
            color: "red",
            marginBottom: "1rem",
            padding: "0.5rem",
            background: "#ffe8e8",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      <SuccessModal
        isOpen={!!success}
        onClose={() => setSuccess("")}
        title={success || undefined}
        message={translations.orderSuccessMessage}
        autoCloseDelay={2800}
        redirectOnClose={true}
      />

      <div className="checkout_container">
        {/* ------------------ Personal Info ------------------ */}
        <h2>{translations.personalInformation}</h2>

        <div className="checkout_personal_info">
          <div className="checkout_personal_info_item">
            <h3>{translations.firstName}</h3>
            <input
              type="text"
              placeholder={translations.firstName}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="checkout_personal_info_item">
            <h3>{translations.lastName}</h3>
            <input
              type="text"
              placeholder={translations.lastName}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="checkout_personal_info_item">
            <h3>{translations.email}</h3>
            <input
              type="email"
              placeholder={translations.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="checkout_personal_info_item">
            <h3>{translations.phone}</h3>
            <input
              type="text"
              placeholder={translations.phone}
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              required
            />
          </div>
        </div>

        <hr />

        {/* ------------------ Delivery Details ------------------ */}
        <h2>{translations.deliveryDetails}</h2>

        <div className="checkout_delivery_info">
          {/* City Field - Dropdown */}
          <div style={{ width: "100%", marginBottom: "1rem" }}>
            <h3>{translations.city}</h3>
            <div className="checkout_personal_info">
              <div className="checkout_personal_info_item">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem 1rem",
                    border: "1px solid rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px",
                  }}
                  required
                >
                  <option value="">{translations.selectCity}</option>
                  {UAE_CITIES.map((cityOption) => (
                    <option key={cityOption.value} value={cityOption.value}>
                      {lang === "ar" ? cityOption.ar : cityOption.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Address Input for Non-Logged-In Users */}
          {!id && (
            <div style={{ width: "100%", marginBottom: "1rem" }}>
              <h3>{translations.deliveryAddress}</h3>
              <div className="checkout_personal_info">
                <div className="checkout_personal_info_item">
                  <textarea
                    placeholder={translations.enterDeliveryAddress}
                    value={writtenAddress}
                    onChange={(e) => setWrittenAddress(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem 1rem",
                      border: "1px solid rgba(0, 0, 0, 0.2)",
                      borderRadius: "8px",
                      minHeight: "100px",
                      resize: "vertical",
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* ------------------ Add New Address (for saving) ------------------ */}
          {id && (
            <div className="add_address_section">
              <h3>{translations.addNewAddress}</h3>

              <div className="add_address_group">
                <input
                  type="text"
                  placeholder={translations.enterAddressToSave}
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />

                <button className="add_address_btn" onClick={HandleAddAddress}>
                  <FiPlus size={22} />
                </button>
              </div>
            </div>
          )}

          {/* ------------------ Address List ------------------ */}
          {id && addresses.length > 0 && (
            <div style={{ width: "100%", marginTop: "1rem" }}>
              <h3>{translations.selectDeliveryAddress}</h3>
              <div className="addresses_list">
                {addresses.map((address, index) => (
                  <div
                    key={index}
                    className="address_card"
                    style={{
                      border:
                        selectedAddressIndex === index
                          ? "2px solid #4caf50"
                          : "1px solid #ddd",
                      background:
                        selectedAddressIndex === index ? "#f3fff5" : "#f8f9fb",
                      cursor: "pointer",
                    }}
                    onClick={() => selectAddress(index)}
                  >
                    <div className="address_left">
                      <div className="address_icon"></div>
                      <p className="address_text">{address}</p>
                    </div>

                    <div className="address_actions">
                      {selectedAddressIndex === index && (
                        <span
                          style={{
                            color: "#4caf50",
                            fontWeight: "bold",
                            marginLeft: "0.5rem",
                          }}
                        >
                          <FaCheck />
                        </span>
                      )}
                      <button
                        className="delete_address_btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAddress(index);
                          if (selectedAddressIndex === index) {
                            setSelectedAddressIndex(null);
                          }
                        }}
                      >
                        <RiDeleteBin6Line size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {id && addresses.length === 0 && (
            <p className="no_address">{translations.noSavedAddresses}</p>
          )}
        </div>

        <hr />

        {/* ------------------ Payment Method (above order summary) ------------------ */}
        <h2>{translations.paymentMethod}</h2>
        <div className="checkout_personal_info">
          <div className="checkout_personal_info_item">
            <h3>{translations.selectPaymentMethod}</h3>
            <select
              value={paymentWay}
              onChange={(e) => setPaymentWay(e.target.value)}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                border: "1px solid rgba(0, 0, 0, 0.2)",
                borderRadius: "8px",
              }}
            >
              <option value="Cash on Delivery">
                {translations.cashOnDelivery}
              </option>
              <option value="Cash by Visa/Mastercard">{translations.cashByVisaMastercard}</option>
              <option value="Cash by transfer">{translations.cashByTransfer}</option>
              <option value="Cash by credit">{translations.cashByCredit}</option>
            </select>
          </div>
        </div>

        {isCardGatewayPayment(paymentWay) && (
          <div style={{ marginTop: "0.75rem" }}>
            <p style={{ margin: 0, fontSize: "0.95rem", color: "#444" }}>
              {translations.cardPaymentHint}
            </p>
            {paymentSessionLoading && (
              <p style={{ margin: "0.5rem 0 0", color: "#666" }}>
                {translations.preparingPaymentForm}
              </p>
            )}
            {paymentSessionError && (
              <p style={{ margin: "0.5rem 0 0", color: "#c62828" }}>
                {paymentSessionError}
              </p>
            )}
          </div>
        )}

        {isCardGatewayPayment(paymentWay) && (
          <div
            className="checkout_gateway_card_box"
            style={{
              marginTop: "1.25rem",
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "12px",
              border: "1px solid rgba(0, 0, 0, 0.12)",
              background: "#fafafa",
            }}
          >
            {checkoutSessionId &&
              !paymentSessionLoading &&
              !gatewayOrderReady && (
                <p
                  style={{
                    margin: "0 0 0.75rem",
                    fontSize: "0.95rem",
                    color: "#b45309",
                    background: "#fffbeb",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "8px",
                  }}
                >
                  {gatewayMissingFieldsMsg || translations.completeFormForGatewayPayment}
                </p>
              )}
            {gatewayOrderReady && (
              <div
                style={{
                  marginBottom: "0.75rem",
                  padding: "0.65rem 0.85rem",
                  borderRadius: "8px",
                  background: "#e8f5e9",
                  color: "#1b5e20",
                  fontSize: "0.9rem",
                }}
              >
                {translations.gatewayOrderReadyPay}
              </div>
            )}
            {checkoutSessionId &&
              paymentReturnUrl &&
              !paymentSessionLoading &&
              gatewayOrderReady && (
                <form
                  key={checkoutSessionId}
                  action={paymentReturnUrl}
                  className="paymentWidgets"
                  data-brands="VISA MASTER AMEX"
                />
              )}
          </div>
        )}

        <hr />

        {/* ------------------ Order Summary ------------------ */}
        <h2>{translations.orderSummary}</h2>
        <div style={{ width: "100%", marginBottom: "2rem" }}>
          <div
            style={{
              background: "#f8f9fb",
              padding: "1.5rem",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <h3>{translations.items}</h3>
              <p>
                {cartItems.length} {translations.itemsPlural}
              </p>
            </div>
            {cartItems.map((item) => (
              <div
                key={item._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                  paddingLeft: "1rem",
                }}
              >
                <p>
                  {item.name} x {item.quantity}
                </p>
                <p>
                  {translations.aed} {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <hr style={{ margin: "1rem 0" }} />

            {/* Order Price (Subtotal) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <p>{translations.orderPrice}</p>
              <p>
                {translations.aed} {subtotal.toFixed(2)}
              </p>
            </div>

            {/* Shipping */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <p>{translations.shipping || "Shipping"}</p>
              <p>
                {translations.aed} {shipping.toFixed(2)}
              </p>
            </div>

            {/* Tax - 5% of (Order Price + Shipping) */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <p>{translations.tax5}</p>
              <p>
                {translations.aed} {tax.toFixed(2)}
              </p>
            </div>

            {/* Discount (if applicable) */}
            {discount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                  color: "#4caf50",
                }}
              >
                <p>{translations.discount}</p>
                <p>
                  - {translations.aed} {discount.toFixed(2)}
                </p>
              </div>
            )}

            <hr style={{ margin: "1rem 0" }} />

            {/* Total Amount */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              <h3>{translations.totalAmount}</h3>
              <p>
                {translations.aed} {totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* ------------------ Submit Button (hidden for card gateway — Pay on widget only) ------------------ */}
        {!isCardGatewayPayment(paymentWay) && (
          <button
            onClick={handleSubmitOrder}
            disabled={loading}
            style={{
              width: "200px",
              padding: "0.6rem 1rem",
              background: loading ? "#ccc" : "rgba(215, 223, 43, 1)",
              color: "black",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "1rem",
              marginBottom: "2rem",
            }}
          >
            {loading ? translations.placingOrder : translations.placeOrder}
          </button>
        )}
      </div>
    </div>
  );
};

export default ClientCheckout;
