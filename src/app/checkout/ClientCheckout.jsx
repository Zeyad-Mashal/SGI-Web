"use client";
import React, { useEffect, useState } from "react";
import "./checkout.css";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import GetAddress from "@/API/Address/GetAddress";
import AddAddress from "@/API/Address/AddAddress";
import CreateOrder from "@/API/Orders/CreateOrder";
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
    const totalBeforeDiscount = calculatedSubtotal + calculatedShipping + calculatedTax; // Subtotal + Shipping + Tax

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

  const handleSubmitOrder = async () => {
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

    // Format order data
    const orderData = {
      paymentWay: paymentWay,
      userName: `${firstName.trim()} ${lastName.trim()}`,
      userPhone: userPhone.trim(),
      email: email.trim() || undefined,
      totalAmount: totalAmount,
      city: city.trim(), // City value from dropdown
      address: deliveryAddress,
      cartItems: formattedCartItems,
    };

    // Create order (works without login)
    const result = await CreateOrder(orderData, setError, setLoading, () => {});

    if (result) {
      setSuccess(translations.orderPlacedSuccessfully);
      clearCart();
      localStorage.removeItem("savedCoupon");
      // المودال يغلق تلقائياً بعد الأنيميشن ثم يوجه للهوم
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

        {/* ------------------ Payment Method ------------------ */}
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
              <option value="Cash on Delivery">{translations.cashOnDelivery}</option>
              <option value="Credit Card">{translations.creditCard}</option>
              <option value="Debit Card">{translations.debitCard}</option>
            </select>
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
                  <option value="">
                    {translations.selectCity}
                  </option>
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
            <p className="no_address">
              {translations.noSavedAddresses}
            </p>
          )}
        </div>

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
              <p>{cartItems.length} {translations.itemsPlural}</p>
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
                <p>{translations.aed} {(item.price * item.quantity).toFixed(2)}</p>
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
              <p>{translations.aed} {subtotal.toFixed(2)}</p>
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
              <p>{translations.aed} {shipping.toFixed(2)}</p>
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
              <p>{translations.aed} {tax.toFixed(2)}</p>
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
                <p>- {translations.aed} {discount.toFixed(2)}</p>
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
              <p>{translations.aed} {totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* ------------------ Submit Button ------------------ */}
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
            marginBottom: "2rem",
          }}
        >
          {loading ? translations.placingOrder : translations.placeOrder}
        </button>
      </div>
    </div>
  );
};

export default ClientCheckout;
