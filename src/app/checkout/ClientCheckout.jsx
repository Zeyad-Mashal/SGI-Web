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

  // Payment
  const [paymentWay, setPaymentWay] = useState("Cash on Delivery");

  // Address Management
  const [newAddress, setNewAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [id, setId] = useState("");

  // Cart and Order
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // State Management
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setId(userId || "");

    // Load cart items
    const cart = getCart();
    setCartItems(cart);

    // Calculate total amount
    const subtotal = getCartTotal();
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    // Check for saved coupon discount
    const savedCoupon = localStorage.getItem("savedCoupon");
    if (savedCoupon) {
      const { discount } = JSON.parse(savedCoupon);
      const discountAmount = total * (discount / 100);
      setTotalAmount(total - discountAmount);
    } else {
      setTotalAmount(total);
    }

    // Load addresses if user is logged in
    if (userId) {
      getAddresses();
    }
  }, []);

  const getAddresses = () => {
    GetAddress(setAddresses, setError, setLoading);
  };

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
      setError("Please enter your full name");
      return;
    }
    if (!userPhone.trim()) {
      setError("Please enter your phone number");
      return;
    }
    if (!city.trim()) {
      setError("Please enter city");
      return;
    }
    if (selectedAddressIndex === null || !addresses[selectedAddressIndex]) {
      setError("Please select a delivery address");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty");
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
    const selectedAddress = addresses[selectedAddressIndex];
    const orderData = {
      paymentWay: paymentWay,
      userName: `${firstName.trim()} ${lastName.trim()}`,
      userPhone: userPhone.trim(),
      totalAmount: totalAmount,
      city: city.trim(),
      address: selectedAddress,
      cartItems: formattedCartItems,
    };

    // Create order
    const result = await CreateOrder(orderData, setError, setLoading, () => {});

    if (result) {
      setSuccess("Order placed successfully!");
      // Clear cart
      clearCart();
      // Clear saved coupon
      localStorage.removeItem("savedCoupon");
      // Redirect to home or order confirmation page
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  return (
    <div className="checkout">
      <h1>Checkout</h1>

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

      {success && (
        <div
          style={{
            color: "green",
            marginBottom: "1rem",
            padding: "0.5rem",
            background: "#e8f5e9",
            borderRadius: "8px",
          }}
        >
          {success}
        </div>
      )}

      <div className="checkout_container">
        {/* ------------------ Personal Info ------------------ */}
        <h2>Personal information:</h2>

        <div className="checkout_personal_info">
          <div className="checkout_personal_info_item">
            <h3>First Name:</h3>
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="checkout_personal_info_item">
            <h3>Last Name:</h3>
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="checkout_personal_info_item">
            <h3>Email:</h3>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="checkout_personal_info_item">
            <h3>Phone:</h3>
            <input
              type="text"
              placeholder="Phone"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              required
            />
          </div>
        </div>

        <hr />

        {/* ------------------ Payment Method ------------------ */}
        <h2>Payment Method:</h2>
        <div className="checkout_personal_info">
          <div className="checkout_personal_info_item">
            <h3>Select Payment Method:</h3>
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
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
            </select>
          </div>
        </div>

        <hr />

        {/* ------------------ Delivery Details ------------------ */}
        <h2>Delivery Details:</h2>

        <div className="checkout_delivery_info">
          {/* City Field */}
          <div style={{ width: "100%", marginBottom: "1rem" }}>
            <h3>City:</h3>
            <div className="checkout_personal_info">
              <div className="checkout_personal_info_item">
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* ------------------ Add New Address (for saving) ------------------ */}
          {id && (
            <div className="add_address_section">
              <h3>Add New Address:</h3>

              <div className="add_address_group">
                <input
                  type="text"
                  placeholder="Enter Address to Save (e.g., ElSeyof, 45 Kastania Street)"
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
              <h3>Select Delivery Address:</h3>
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
              No saved addresses. Please add an address above to continue.
            </p>
          )}

          {!id && (
            <p className="no_address" style={{ color: "red" }}>
              Please log in to select a delivery address.
            </p>
          )}
        </div>

        <hr />

        {/* ------------------ Order Summary ------------------ */}
        <h2>Order Summary:</h2>
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
              <h3>Items:</h3>
              <p>{cartItems.length} item(s)</p>
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
                <p>AED {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <hr style={{ margin: "1rem 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              <h3>Total Amount:</h3>
              <p>AED {totalAmount.toFixed(2)}</p>
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
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default ClientCheckout;
