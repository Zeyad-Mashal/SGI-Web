"use client";
import React from "react";
import { useState, useEffect } from "react";
import "./profile.css";
import Image from "next/image";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { MdOutlineDateRange } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { MdOutlineAttachMoney } from "react-icons/md";
import { RiFilePaper2Line } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";
import GetRecentOrders from "@/API/GetRecentOrders/GetRecentOrders";
import GetAddress from "@/API/Address/GetAddress";
import AddAddress from "@/API/Address/AddAddress";
import CreateOrder from "@/API/Orders/CreateOrder";
import CreatePO from "@/API/PO/CreatePO";
import { useToast } from "@/context/ToastContext";
import Trader from "@/API/Trader/Trader";
import en from "../../translation/en.json";
import ar from "../../translation/ar.json";

const ClientProfile = () => {
  const { showToast } = useToast();
  const [lang, setLang] = useState("en");
  const [translations, setTranslations] = useState(en);
  const [recentOrders, setRecentOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAllOrdersModalOpen, setIsAllOrdersModalOpen] = useState(false);

  // Reorder Modal State
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false);
  const [reorderItems, setReorderItems] = useState([]);
  const [reorderCity, setReorderCity] = useState("");
  const [reorderSelectedAddressIndex, setReorderSelectedAddressIndex] =
    useState(null);
  const [reorderAddresses, setReorderAddresses] = useState([]);
  const [reorderNewAddress, setReorderNewAddress] = useState("");
  const [reorderPaymentWay, setReorderPaymentWay] =
    useState("Cash on Delivery");
  const [reorderTotalAmount, setReorderTotalAmount] = useState(0);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [reorderError, setReorderError] = useState("");
  const [reorderSuccess, setReorderSuccess] = useState("");
  const [userId, setUserId] = useState("");
  const [traderDetails, setTraderDetails] = useState(null);
  const [traderStats, setTraderStats] = useState(null);
  useEffect(() => {
    // Get language from localStorage
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    setTranslations(savedLang === "ar" ? ar : en);
    
    const id = localStorage.getItem("userId");
    setUserId(id || "");
    if (id) {
      GetRecentOrders(setRecentOrders, setError, setLoading);
      getAddresses();
      getPOAddresses();
    }
    getTraderDetails();

    // Listen for language changes
    const handleStorageChange = () => {
      const newLang = localStorage.getItem("lang") || "en";
      setLang(newLang);
      setTranslations(newLang === "ar" ? ar : en);
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also check periodically for language changes
    const interval = setInterval(() => {
      const currentLang = localStorage.getItem("lang") || "en";
      if (currentLang !== lang) {
        setLang(currentLang);
        setTranslations(currentLang === "ar" ? ar : en);
      }
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [lang]);
  const getTraderDetails = () => {
    Trader(setTraderDetails, setTraderStats, setError, setLoading);
  };

  const getAddresses = () => {
    GetAddress(setReorderAddresses, setReorderError, setReorderLoading);
  };

  const getPOAddresses = () => {
    GetAddress(setPoAddresses, setPoError, setPoLoading);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "success":
        return "#4caf50";
      case "new":
        return "#2196f3";
      case "canceled":
        return "#f44336";
      case "processing":
        return "#ff9800";
      default:
        return "#757575";
    }
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleReorder = (order) => {
    // Check if it's a purchase order
    if (order.isPurchase) {
      handlePORorder(order);
      return;
    }

    // Initialize reorder items with quantities
    const items = (order.cartItems || []).map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));

    setReorderItems(items);
    setReorderCity(order.city || "");
    setReorderSelectedAddressIndex(null);
    setReorderPaymentWay(order.paymentWay || "Cash on Delivery");
    calculateReorderTotal(items);
    setIsReorderModalOpen(true);
  };

  const handlePORorder = async (order) => {
    // Close the order details modal first
    closeModal();

    // Create a link object from the order image
    if (order.orderImg) {
      const linkObj = {
        type: order.orderImg.endsWith(".pdf")
          ? "application/pdf"
          : "image/link",
        url: order.orderImg,
        isLink: true,
      };

      // Set the current PO item
      setCurrentPOItem(linkObj);

      // Pre-fill form with order data
      setPoUserName(order.userName || "");
      setPoPhone(order.userPhone || "");
      setPoEmail(order.email || "");
      setPoCity(order.city || "");
      setPoPaymentWay(order.paymentWay || "Cash on Delivery");
      setPoTotalAmount(order.totalAmount?.toString() || "");

      // Load addresses if needed
      if (userId && poAddresses.length === 0) {
        getPOAddresses();
      }

      // Try to find and select the address if it exists
      if (order.address && poAddresses.length > 0) {
        const addressIndex = poAddresses.findIndex(
          (addr) => addr === order.address
        );
        if (addressIndex !== -1) {
          setPoSelectedAddressIndex(addressIndex);
        }
      }

      // Open PO modal
      setIsPOModalOpen(true);
    } else {
      showToast(translations.purchaseOrderImageNotFound, "error");
    }
  };

  const closeReorderModal = () => {
    setIsReorderModalOpen(false);
    setReorderItems([]);
    setReorderCity("");
    setReorderSelectedAddressIndex(null);
    setReorderError("");
    setReorderSuccess("");
  };

  const updateQuantity = (index, newQuantity) => {
    const updatedItems = [...reorderItems];
    const quantity = Math.max(1, parseInt(newQuantity) || 1);
    updatedItems[index].quantity = quantity;
    setReorderItems(updatedItems);
    calculateReorderTotal(updatedItems);
  };

  const calculateReorderTotal = (items) => {
    const subtotal = items.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    setReorderTotalAmount(total);
  };

  const selectReorderAddress = (index) => {
    setReorderSelectedAddressIndex(index);
  };

  const handleAddReorderAddress = () => {
    if (reorderNewAddress.trim() === "") return;

    const updatedAddresses = [...reorderAddresses, reorderNewAddress];
    const data = {
      addresses: updatedAddresses,
      userId: userId,
    };
    AddAddress(data, setReorderError, setReorderLoading, getAddresses);
    setReorderNewAddress("");
  };

  const handleSubmitReorder = async () => {
    // Validation
    if (!reorderCity.trim()) {
      setReorderError(translations.pleaseEnterCity);
      return;
    }
    if (
      reorderSelectedAddressIndex === null ||
      !reorderAddresses[reorderSelectedAddressIndex]
    ) {
      setReorderError(translations.pleaseSelectDeliveryAddress);
      return;
    }
    if (reorderItems.length === 0) {
      setReorderError(translations.noItemsToReorder);
      return;
    }

    setReorderError("");
    setReorderSuccess("");

    // Get user info from selected order or localStorage
    const userName = selectedOrder?.userName || "";
    const userPhone = selectedOrder?.userPhone || "";

    // Format cart items for order
    const formattedCartItems = reorderItems.map((item) => ({
      productId: item.productId?._id || item.productId || null,
      quantity: item.quantity,
      sku: item.sku || item.productId?._id || "",
      name: item.name,
      price: item.price,
    }));

    // Format order data
    const selectedAddress = reorderAddresses[reorderSelectedAddressIndex];
    const orderData = {
      paymentWay: reorderPaymentWay,
      userName: userName,
      userPhone: userPhone,
      totalAmount: reorderTotalAmount,
      city: reorderCity.trim(),
      address: selectedAddress,
      cartItems: formattedCartItems,
    };

    // Create order
    const result = await CreateOrder(
      orderData,
      setReorderError,
      setReorderLoading,
      () => {}
    );

    if (result) {
      setReorderSuccess(translations.orderPlacedSuccessfully);
      // Refresh orders list
      if (userId) {
        GetRecentOrders(setRecentOrders, setError, setLoading);
      }
      // Close modal after delay
      setTimeout(() => {
        closeReorderModal();
        closeModal();
      }, 2000);
    }
  };

  // Purchase Order Upload State
  const [purchaseOrderImages, setPurchaseOrderImages] = useState([]); // files or links
  const [purchaseOrderLink, setPurchaseOrderLink] = useState(""); // optional link input

  // Purchase Order Modal State
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);
  const [currentPOItem, setCurrentPOItem] = useState(null); // The file or link being processed
  const [poUserName, setPoUserName] = useState("");
  const [poPhone, setPoPhone] = useState("");
  const [poEmail, setPoEmail] = useState("");
  const [poCity, setPoCity] = useState("");
  const [poSelectedAddressIndex, setPoSelectedAddressIndex] = useState(null);
  const [poAddresses, setPoAddresses] = useState([]);
  const [poNewAddress, setPoNewAddress] = useState("");
  const [poPaymentWay, setPoPaymentWay] = useState("Cash on Delivery");
  const [poTotalAmount, setPoTotalAmount] = useState("");
  const [poLoading, setPoLoading] = useState(false);
  const [poError, setPoError] = useState("");
  const [poSuccess, setPoSuccess] = useState("");

  const handleFileUpload = (file) => {
    if (!file) return;

    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type)) {
      alert(translations.invalidFileType);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(translations.fileTooLarge);
      return;
    }

    setPurchaseOrderImages((prev) => [...prev, file]);
    // Open PO modal for this file
    setCurrentPOItem(file);
    setIsPOModalOpen(true);
    // Load addresses if not already loaded
    if (userId && poAddresses.length === 0) {
      getPOAddresses();
    }
  };

  const handleLinkAdd = () => {
    if (purchaseOrderLink.trim() === "") return;

    // Check if link already exists
    const linkExists = purchaseOrderImages.some(
      (item) => item.isLink && item.url === purchaseOrderLink.trim()
    );

    if (linkExists) {
      alert(translations.linkAlreadyAdded);
      setPurchaseOrderLink("");
      return;
    }

    // Create link object for preview
    const linkObj = {
      type: purchaseOrderLink.trim().endsWith(".pdf")
        ? "application/pdf"
        : "image/link",
      url: purchaseOrderLink.trim(),
      isLink: true,
    };

    setPurchaseOrderImages((prev) => [...prev, linkObj]);
    setPurchaseOrderLink(""); // Clear input after adding
    // Open PO modal for this link
    setCurrentPOItem(linkObj);
    setIsPOModalOpen(true);
    // Load addresses if not already loaded
    if (userId && poAddresses.length === 0) {
      getPOAddresses();
    }
  };

  const removePurchaseOrderItem = (index) => {
    setPurchaseOrderImages((prev) => prev.filter((_, i) => i !== index));
  };

  const closePOModal = () => {
    setIsPOModalOpen(false);
    setCurrentPOItem(null);
    setPoUserName("");
    setPoPhone("");
    setPoEmail("");
    setPoCity("");
    setPoSelectedAddressIndex(null);
    setPoNewAddress("");
    setPoPaymentWay("Cash on Delivery");
    setPoTotalAmount("");
    setPoError("");
    setPoSuccess("");
  };

  const selectPOAddress = (index) => {
    setPoSelectedAddressIndex(index);
  };

  const handleAddPOAddress = () => {
    if (poNewAddress.trim() === "") return;

    const updatedAddresses = [...poAddresses, poNewAddress];
    const data = {
      addresses: updatedAddresses,
      userId: userId,
    };
    AddAddress(data, setPoError, setPoLoading, getPOAddresses);
    setPoNewAddress("");
  };

  const handleSubmitPO = async () => {
    // Validation
    if (!poUserName.trim()) {
      setPoError(translations.pleaseEnterYourName);
      return;
    }
    if (!poPhone.trim()) {
      setPoError(translations.pleaseEnterYourPhoneNumber);
      return;
    }
    if (!poEmail.trim()) {
      setPoError(translations.pleaseEnterYourEmail);
      return;
    }
    if (!poCity.trim()) {
      setPoError(translations.pleaseEnterCity);
      return;
    }
    if (
      poSelectedAddressIndex === null ||
      !poAddresses[poSelectedAddressIndex]
    ) {
      setPoError(translations.pleaseSelectDeliveryAddress);
      return;
    }
    if (!currentPOItem) {
      setPoError(translations.noPurchaseOrderItemSelected);
      return;
    }
    if (!poTotalAmount || parseFloat(poTotalAmount) <= 0) {
      setPoError(translations.pleaseEnterValidTotalAmount);
      return;
    }

    setPoError("");
    setPoSuccess("");
    setPoLoading(true);

    try {
      // Create FormData
      const formData = new FormData();

      // Add image (file or link)
      if (currentPOItem.isLink) {
        // For links, we'll send the URL as a string
        // The backend might need to handle this differently
        formData.append("image", currentPOItem.url);
      } else {
        // For files, append the file
        formData.append("image", currentPOItem);
      }

      // Add other form data
      formData.append("userName", poUserName.trim());
      formData.append("userPhone", poPhone.trim());
      formData.append("email", poEmail.trim());
      formData.append("city", poCity.trim());
      formData.append("address", poAddresses[poSelectedAddressIndex]);
      formData.append("paymentWay", poPaymentWay);
      formData.append("totalAmount", parseFloat(poTotalAmount));

      // Call CreatePO API
      const result = await CreatePO(formData, setPoError, setPoLoading);

      // If result is returned, it means the API call was successful
      if (result !== undefined) {
        // Remove the processed item from the list
        const itemIndex = purchaseOrderImages.findIndex(
          (item) =>
            (item.isLink && item.url === currentPOItem.url) ||
            (!item.isLink && item === currentPOItem)
        );
        if (itemIndex !== -1) {
          setPurchaseOrderImages((prev) =>
            prev.filter((_, i) => i !== itemIndex)
          );
        }
        // Close modal immediately
        closePOModal();
        // Show success toast
        showToast(translations.purchaseOrderSubmittedSuccessfully, "success");
        // Refresh orders list
        if (userId) {
          GetRecentOrders(setRecentOrders, setError, setLoading);
        }
      }
    } catch (error) {
      setPoError(translations.errorOccurredSubmittingPO);
      setPoLoading(false);
    }
  };

  return (
    <div className="profile">
      <div className="profile_container">
        <div className="profile_info">
          <div className="profile_info_top">
            <Image
              src={"/images/avatar.jpg"}
              alt="profile pic"
              loading="lazy"
              width={120}
              height={120}
            />
            <div className="profile_info_content">
              <div className="profile_title">
                <h1>{traderDetails?.name}</h1>
                {/* <button>
                  <FaRegEdit />
                  Edit Profile
                </button> */}
              </div>
              <p>{traderDetails?.priceTier}</p>
              <div className="profile_contact">
                <span>
                  <MdOutlineMailOutline />
                  {traderDetails?.email}
                </span>
                <span>
                  <FiPhone />
                  {traderDetails?.phone}
                </span>
                <span>
                  <MdOutlineDateRange />
                  {traderDetails?.registeredAt}
                </span>
              </div>
            </div>
          </div>
          <div className="profile_info_bottom">
            <div className="profile_bottom_item">
              <BsBoxSeam />
              <div className="bottom_item_content">
                <h3>{traderStats?.totalOrders}</h3>
                <p>{translations.totalOrders}</p>
              </div>
            </div>
            <div className="profile_bottom_item">
              <MdOutlineAttachMoney />

              <div className="bottom_item_content">
                <h3>{traderStats?.totalPaid.toFixed(0)} {translations.aed}</h3>
                <p>{translations.totalSpent}</p>
              </div>
            </div>
            {/* <div className="profile_bottom_item">
              <BsBoxSeam />
              <div className="bottom_item_content">
                <h3>25%</h3>
                <p>Active Savings</p>
              </div>
            </div> */}
          </div>
        </div>

        <div className="RecentOrders">
          <div className="RecentOrders_title">
            <h2>
              <RiFilePaper2Line />
              {translations.recentOrders}
            </h2>
            <button
              onClick={() => setIsAllOrdersModalOpen(true)}
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "inherit",
              }}
            >
              {translations.viewAll}
            </button>
          </div>

          {/* Purchase Order Upload Section */}
          <div className="purchase_order_section">
            <h3>{translations.uploadPurchaseOrder}</h3>
            <p>{translations.selectDocumentToComplete}</p>

            <div
              className="upload_box"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFileUpload(file);
              }}
            >
              <div className="upload_content">
                <span className="upload_icon">⤴️</span>
                <p>{translations.selectFileOrDragDrop}</p>
                <small>{translations.jpgPngPdfMaxSize}</small>
                <label className="upload_button">
                  {translations.selectFile}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files[0])
                        handleFileUpload(e.target.files[0]);
                    }}
                  />
                </label>
              </div>
            </div>

            {/* Link input */}
            <div className="link_input_box">
              <input
                type="text"
                placeholder={translations.orPastePurchaseOrderLink}
                value={purchaseOrderLink}
                onChange={(e) => setPurchaseOrderLink(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleLinkAdd();
                  }
                }}
              />
              <button
                className="add_link_btn"
                onClick={handleLinkAdd}
                disabled={!purchaseOrderLink.trim()}
              >
                {translations.addLink}
              </button>
            </div>

            {/* IMAGE PREVIEW */}
            {purchaseOrderImages.some((item) => !item.isLink) && (
              <div className="uploaded_images_container">
                {purchaseOrderImages.map((file, index) =>
                  !file.isLink ? (
                    <div className="uploaded_image_card" key={index}>
                      {file.type.startsWith("image") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          className="uploaded_preview"
                          alt="upload"
                        />
                      ) : (
                        <div className="pdf_preview">
                          <span>📄 PDF</span>
                          <small>{file.name}</small>
                        </div>
                      )}

                      <button
                        className="delete_image_btn"
                        onClick={() => removePurchaseOrderItem(index)}
                      >
                        ✖
                      </button>
                    </div>
                  ) : null
                )}
              </div>
            )}

            {/* LINKS LIST PREVIEW */}
            {purchaseOrderImages.some((item) => item.isLink) && (
              <div className="uploaded_links_list">
                <h4>{translations.uploadedLinks}</h4>
                <ul>
                  {purchaseOrderImages.map((item, index) =>
                    item.isLink ? (
                      <li key={index} className="uploaded_link_item">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          🔗 {item.url}
                        </a>
                        <button
                          className="delete_link_btn"
                          onClick={() => removePurchaseOrderItem(index)}
                        >
                          ✖
                        </button>
                      </li>
                    ) : null
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="RecentOrders_list">
            {loading ? (
              <p>{translations.loadingOrders}</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : recentOrders.length === 0 ? (
              <p>{translations.noRecentOrders}</p>
            ) : (
              recentOrders.slice(0, 5).map((order, index) => {
                const itemCount = order.cartItems?.length || 0;
                const orderDate = formatDate(order.orderDate);
                return (
                  <div
                    key={order._id || index}
                    className="RecentOrders_item"
                    onClick={() => handleOrderClick(order)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="RecentOrders_item_left">
                      <BsBoxSeam />
                      <div>
                        <h3>
                          {order.order_id
                            ? `ORD-${order.order_id}`
                            : `Order #${index + 1}`}
                        </h3>
                        <p>
                          {orderDate} • {itemCount} {itemCount !== 1 ? translations.itemsPlural : translations.item}
                        </p>
                        <span
                          className="order_status_badge"
                          style={{
                            backgroundColor:
                              getStatusColor(order.orderStatus) + "20",
                            color: getStatusColor(order.orderStatus),
                            padding: "4px 8px",
                            borderRadius: "4px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            marginTop: "4px",
                            display: "inline-block",
                          }}
                        >
                          {order.orderStatus || translations.new}
                        </span>
                      </div>
                    </div>
                    <div className="RecentOrders_item_right">
                      <h3>{translations.aed} {order.totalAmount?.toFixed(2) || "0.00"}</h3>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {/* <div className="Information">
          <h2>
            <RiFilePaper2Line />
            Business Information
          </h2>
          <div className="Information_list">
            <div className="Information_item">
              <h3>Company Name</h3>
              <p>Premium Cleaning Solution inc.</p>
            </div>
            <div className="Information_item">
              <h3>Company Name</h3>
              <p>Premium Cleaning Solution inc.</p>
            </div>
            <div className="Information_item">
              <h3>Company Name</h3>
              <p>Premium Cleaning Solution inc.</p>
            </div>
            <div className="Information_item">
              <h3>Company Name</h3>
              <p>Premium Cleaning Solution inc.</p>
            </div>
          </div>
        </div> */}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="order_modal_overlay" onClick={closeModal}>
          <div
            className="order_modal_content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="order_modal_header">
              <h2>
                {translations.orderDetails} -{" "}
                {selectedOrder.order_id
                  ? `ORD-${selectedOrder.order_id}`
                  : translations.order}
              </h2>
              <button className="close_modal_btn" onClick={closeModal}>
                <IoClose size={24} />
              </button>
            </div>

            <div className="order_modal_body">
              {/* Order Info Section */}
              <div className="order_info_section">
                <div className="order_info_item">
                  <FaCalendarAlt />
                  <div>
                    <p className="info_label">{translations.orderDate}</p>
                    <p className="info_value">
                      {formatDateTime(selectedOrder.orderDate)}
                    </p>
                  </div>
                </div>
                <div className="order_info_item">
                  <div
                    className="status_badge_large"
                    style={{
                      backgroundColor:
                        getStatusColor(selectedOrder.orderStatus) + "20",
                      color: getStatusColor(selectedOrder.orderStatus),
                    }}
                  >
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: getStatusColor(
                          selectedOrder.orderStatus
                        ),
                        marginRight: "8px",
                      }}
                    ></span>
                    {selectedOrder.orderStatus || translations.new}
                  </div>
                </div>
                <div className="order_info_item">
                  <FaCreditCard />
                  <div>
                    <p className="info_label">{translations.paymentMethod}</p>
                    <p className="info_value">
                      {selectedOrder.paymentWay || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="order_info_item">
                  <MdOutlineAttachMoney />
                  <div>
                    <p className="info_label">{translations.totalAmount}</p>
                    <p className="info_value" style={{ fontWeight: "bold" }}>
                      {translations.aed} {selectedOrder.totalAmount?.toFixed(2) || "0.00"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info Section */}
              <div className="order_section">
                <h3>{translations.customerInformation}</h3>
                <div className="order_details_grid">
                  <div className="detail_item">
                    <p className="detail_label">{translations.name}</p>
                    <p className="detail_value">
                      {selectedOrder.userName || "N/A"}
                    </p>
                  </div>
                  <div className="detail_item">
                    <p className="detail_label">{translations.phone}</p>
                    <p className="detail_value">
                      {selectedOrder.userPhone || "N/A"}
                    </p>
                  </div>
                  <div className="detail_item">
                    <p className="detail_label">{translations.city}</p>
                    <p className="detail_value">
                      {selectedOrder.city || "N/A"}
                    </p>
                  </div>
                  <div className="detail_item full_width">
                    <p className="detail_label">
                      <FaMapMarkerAlt style={{ marginRight: "8px" }} />
                      {translations.address}
                    </p>
                    <p className="detail_value">
                      {selectedOrder.address ||
                        (selectedOrder.neighborhood && selectedOrder.street
                          ? `${selectedOrder.neighborhood}, ${selectedOrder.street}`
                          : "N/A")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              {selectedOrder.cartItems &&
                selectedOrder.cartItems.length > 0 && (
                  <div className="order_section">
                    <h3>
                      {translations.products} ({selectedOrder.cartItems.length} {selectedOrder.cartItems.length !== 1 ? translations.itemsPlural : translations.item})
                    </h3>
                    <div className="products_list">
                      {selectedOrder.cartItems.map((item, idx) => (
                        <div key={item._id || idx} className="product_card">
                          <div className="product_image_container">
                            {item.productId?.picUrls?.[0] ? (
                              <Image
                                src={item.productId.picUrls[0]}
                                alt={item.name || "Product"}
                                width={100}
                                height={100}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            ) : selectedOrder.orderImg ? (
                              <Image
                                src={selectedOrder.orderImg}
                                alt="Order"
                                width={100}
                                height={100}
                                style={{
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            ) : (
                              <div className="product_placeholder">
                                <BsBoxSeam size={40} />
                              </div>
                            )}
                          </div>
                          <div className="product_info">
                            <h4>{item.name || translations.product}</h4>
                            <div className="product_details">
                              <p>
                                <span className="detail_label">{translations.sku}</span>{" "}
                                {item.sku || "N/A"}
                              </p>
                              <p>
                                <span className="detail_label">{translations.quantity}:</span>{" "}
                                {item.quantity || 1}
                              </p>
                              <p>
                                <span className="detail_label">{translations.price}:</span> {translations.aed}{" "}
                                {item.price?.toFixed(2) || "0.00"}
                              </p>
                              <p className="product_total">
                                <span className="detail_label">{translations.total}:</span>{" "}
                                <strong>
                                  {translations.aed}{" "}
                                  {(
                                    (item.price || 0) * (item.quantity || 1)
                                  ).toFixed(2)}
                                </strong>
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Purchase Order Image */}
              {selectedOrder.isPurchase && selectedOrder.orderImg && (
                <div className="order_section">
                  <h3>Purchase Receipt</h3>
                  <div className="order_image_container">
                    <Image
                      src={selectedOrder.orderImg}
                      alt="Purchase Receipt"
                      width={600}
                      height={400}
                      style={{
                        objectFit: "contain",
                        borderRadius: "8px",
                        maxWidth: "100%",
                        height: "auto",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Reorder Button */}
              {((selectedOrder.cartItems &&
                selectedOrder.cartItems.length > 0) ||
                selectedOrder.isPurchase) && (
                <div
                  className="order_section"
                  style={{ border: "none", padding: "0" }}
                >
                  <button
                    className="reorder_btn"
                    onClick={() => handleReorder(selectedOrder)}
                  >
                    <FaRedo /> {translations.reorder}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reorder Modal */}
      {isReorderModalOpen && (
        <div className="order_modal_overlay" onClick={closeReorderModal}>
          <div
            className="order_modal_content reorder_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="order_modal_header">
              <h2>{translations.reorderItems}</h2>
              <button className="close_modal_btn" onClick={closeReorderModal}>
                <IoClose size={24} />
              </button>
            </div>

            <div className="order_modal_body">
              {reorderError && (
                <div className="error_message">{reorderError}</div>
              )}

              {reorderSuccess && (
                <div className="success_message">{reorderSuccess}</div>
              )}

              {/* Products with Editable Quantities */}
              <div className="order_section">
                <h3>{translations.products}</h3>
                <div className="products_list">
                  {reorderItems.map((item, index) => (
                    <div
                      key={index}
                      className="product_card reorder_product_card"
                    >
                      <div className="product_image_container">
                        {item.productId?.picUrls?.[0] ? (
                          <Image
                            src={item.productId.picUrls[0]}
                            alt={item.name || "Product"}
                            width={100}
                            height={100}
                            style={{
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        ) : (
                          <div className="product_placeholder">
                            <BsBoxSeam size={40} />
                          </div>
                        )}
                      </div>
                      <div className="product_info">
                        <h4>{item.name || translations.product}</h4>
                        <div className="product_details">
                          <p>
                            <span className="detail_label">{translations.sku}</span>{" "}
                            {item.sku || "N/A"}
                          </p>
                          <p>
                            <span className="detail_label">{translations.price}:</span> {translations.aed}{" "}
                            {item.price?.toFixed(2) || "0.00"}
                          </p>
                          <div className="quantity_selector">
                            <span className="detail_label">{translations.quantity}:</span>
                            <div className="quantity_controls">
                              <button
                                onClick={() =>
                                  updateQuantity(index, item.quantity - 1)
                                }
                                className="quantity_btn"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateQuantity(index, e.target.value)
                                }
                                className="quantity_input"
                              />
                              <button
                                onClick={() =>
                                  updateQuantity(index, item.quantity + 1)
                                }
                                className="quantity_btn"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <p className="product_total">
                            <span className="detail_label">{translations.total}:</span>{" "}
                            <strong>
                              {translations.aed}{" "}
                              {(
                                (item.price || 0) * (item.quantity || 1)
                              ).toFixed(2)}
                            </strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Selection */}
              <div className="order_section">
                <h3>{translations.deliveryAddress}</h3>
                <div className="checkout_personal_info">
                  <div className="checkout_personal_info_item">
                    <h3>{translations.city}</h3>
                    <input
                      type="text"
                      placeholder={translations.city}
                      value={reorderCity}
                      onChange={(e) => setReorderCity(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Add New Address */}
                {userId && (
                  <div className="add_address_section">
                    <h3>{translations.addNewAddress}</h3>
                    <div className="add_address_group">
                      <input
                        type="text"
                        placeholder={translations.enterAddressToSave}
                        value={reorderNewAddress}
                        onChange={(e) => setReorderNewAddress(e.target.value)}
                      />
                      <button
                        className="add_address_btn"
                        onClick={handleAddReorderAddress}
                      >
                        <FiPlus size={22} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Address List */}
                {userId && reorderAddresses.length > 0 && (
                  <div style={{ width: "100%", marginTop: "1rem" }}>
                    <h3>{translations.selectDeliveryAddress}</h3>
                    <div className="addresses_list">
                      {reorderAddresses.map((address, index) => (
                        <div
                          key={index}
                          className="address_card"
                          style={{
                            border:
                              reorderSelectedAddressIndex === index
                                ? "2px solid #4caf50"
                                : "1px solid #ddd",
                            background:
                              reorderSelectedAddressIndex === index
                                ? "#f3fff5"
                                : "#f8f9fb",
                            cursor: "pointer",
                          }}
                          onClick={() => selectReorderAddress(index)}
                        >
                          <div className="address_left">
                            <div className="address_icon"></div>
                            <p className="address_text">{address}</p>
                          </div>

                          <div className="address_actions">
                            {reorderSelectedAddressIndex === index && (
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {userId && reorderAddresses.length === 0 && (
                  <p className="no_address">
                    {translations.noSavedAddresses}
                  </p>
                )}

                {!userId && (
                  <p className="no_address" style={{ color: "red" }}>
                    {translations.pleaseLoginToSelectAddress}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="order_section">
                <h3>{translations.paymentMethod}</h3>
                <div className="checkout_personal_info">
                  <div className="checkout_personal_info_item">
                    <select
                      value={reorderPaymentWay}
                      onChange={(e) => setReorderPaymentWay(e.target.value)}
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
              </div>

              {/* Order Summary */}
              <div className="order_section">
                <h3>{translations.orderSummary}</h3>
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
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    <h3>{translations.totalAmount}</h3>
                    <p>{translations.aed} {reorderTotalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitReorder}
                disabled={reorderLoading}
                className="submit_reorder_btn"
              >
                {reorderLoading ? translations.placingOrder : translations.placeReorder}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Orders Modal */}
      {isAllOrdersModalOpen && (
        <div
          className="order_modal_overlay"
          onClick={() => setIsAllOrdersModalOpen(false)}
        >
          <div
            className="order_modal_content all_orders_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="order_modal_header">
              <h2>{translations.allOrders} ({recentOrders.length})</h2>
              <button
                className="close_modal_btn"
                onClick={() => setIsAllOrdersModalOpen(false)}
              >
                <IoClose size={24} />
              </button>
            </div>

            <div className="order_modal_body">
              {loading ? (
                <p style={{ textAlign: "center", padding: "2rem" }}>
                  {translations.loadingOrders}
                </p>
              ) : error ? (
                <p
                  style={{ color: "red", textAlign: "center", padding: "2rem" }}
                >
                  {error}
                </p>
              ) : recentOrders.length === 0 ? (
                <p style={{ textAlign: "center", padding: "2rem" }}>
                  {translations.noOrdersFound}
                </p>
              ) : (
                <div className="all_orders_list">
                  {recentOrders.map((order, index) => {
                    const itemCount = order.cartItems?.length || 0;
                    const orderDate = formatDate(order.orderDate);
                    return (
                      <div
                        key={order._id || index}
                        className="all_orders_item"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsModalOpen(true);
                          setIsAllOrdersModalOpen(false);
                        }}
                      >
                        <div className="all_orders_item_left">
                          <BsBoxSeam />
                          <div className="all_orders_item_info">
                            <h3>
                              {order.order_id
                                ? `ORD-${order.order_id}`
                                : `${translations.order} #${index + 1}`}
                            </h3>
                            <p>
                              {orderDate} • {itemCount} {itemCount !== 1 ? translations.itemsPlural : translations.item}
                            </p>
                            <div className="all_orders_item_details">
                              <span>
                                <FaMapMarkerAlt /> {order.city || "N/A"}
                              </span>
                              <span>
                                <FaCreditCard /> {order.paymentWay || "N/A"}
                              </span>
                              <span>
                                <MdOutlineAttachMoney /> {translations.aed}{" "}
                                {order.totalAmount?.toFixed(2) || "0.00"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="all_orders_item_right">
                          <div
                            className="order_status_badge"
                            style={{
                              backgroundColor:
                                getStatusColor(order.orderStatus) + "20",
                              color: getStatusColor(order.orderStatus),
                              padding: "6px 12px",
                              borderRadius: "6px",
                              fontSize: "0.85rem",
                              fontWeight: "600",
                              marginBottom: "8px",
                            }}
                          >
                            {order.orderStatus || translations.new}
                          </div>
                          {((order.cartItems && order.cartItems.length > 0) ||
                            order.isPurchase) && (
                            <button
                              className="reorder_btn_small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReorder(order);
                                setIsAllOrdersModalOpen(false);
                              }}
                            >
                              <FaRedo /> {translations.reorder}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Purchase Order Modal */}
      {isPOModalOpen && currentPOItem && (
        <div className="order_modal_overlay" onClick={closePOModal}>
          <div
            className="order_modal_content reorder_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="order_modal_header">
              <h2>{translations.purchaseOrderDetails}</h2>
              <button className="close_modal_btn" onClick={closePOModal}>
                <IoClose size={24} />
              </button>
            </div>

            <div className="order_modal_body">
              {poError && <div className="error_message">{poError}</div>}

              {poSuccess && <div className="success_message">{poSuccess}</div>}

              {/* Preview of uploaded item */}
              <div className="order_section">
                <h3>{translations.purchaseOrder}</h3>
                <div className="po_preview_container">
                  {currentPOItem.isLink ? (
                    <div className="po_link_preview">
                      <span>🔗 {translations.link}</span>
                      <a
                        href={currentPOItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {currentPOItem.url}
                      </a>
                    </div>
                  ) : currentPOItem.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(currentPOItem)}
                      className="po_image_preview"
                      alt="Purchase order"
                    />
                  ) : (
                    <div className="pdf_preview">
                      <span>📄 PDF</span>
                      <small>{currentPOItem.name}</small>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="order_section">
                <h3>{translations.personalInformation}</h3>
                <div className="checkout_personal_info">
                  <div className="checkout_personal_info_item">
                    <h3>{translations.name}:</h3>
                    <input
                      type="text"
                      placeholder={translations.enterYourName}
                      value={poUserName}
                      onChange={(e) => setPoUserName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="checkout_personal_info_item">
                    <h3>{translations.phone}:</h3>
                    <input
                      type="tel"
                      placeholder={translations.enterYourPhoneNumber}
                      value={poPhone}
                      onChange={(e) => setPoPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="checkout_personal_info_item">
                    <h3>{translations.email}:</h3>
                    <input
                      type="email"
                      placeholder={translations.enterYourEmail}
                      value={poEmail}
                      onChange={(e) => setPoEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Selection */}
              <div className="order_section">
                <h3>{translations.deliveryAddress}</h3>
                <div className="checkout_personal_info">
                  <div className="checkout_personal_info_item">
                    <h3>{translations.city}</h3>
                    <input
                      type="text"
                      placeholder={translations.city}
                      value={poCity}
                      onChange={(e) => setPoCity(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Add New Address */}
                {userId && (
                  <div className="add_address_section">
                    <h3>{translations.addNewAddress}</h3>
                    <div className="add_address_group">
                      <input
                        type="text"
                        placeholder={translations.enterAddressToSave}
                        value={poNewAddress}
                        onChange={(e) => setPoNewAddress(e.target.value)}
                      />
                      <button
                        className="add_address_btn"
                        onClick={handleAddPOAddress}
                      >
                        <FiPlus size={22} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Address List */}
                {userId && poAddresses.length > 0 && (
                  <div style={{ width: "100%", marginTop: "1rem" }}>
                    <h3>{translations.selectDeliveryAddress}</h3>
                    <div className="addresses_list">
                      {poAddresses.map((address, index) => (
                        <div
                          key={index}
                          className="address_card"
                          style={{
                            border:
                              poSelectedAddressIndex === index
                                ? "2px solid #4caf50"
                                : "1px solid #ddd",
                            background:
                              poSelectedAddressIndex === index
                                ? "#f3fff5"
                                : "#f8f9fb",
                            cursor: "pointer",
                          }}
                          onClick={() => selectPOAddress(index)}
                        >
                          <div className="address_left">
                            <div className="address_icon"></div>
                            <p className="address_text">{address}</p>
                          </div>

                          <div className="address_actions">
                            {poSelectedAddressIndex === index && (
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {userId && poAddresses.length === 0 && (
                  <p className="no_address">
                    {translations.noSavedAddresses}
                  </p>
                )}

                {!userId && (
                  <p className="no_address" style={{ color: "red" }}>
                    {translations.pleaseLoginToSelectAddress}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="order_section">
                <h3>{translations.paymentMethod}</h3>
                <div className="checkout_personal_info">
                  <div className="checkout_personal_info_item">
                    <select
                      value={poPaymentWay}
                      onChange={(e) => setPoPaymentWay(e.target.value)}
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
              </div>

              {/* Total Amount */}
              <div className="order_section">
                <h3>{translations.totalAmount}</h3>
                <div className="checkout_personal_info">
                  <div className="checkout_personal_info_item">
                    <h3>{translations.amountAED}</h3>
                    <input
                      type="number"
                      placeholder={translations.enterTotalAmount}
                      value={poTotalAmount}
                      onChange={(e) => setPoTotalAmount(e.target.value)}
                      min="0"
                      step="0.01"
                      required
                      style={{
                        width: "100%",
                        padding: "0.5rem 1rem",
                        border: "1px solid rgba(0, 0, 0, 0.2)",
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div
                className="order_section"
                style={{
                  display: "flex",
                  gap: "1rem",
                  border: "none",
                  padding: "0",
                }}
              >
                <button
                  onClick={handleSubmitPO}
                  disabled={poLoading}
                  className="submit_reorder_btn"
                  style={{ flex: 1 }}
                >
                  {poLoading ? translations.sending : translations.sendPO}
                </button>
                <button
                  onClick={closePOModal}
                  disabled={poLoading}
                  className="submit_reorder_btn"
                  style={{
                    flex: 1,
                    background: "#6c757d",
                  }}
                >
                  {translations.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;
