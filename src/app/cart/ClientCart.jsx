"use client";
import React, { useState, useEffect } from "react";
import "./cart.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoGift } from "react-icons/go";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import { BsBox2 } from "react-icons/bs";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BsPatchCheck } from "react-icons/bs";
import { IoCartSharp } from "react-icons/io5";
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
} from "@/utils/cartUtils";
import { useRouter } from "next/navigation";
import ApplayCoupon from "@/API/Coupon/ApplayCoupon";
import en from "@/translation/en.json";
import ar from "@/translation/ar.json";

const ClientCart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [content, setContent] = useState(false);
  const [emptyContent, setEmptyContent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(null);
  const [lang, setLang] = useState("en");
  const [translations, setTranslations] = useState(en);

  // ---------------------- 1) On Mount ----------------------
  useEffect(() => {
    // Get language from localStorage
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    setTranslations(savedLang === "ar" ? ar : en);
    
    setMounted(true);
    loadCart();

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

  // ---------------------- 2) Update totals ----------------------
  useEffect(() => {
    if (!mounted) return;

    const currentSubtotal = getCartTotal();
    const currentTax = currentSubtotal * 0.05;
    const currentTotal = currentSubtotal + currentTax;

    setSubtotal(currentSubtotal);
    setTax(currentTax);
    setTotal(currentTotal);
  }, [cartItems, mounted]);

  // ---------------------- 3) Load coupon if saved ----------------------
  useEffect(() => {
    if (!mounted) return;

    const saved = localStorage.getItem("savedCoupon");
    if (saved) {
      const { code, discount } = JSON.parse(saved);
      setCoupon(code);
      setDiscount(discount);

      const currentSubtotal = getCartTotal();
      const currentTax = currentSubtotal * 0.05;
      const beforeDiscountTotal = currentSubtotal + currentTax;

      const discountAmount = beforeDiscountTotal * (discount / 100);
      const finalTotal = beforeDiscountTotal - discountAmount;

      setTotalAfterDiscount(finalTotal);
    }
  }, [mounted, cartItems]);

  // ---------------------- Functions ----------------------

  const loadCart = () => {
    const cart = getCart();
    if (cart.length === 0) {
      setEmptyContent(true);
      setContent(false);
    } else {
      setCartItems(cart);
      setEmptyContent(false);
      setContent(true);
    }
  };

  const updateQty = (productId, value) => {
    const num = Math.max(1, Number(value));
    const updatedCart = updateCartItemQuantity(productId, num);
    setCartItems(updatedCart);

    if (updatedCart.length === 0) {
      setEmptyContent(true);
      setContent(false);
    }
  };

  const removeItem = (productId) => {
    const updatedCart = removeFromCart(productId);
    setCartItems(updatedCart);

    if (updatedCart.length === 0) {
      setEmptyContent(true);
      setContent(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setCartItems([]);
    setEmptyContent(true);
    setContent(false);
  };

  const handleApplyCoupon = async () => {
    const result = await ApplayCoupon(
      coupon,
      setError,
      setLoading,
      setDiscount
    );

    if (result && result.discount) {
      const currentSubtotal = getCartTotal();
      const currentTax = currentSubtotal * 0.05;
      const beforeDiscountTotal = currentSubtotal + currentTax;

      const discountAmount = beforeDiscountTotal * (result.discount / 100);
      const finalTotal = beforeDiscountTotal - discountAmount;

      setTotalAfterDiscount(finalTotal);

      localStorage.setItem(
        "savedCoupon",
        JSON.stringify({
          code: coupon,
          discount: result.discount,
        })
      );
    }
  };

  const removeCoupon = () => {
    localStorage.removeItem("savedCoupon");
    setCoupon("");
    setDiscount(null);
    setTotalAfterDiscount(null);
  };

  // ---------------------- RETURN (No hooks below this point!) ----------------------
  return (
    <div className="cart">
      {/* -------------- Loading -------------- */}
      {!mounted ? (
        <div className="cart_container">
          <p>{translations.loading}</p>
        </div>
      ) : (
        <>
          {/* -------------- Empty Cart -------------- */}
          {emptyContent ? (
            <div className="empty_cart">
              <Image
                src={"/images/empty_cart.png"}
                alt="empty cart"
                loading="lazy"
                width={90}
                height={90}
              />

              <h1>{translations.yourCartIsEmpty}</h1>
              <p>
                {translations.startAddingWholesale}
              </p>

              <div className="empty_content">
                <p>
                  <BsBox2 /> {translations.bulkPricing}
                </p>
                <p>
                  <LiaShippingFastSolid /> {translations.freeShipping500}
                </p>
                <p>
                  <BsPatchCheck /> {translations.qualityAssured}
                </p>
              </div>

              <button onClick={() => router.push("/shop")}>
                {translations.browseProducts}
              </button>
            </div>
          ) : (
            /* -------------- Cart Content -------------- */
            <div className="cart_container">
              <div className="cart_content">
                <h1>{translations.shoppingCart}</h1>
                <p>{translations.reviewWholesaleOrder}</p>

                <div className="cart_content_info">
                  {/* LEFT SIDE */}
                  <div className="cart_left">
                    <div className="cart_count">
                      <div className="cart_count_left">
                        <h3>{translations.cartItems} ({cartItems.length})</h3>
                        <p>
                          {translations.allPricesIncludeDiscounts}
                        </p>
                      </div>
                      <div
                        className="cart_count_right"
                        onClick={handleClearCart}
                      >
                        <RiDeleteBin6Line /> {translations.clearCart}
                      </div>
                    </div>

                    <div className="cart_list">
                      {cartItems.map((item) => (
                        <div className="cart_product" key={item._id}>
                          <Image
                            src={
                              item.picUrls && item.picUrls[0]
                                ? item.picUrls[0]
                                : "/images/empty_product.png"
                            }
                            alt={item.name}
                            loading="lazy"
                            width={200}
                            height={200}
                          />

                          <div className="cart_product_content">
                            <div className="product_item_top">
                              <div className="product_item_top_title">
                                <h2>{item.name}</h2>
                                <span>
                                  {(() => {
                                    if (!item.categories?.length) return translations.product;
                                    const category = item.categories[0];
                                    // Handle both object format {_id, name: {en, ar}} and string format
                                    if (typeof category === 'string') {
                                      return category;
                                    }
                                    if (category?.name) {
                                      // Check if name is an object with lang keys
                                      if (typeof category.name === 'object' && category.name !== null) {
                                        const currentLang = localStorage.getItem("lang") || "en";
                                        return category.name[currentLang] || category.name.en || translations.product;
                                      }
                                      return String(category.name);
                                    }
                                    return translations.product;
                                  })()}
                                </span>
                                <p>
                                  {translations.aed} {item.price} <span>{item.isBoxPricing ? translations.perBox : translations.perUnit}</span>
                                  {item.isBoxPricing && item.piecesPerBox && (
                                    <span style={{ fontSize: "0.85em", color: "#666", marginLeft: "0.5rem" }}>
                                      ({item.piecesPerBox} {translations.piecesPerBox})
                                    </span>
                                  )}
                                </p>
                              </div>

                              <div className="product_item_top_btns">
                                <FaRegHeart />
                                <RiDeleteBin6Line
                                  onClick={() => removeItem(item._id)}
                                  style={{ cursor: "pointer" }}
                                />
                              </div>
                            </div>

                            <div className="product_item_bottom">
                              <div className="Quantity_counter">
                                <div className="counter">
                                  <button
                                    onClick={() =>
                                      updateQty(item._id, item.quantity - 1)
                                    }
                                  >
                                    -
                                  </button>

                                  <input
                                    type="text"
                                    value={item.quantity}
                                    onChange={(e) =>
                                      updateQty(item._id, e.target.value)
                                    }
                                  />

                                  <button
                                    onClick={() =>
                                      updateQty(item._id, item.quantity + 1)
                                    }
                                  >
                                    +
                                  </button>
                                </div>

                                <p>
                                  <MdErrorOutline /> {translations.minOrder30Units}
                                </p>

                                <div className="total">
                                  <h2>
                                    {translations.itemTotal}{" "}
                                    <span>
                                      {translations.aed}{" "}
                                      {(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </h2>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT SIDE (SUMMARY) */}
                  <div className="cart_right">
                    <div className="cart_right_promo">
                      <h3>
                        <GoGift /> {translations.promoCode}
                      </h3>

                      <div className="promo_input">
                        <input
                          type="text"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                        />

                        <button onClick={handleApplyCoupon}>
                          {loading ? translations.applying : translations.apply}
                        </button>
                      </div>

                      {/* <p>{translations.tryBulk10}</p> */}
                      {error && <p style={{ color: "red" }}>{error}</p>}
                      {discount && (
                        <p style={{ color: "green" }}>{translations.discount} {discount}%</p>
                      )}

                      {discount && (
                        <button
                          onClick={removeCoupon}
                          className="remove_coupon_btn"
                        >
                          {translations.removeCoupon}
                        </button>
                      )}
                    </div>

                    <div className="cart_right_summry">
                      <h3>{translations.orderSummary}</h3>

                      <div className="summry">
                        <h4>
                          {translations.subtotal} (
                          {cartItems.reduce(
                            (sum, item) => sum + item.quantity,
                            0
                          )}{" "}
                          {translations.items})
                        </h4>
                        <p>{translations.aed} {subtotal.toFixed(2)}</p>
                      </div>

                      <div className="summry">
                        <h4>{translations.shipping}</h4>
                        <p>
                          {subtotal >= 500 ? translations.free : translations.calculatedAtCheckout}
                        </p>
                      </div>

                      <div className="summry">
                        <h4>{translations.tax5}</h4>
                        <p>{translations.aed} {tax.toFixed(2)}</p>
                      </div>

                      <hr />

                      <div className="summry">
                        <h4>{translations.total}</h4>
                        <p>
                          {translations.aed}{" "}
                          {totalAfterDiscount
                            ? totalAfterDiscount.toFixed(2)
                            : total.toFixed(2)}
                        </p>
                      </div>

                      <button onClick={() => router.push("/checkout")}>
                        {translations.proceedToCheckout} <FaArrowRight />
                      </button>

                      <p>
                        <BsBox2 /> {translations.bulkPackagingAvailable}
                      </p>
                      <p>
                        <LiaShippingFastSolid /> {translations.fastDelivery}
                      </p>
                      <p>
                        <BsPatchCheck /> {translations.secureCheckoutProcess}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientCart;
