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
const CHECKOUT_SAVED_ENTRIES_KEY = "checkoutSavedEntries";

const isCardGatewayPayment = (way) =>
  way === "Cash by Visa/Mastercard" || way === "Cash by credit";

const getAvailableStock = (item) => {
  const rawStock = item?.stock ?? item?.quantityAvailable ?? item?.quantityInStock ?? null;
  if (rawStock === null || rawStock === undefined || rawStock === "") return null;
  const parsed = Number(rawStock);
  if (Number.isNaN(parsed) || parsed < 0) return null;
  return parsed;
};

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
  const [savedEntries, setSavedEntries] = useState([]);
  const [selectedSavedEntryIndex, setSelectedSavedEntryIndex] = useState(null);

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
    const navigationEntries = performance.getEntriesByType("navigation");
    const isReload = navigationEntries[0]?.type === "reload";
    if (isReload) {
      localStorage.removeItem("savedCoupon");
    }
    const handleBeforeUnload = () => {
      localStorage.removeItem("savedCoupon");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Check for token (logged in status)
    const token = localStorage.getItem("sgitoken");
    const userId = token ? getUserIdFromToken() : null;

    setId(userId || "");

    // Load language
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    setTranslations(savedLang === "ar" ? ar : en);

    const savedEntriesRaw = localStorage.getItem(CHECKOUT_SAVED_ENTRIES_KEY);
    if (savedEntriesRaw) {
      try {
        const parsed = JSON.parse(savedEntriesRaw);
        if (Array.isArray(parsed)) {
          setSavedEntries(parsed);
        }
      } catch {
        localStorage.removeItem(CHECKOUT_SAVED_ENTRIES_KEY);
      }
    }

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

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (savedEntries.length === 0) {
      localStorage.removeItem(CHECKOUT_SAVED_ENTRIES_KEY);
      return;
    }
    localStorage.setItem(CHECKOUT_SAVED_ENTRIES_KEY, JSON.stringify(savedEntries));
  }, [savedEntries]);

  const saveCheckoutEntry = (addressValue) => {
    const normalizedAddress = addressValue?.trim();
    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName.trim();
    const normalizedPhone = userPhone.trim();
    const normalizedCity = city.trim();

    if (
      !normalizedFirstName ||
      !normalizedLastName ||
      !normalizedPhone ||
      !normalizedCity ||
      !normalizedAddress
    ) {
      return;
    }

    const option = {
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      email: email.trim(),
      userPhone: normalizedPhone,
      city: normalizedCity,
      address: normalizedAddress,
      label: `${normalizedFirstName} ${normalizedLastName} - ${normalizedCity}`,
    };

    const deduped = savedEntries.filter(
      (item) =>
        !(
          item?.firstName?.toLowerCase() === option.firstName.toLowerCase() &&
          item?.lastName?.toLowerCase() === option.lastName.toLowerCase() &&
          item?.userPhone === option.userPhone &&
          item?.city?.toLowerCase() === option.city.toLowerCase() &&
          item?.address?.toLowerCase() === option.address.toLowerCase()
        )
    );

    const next = [option, ...deduped].slice(0, 10);
    setSavedEntries(next);
    setSelectedSavedEntryIndex(0);
    localStorage.setItem(CHECKOUT_SAVED_ENTRIES_KEY, JSON.stringify(next));
  };

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
      labels: {
        submit: lang === "ar" ? "إضافة ومتابعة" : "Add and continue"
      }
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
    const hasStockIssue = cartItems.some((item) => {
      const availableStock = getAvailableStock(item);
      return availableStock != null && item.quantity > availableStock;
    });
    if (hasStockIssue) return false;

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
      tax,
      shipping,
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
    tax,
    shipping,
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
      const stockIssueItem = cartItems.find((item) => {
        const availableStock = getAvailableStock(item);
        return availableStock != null && item.quantity > availableStock;
      });
      if (stockIssueItem) {
        const availableStock = getAvailableStock(stockIssueItem);
        setGatewayMissingFieldsMsg(
          lang === "ar"
            ? `الكمية المتاحة من ${stockIssueItem.name} هي ${availableStock} فقط`
            : `Only ${availableStock} item(s) available for ${stockIssueItem.name}`
        );
      } else {
        setGatewayMissingFieldsMsg(translations.completeFormForGatewayPayment);
      }
    } else {
      setGatewayMissingFieldsMsg("");
    }
  }, [
    paymentWay,
    checkoutSessionId,
    persistGatewayPendingOrder,
    translations.completeFormForGatewayPayment,
    cartItems,
    lang,
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

    const itemsOverStock = cartItems.filter((item) => {
      const availableStock = getAvailableStock(item);
      return availableStock != null && item.quantity > availableStock;
    });
    if (itemsOverStock.length > 0) {
      const firstItem = itemsOverStock[0];
      const availableStock = getAvailableStock(firstItem);
      const overStockMessage =
        lang === "ar"
          ? `الكمية المتاحة من ${firstItem.name} هي ${availableStock} فقط`
          : `Only ${availableStock} item(s) available for ${firstItem.name}`;
      setError(overStockMessage);
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
      tax,
      shipping,
      city: city.trim(),
      address: deliveryAddress,
      cartItems: formattedCartItems,
    };

    // Cash on Delivery & bank transfer: create order مباشرة
    const result = await CreateOrder(orderData, setError, setLoading, () => {});

    if (result) {
      saveCheckoutEntry(deliveryAddress);
      setSuccess(translations.orderPlacedSuccessfully);
      clearCart();
      localStorage.removeItem("savedCoupon");
    }
  };

  return (
    <div className={`checkout ${lang === "ar" ? "ar-rtl" : ""}`}>
      <h1>{translations.checkout}</h1>

      <SuccessModal
        isOpen={!!success}
        onClose={() => setSuccess("")}
        title={success || undefined}
        message={translations.orderSuccessMessage}
        autoCloseDelay={2800}
        redirectOnClose={true}
      />

      <div className="checkout_container">
        {savedEntries.length > 0 && (
          <div className="checkout_previous_details">
            <h2>{lang === "ar" ? "البيانات السابقة" : "Previous details"}</h2>
            <div className="addresses_list checkout_previous_details_list">
              {savedEntries.map((item, index) => (
                <div
                  key={`${item.firstName}-${item.lastName}-${item.userPhone}-${item.city}-${index}`}
                  className={`address_card checkout_previous_details_card ${
                    selectedSavedEntryIndex === index ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedSavedEntryIndex(index);
                    setFirstName(item.firstName || "");
                    setLastName(item.lastName || "");
                    setEmail(item.email || "");
                    setUserPhone(item.userPhone || "");
                    setCity(item.city || "");
                    if (!id) {
                      setWrittenAddress(item.address || "");
                    } else {
                      const matchedIndex = addresses.findIndex(
                        (address) =>
                          String(address).trim().toLowerCase() ===
                          String(item.address || "").trim().toLowerCase()
                      );
                      if (matchedIndex !== -1) {
                        setSelectedAddressIndex(matchedIndex);
                      }
                    }
                  }}
                >
                  <div className="address_left">
                    <div className="address_icon"></div>
                    <p className="address_text checkout_previous_details_text">
                      {item.firstName} {item.lastName} - {item.userPhone} - {item.city} - {item.address}
                    </p>
                  </div>
                  <div className="address_actions">
                    {selectedSavedEntryIndex === index && (
                      <span style={{ color: "#4caf50", fontWeight: "bold" }}>
                        <FaCheck />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ------------------ Personal Info ------------------ */}
        <h2>{translations.personalInformation}</h2>

        <div className="checkout_personal_info">
          <div className="checkout_personal_info_item">
            <h3>{translations.firstName}</h3>
            <input
              type="text"
              placeholder={translations.firstNamePlaceholder}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="checkout_personal_info_item">
            <h3>{translations.lastName}</h3>
            <input
              type="text"
              placeholder={translations.lastNamePlaceholder}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="checkout_personal_info_item">
            <h3>{translations.email}</h3>
            <input
              type="email"
              placeholder={translations.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="checkout_personal_info_item">
            <h3>{translations.phone}</h3>
            <input
              type="text"
              placeholder={translations.checkoutPhonePlaceholder}
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
        <div className={`payment_options_wrapper ${lang === "ar" ? "ar-rtl" : ""}`}>
          
          {/* Debit / Credit Card Option Card */}
          <div className={`payment_option_container ${paymentWay === "Cash by Visa/Mastercard" ? "selected" : ""}`}>
            <div
              className={`payment_option_row ${paymentWay === "Cash by Visa/Mastercard" ? "active" : ""}`}
              onClick={() => setPaymentWay("Cash by Visa/Mastercard")}
            >
              <div className="payment_option_left">
                <span className={`custom_radio_circle ${paymentWay === "Cash by Visa/Mastercard" ? "checked" : ""}`}></span>
                <span className="payment_option_text">
                  {lang === "ar" ? "بطاقة خصم / ائتمان" : "Debit / Credit Card"}
                </span>
                <span className="card_logos_inline">
                  {/* Visa SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15" width="28" height="18" style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 4px' }}>
                    <rect width="24" height="15" rx="2" fill="#1A1F71"/>
                    <path fill="#FFF" d="M9.8 11.2h-1.1c-.2 0-.4-.1-.5-.3L6.4 6.1H7.7l.9 2.5.5-2.5H10l-1.1 5.1zm4.7 0c0-.8-.7-1.1-1.2-1.3-.4-.2-.5-.3-.5-.4 0-.2.2-.3.5-.3.4 0 .7.1.9.2l.2-1.1c-.3-.1-.6-.2-1-.2-.9 0-1.5.5-1.5 1.2 0 .8.7 1.1 1.2 1.3.4.2.5.3.5.5 0 .2-.2.3-.6.3-.4 0-.8-.1-1-.3l-.2 1.1c.3.1.7.2 1.1.2 1 0 1.6-.4 1.6-1.3zm3.1-5.1h-1c-.3 0-.5.2-.6.4l-1.9 4.7h1.3l.3-.7h1.6l.2.7h1.1l-.9-5.1zm-1.8 3.1l.6-1.5.3 1.5h-.9zM5 6.1L4.1 9.6l-.1-.5C3.8 8.8 3.4 8 2.8 7.6v3.6H4l2-5.1H5z"/>
                    <path fill="#F7B600" d="M2.8 6.1h-.9l.1.5c.7.2 1.4.6 1.9 1.2L3.6 6.1z"/>
                  </svg>
                  {/* Mastercard SVG */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15" width="28" height="18" style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 4px' }}>
                    <rect width="24" height="15" rx="2" fill="#0A0A0A"/>
                    <circle cx="10" cy="7.5" r="4.5" fill="#EB001B"/>
                    <circle cx="14" cy="7.5" r="4.5" fill="#F79E1B" fillOpacity="0.8"/>
                    <path fill="#FF5F00" d="M12 4.4a4.5 4.5 0 0 0 0 6.2 4.5 4.5 0 0 0 0-6.2z"/>
                  </svg>
                </span>
              </div>
            </div>

            {/* Nested CC Widget Form */}
            {isCardGatewayPayment(paymentWay) && (
              <div className="payment_option_expanded_content">
                {paymentSessionLoading && (
                  <p style={{ margin: "0.5rem 1.5rem", color: "#666", fontSize: "0.95rem" }}>
                    {translations.preparingPaymentForm}
                  </p>
                )}
                {paymentSessionError && (
                  <p style={{ margin: "0.5rem 1.5rem", color: "#c62828", fontSize: "0.95rem" }}>
                    {paymentSessionError}
                  </p>
                )}

                <div className="checkout_gateway_card_box">
                  {/* Logo Visa on top right inside the white box */}
                  {checkoutSessionId && !paymentSessionLoading && gatewayOrderReady && (
                    <div className="form_brand_logo_top_right">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 15" width="54" height="34">
                        <path fill="#1A1F71" d="M9.8 11.2h-1.1c-.2 0-.4-.1-.5-.3L6.4 6.1H7.7l.9 2.5.5-2.5H10l-1.1 5.1zm4.7 0c0-.8-.7-1.1-1.2-1.3-.4-.2-.5-.3-.5-.4 0-.2.2-.3.5-.3.4 0 .7.1.9.2l.2-1.1c-.3-.1-.6-.2-1-.2-.9 0-1.5.5-1.5 1.2 0 .8.7 1.1 1.2 1.3.4.2.5.3.5.5 0 .2-.2.3-.6.3-.4 0-.8-.1-1-.3l-.2 1.1c.3.1.7.2 1.1.2 1 0 1.6-.4 1.6-1.3zm3.1-5.1h-1c-.3 0-.5.2-.6.4l-1.9 4.7h1.3l.3-.7h1.6l.2.7h1.1l-.9-5.1zm-1.8 3.1l.6-1.5.3 1.5h-.9zM5 6.1L4.1 9.6l-.1-.5C3.8 8.8 3.4 8 2.8 7.6v3.6H4l2-5.1H5z"/>
                        <path fill="#F7B600" d="M2.8 6.1h-.9l.1.5c.7.2 1.4.6 1.9 1.2L3.6 6.1z"/>
                      </svg>
                    </div>
                  )}

                  {checkoutSessionId && !paymentSessionLoading && !gatewayOrderReady && (
                    <div className="gateway_status_msg pending">
                      {gatewayMissingFieldsMsg || translations.completeFormForGatewayPayment}
                    </div>
                  )}
                  {gatewayOrderReady && (
                    <div className="gateway_status_msg ready">
                      {translations.gatewayOrderReadyPay || "Your order is saved. Complete payment with Place Order below."}
                    </div>
                  )}

                  {checkoutSessionId && paymentReturnUrl && !paymentSessionLoading && gatewayOrderReady && (
                    <form
                      key={checkoutSessionId}
                      action={paymentReturnUrl}
                      className="paymentWidgets"
                      data-brands="VISA MASTER"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cash On Delivery Option Card */}
          <div className={`payment_option_container ${paymentWay === "Cash on Delivery" ? "selected" : ""}`}>
            <div
              className={`payment_option_row ${paymentWay === "Cash on Delivery" ? "active" : ""}`}
              onClick={() => setPaymentWay("Cash on Delivery")}
            >
              <div className="payment_option_left">
                <span className={`custom_radio_circle ${paymentWay === "Cash on Delivery" ? "checked" : ""}`}></span>
                <span className="payment_option_text">
                  {lang === "ar" ? "الدفع عند الاستلام" : "Cash On Delivery"}
                </span>
              </div>
            </div>
          </div>

        </div>

        <hr />

        {/* ------------------ Order Summary ------------------ */}
        <h2>{translations.orderSummary}</h2>
        <div className="checkout_order_summary">
          <div className="checkout_summary_card">
            <div className="checkout_summary_row">
              <h3>{translations.items}</h3>
              <p>
                {cartItems.length} {translations.itemsPlural}
              </p>
            </div>
            {cartItems.map((item) => (
              <div
                key={`${item._id}-${item.isBoxPricing ? "box" : "unit"}`}
                className="checkout_summary_item"
              >
                <p className="checkout_summary_item_name">
                  {item.name} ({item.isBoxPricing ? translations.box : translations.unit}) x {item.quantity}
                </p>
                <p className="checkout_summary_item_price">
                  {translations.aed} {(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}

            <hr className="checkout_summary_divider" />

            <div className="checkout_summary_row">
              <p>{translations.orderPrice}</p>
              <p>
                {translations.aed} {subtotal.toFixed(2)}
              </p>
            </div>

            <div className="checkout_summary_row">
              <p>{translations.shipping || "Shipping"}</p>
              <p>
                {translations.aed} {shipping.toFixed(2)}
              </p>
            </div>

            <div className="checkout_summary_row">
              <p>{translations.tax5}</p>
              <p>
                {translations.aed} {tax.toFixed(2)}
              </p>
            </div>

            {discount > 0 && (
              <div className="checkout_summary_row checkout_summary_row_discount">
                <p>{translations.discount}</p>
                <p>
                  - {translations.aed} {discount.toFixed(2)}
                </p>
              </div>
            )}

            <hr className="checkout_summary_divider" />

            <div className="checkout_summary_row checkout_summary_row_total">
              <h3>{translations.totalAmount}</h3>
              <p>
                {translations.aed} {totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="checkout_bottom_row">
          {error && (
            <div className="checkout_error" role="alert">
              *{error}*
            </div>
          )}

          {/* ------------------ Submit Button (hidden for card gateway — Pay on widget only) ------------------ */}
          {!isCardGatewayPayment(paymentWay) && (
            <button
              className="checkout_place_order_btn"
              onClick={handleSubmitOrder}
              disabled={loading}
            >
              {loading ? translations.placingOrder : translations.placeOrder}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientCheckout;
