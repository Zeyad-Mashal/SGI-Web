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
import GetCategories from "@/API/Categories/GetCategories";
import en from "@/translation/en.json";
import ar from "@/translation/ar.json";

const ClientCart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [content, setContent] = useState(false);
  const [emptyContent, setEmptyContent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(null);
  const [couponFeedback, setCouponFeedback] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: null,
    productId: null,
    exiting: false,
  });
  const [lang, setLang] = useState("en");
  const [translations, setTranslations] = useState(en);
  const [categoriesTree, setCategoriesTree] = useState([]);

  // ---------------------- 1) On Mount ----------------------
  useEffect(() => {
    // Get language from localStorage
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    setTranslations(savedLang === "ar" ? ar : en);

    setMounted(true);
    loadCart();
    GetCategories(setCategoriesTree, () => {}, () => {});

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

  // نفس منطق الـ checkout: شحن حسب قيمة الطلب، ضريبة 5% على (المجموع + الشحن)
  const calculateShipping = (orderValue) => {
    if (orderValue >= 1 && orderValue <= 99) return 30;
    if (orderValue >= 100 && orderValue <= 199) return 20;
    if (orderValue >= 200 && orderValue <= 299) return 10;
    if (orderValue >= 300) return 0;
    return 0;
  };

  // ---------------------- 2) Update totals ----------------------
  useEffect(() => {
    if (!mounted) return;

    const currentSubtotal = getCartTotal();
    const currentShipping = calculateShipping(currentSubtotal);
    const currentTax = (currentSubtotal + currentShipping) * 0.05;
    const currentTotal = currentSubtotal + currentShipping + currentTax;

    setSubtotal(currentSubtotal);
    setShipping(currentShipping);
    setTax(currentTax);
    setTotal(currentTotal);
  }, [cartItems, mounted]);

  // ---------------------- 3) Load coupon if saved ----------------------
  // الكوبون يُحسب على سعر المنتجات فقط، ثم الشحن كما هو، ثم الضريبة على (المجموع بعد الخصم + الشحن)
  useEffect(() => {
    if (!mounted) return;

    const saved = localStorage.getItem("savedCoupon");
    if (saved) {
      const { code, discount } = JSON.parse(saved);
      setCoupon(code);
      setDiscount(discount);

      const currentSubtotal = getCartTotal();
      const currentShipping = calculateShipping(currentSubtotal);

      const discountAmount = currentSubtotal * (discount / 100);
      const subtotalAfterDiscount = currentSubtotal - discountAmount;
      const taxAfterCoupon = (subtotalAfterDiscount + currentShipping) * 0.05;
      const finalTotal = subtotalAfterDiscount + currentShipping + taxAfterCoupon;

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

  const handleRemoveItem = (productId) => {
    setConfirmModal({ open: true, type: "remove_item", productId, exiting: false });
  };

  const openClearCartConfirm = () => {
    setConfirmModal({ open: true, type: "clear_cart", productId: null, exiting: false });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, exiting: true }));
    setTimeout(() => {
      setConfirmModal({ open: false, type: null, productId: null, exiting: false });
    }, 280);
  };

  const confirmModalAction = () => {
    if (confirmModal.type === "remove_item" && confirmModal.productId) {
      removeItem(confirmModal.productId);
    } else if (confirmModal.type === "clear_cart") {
      clearCart();
      setCartItems([]);
      setEmptyContent(true);
      setContent(false);
    }
    closeConfirmModal();
  };

  const getCategoryDisplayName = (category) => {
    if (!category) return "";
    if (typeof category === "string") return category;
    if (category?.name) {
      if (typeof category.name === "object" && category.name !== null) {
        const currentLang = localStorage.getItem("lang") || "en";
        return (
          category.name[currentLang] ||
          category.name.en ||
          category.name.ar ||
          ""
        );
      }
      return String(category.name);
    }
    return "";
  };

  // بناء المسار الكامل: Shop / Main Category / Sub Category
  const getProductPath = (item) => {
    const shopLabel = translations.shop || "Shop";
    if (!item.categories?.length) return shopLabel;

    const cat = item.categories[0];
    const categoryId = typeof cat === "object" && cat !== null ? cat._id : cat;
    if (!categoryId || !categoriesTree.length) {
      const name = getCategoryDisplayName(cat);
      return name ? `${shopLabel} / ${name}` : shopLabel;
    }

    for (const main of categoriesTree) {
      if (main._id === categoryId) {
        const mainName = getCategoryDisplayName(main);
        return mainName ? `${shopLabel} / ${mainName}` : shopLabel;
      }
      if (main.subCategories && Array.isArray(main.subCategories)) {
        for (const sub of main.subCategories) {
          if (sub._id === categoryId) {
            const mainName = getCategoryDisplayName(main);
            const subName = getCategoryDisplayName(sub);
            if (mainName && subName)
              return `${shopLabel} / ${mainName} / ${subName}`;
            if (subName) return `${shopLabel} / ${subName}`;
            if (mainName) return `${shopLabel} / ${mainName}`;
            return shopLabel;
          }
        }
      }
    }
    const name = getCategoryDisplayName(cat);
    return name ? `${shopLabel} / ${name}` : shopLabel;
  };


  const handleApplyCoupon = async () => {
    setCouponFeedback(null);
    setError("");
    const result = await ApplayCoupon(
      coupon,
      setError,
      setLoading,
      setDiscount,
    );

    if (result && result.discount) {
      const currentSubtotal = getCartTotal();
      const currentShipping = calculateShipping(currentSubtotal);

      const discountAmount = currentSubtotal * (result.discount / 100);
      const subtotalAfterDiscount = currentSubtotal - discountAmount;
      const taxAfterCoupon = (subtotalAfterDiscount + currentShipping) * 0.05;
      const finalTotal = subtotalAfterDiscount + currentShipping + taxAfterCoupon;

      setTotalAfterDiscount(finalTotal);
      setCouponFeedback({
        type: "success",
        message: translations.couponAppliedSuccess,
      });

      localStorage.setItem(
        "savedCoupon",
        JSON.stringify({
          code: coupon,
          discount: result.discount,
        }),
      );
    } else {
      const message = result?.message || translations.couponInvalid;
      setCouponFeedback({ type: "error", message });
    }
  };

  useEffect(() => {
    if (!couponFeedback) return;
    const timer = setTimeout(() => setCouponFeedback(null), 2000);
    return () => clearTimeout(timer);
  }, [couponFeedback]);

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
          <h1 className="cart_page_h1">{translations.shoppingCart}</h1>
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
              <p>{translations.startAddingWholesale}</p>

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
                        <h3>
                          {translations.cartItems} ({cartItems.length})
                        </h3>
                        <p>{translations.allPricesIncludeDiscounts}</p>
                      </div>
                      <div
                        className="cart_count_right"
                        onClick={openClearCartConfirm}
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
                                <p className="cart_product_path">
                                  {getProductPath(item)}
                                </p>
                                <h2>{item.name}</h2>
                                <span>
                                  {(() => {
                                    if (!item.categories?.length)
                                      return translations.product;
                                    const category = item.categories[0];
                                    if (typeof category === "string")
                                      return category;
                                    if (category?.name) {
                                      if (
                                        typeof category.name === "object" &&
                                        category.name !== null
                                      ) {
                                        const currentLang =
                                          localStorage.getItem("lang") || "en";
                                        return (
                                          category.name[currentLang] ||
                                          category.name.en ||
                                          translations.product
                                        );
                                      }
                                      return String(category.name);
                                    }
                                    return translations.product;
                                  })()}
                                </span>
                                <p>
                                  {translations.aed} {item.price}{" "}
                                  <span>
                                    {item.isBoxPricing
                                      ? translations.perBox
                                      : translations.perUnit}
                                  </span>
                                  {item.isBoxPricing && item.piecesPerBox && (
                                    <span
                                      style={{
                                        fontSize: "0.85em",
                                        color: "#666",
                                        marginLeft: "0.5rem",
                                      }}
                                    >
                                      ({item.piecesPerBox}{" "}
                                      {translations.piecesPerBox})
                                    </span>
                                  )}
                                </p>
                              </div>

                              <div className="product_item_top_btns">
                                <FaRegHeart />
                                <RiDeleteBin6Line
                                  onClick={() => handleRemoveItem(item._id)}
                                  className="cart_item_remove_icon"
                                  title={translations.confirmRemoveFromCart}
                                  aria-label={
                                    translations.confirmRemoveFromCart
                                  }
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

                                {/* <p>
                                  <MdErrorOutline />{" "}
                                  {translations.minOrder30Units}
                                </p> */}

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

                      {couponFeedback && (
                        <div
                          className={`cart_coupon_feedback cart_coupon_feedback--${couponFeedback.type}`}
                          role="alert"
                        >
                          {couponFeedback.message}
                        </div>
                      )}
                      {discount && (
                        <div className="cart_discount_applied">
                          <span className="cart_discount_label">
                            {translations.discount} <strong>{discount}%</strong>
                          </span>
                          <button
                            type="button"
                            onClick={removeCoupon}
                            className="remove_coupon_btn"
                            title={translations.removeCoupon}
                            aria-label={translations.removeCoupon}
                          >
                            <RiDeleteBin6Line />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="cart_right_summry">
                      <h3>{translations.orderSummary}</h3>

                      <div className="summry">
                        <h4>
                          {translations.subtotal} (
                          {cartItems.reduce(
                            (sum, item) => sum + item.quantity,
                            0,
                          )}{" "}
                          {translations.items})
                        </h4>
                        <p>
                          {translations.aed} {subtotal.toFixed(2)}
                        </p>
                      </div>

                      <div className="summry">
                        <h4>{translations.shipping}</h4>
                        <p>
                          {shipping === 0
                            ? translations.free
                            : `${translations.aed} ${shipping.toFixed(2)}`}
                        </p>
                      </div>

                      <div className="summry">
                        <h4>{translations.tax5}</h4>
                        <p>
                          {translations.aed}{" "}
                          {(discount != null && discount > 0
                            ? (subtotal - subtotal * (discount / 100) + shipping) * 0.05
                            : tax
                          ).toFixed(2)}
                        </p>
                      </div>

                      {discount != null && discount > 0 && (
                        <div className="summry cart_coupon_row">
                          <h4>
                            {translations.coupon || "Coupon"} ({discount}%)
                          </h4>
                          <p className="cart_coupon_discount">
                            - {translations.aed}{" "}
                            {(subtotal * (discount / 100)).toFixed(2)}
                          </p>
                        </div>
                      )}

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

      {/* مودال تأكيد الحذف / مسح السلة */}
      {confirmModal.open && (
        <div
          className={`cart_confirm_overlay ${confirmModal.exiting ? "cart_confirm_overlay--exit" : ""}`}
          onClick={closeConfirmModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-confirm-title"
        >
          <div
            className={`cart_confirm_modal ${confirmModal.exiting ? "cart_confirm_modal--exit" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cart_confirm_icon">
              <RiDeleteBin6Line />
            </div>
            <h3 id="cart-confirm-title" className="cart_confirm_title">
              {confirmModal.type === "clear_cart"
                ? translations.confirmClearTitle
                : translations.confirmRemoveTitle}
            </h3>
            <p className="cart_confirm_message">
              {confirmModal.type === "clear_cart"
                ? translations.confirmClearCart
                : translations.confirmRemoveFromCart}
            </p>
            <div className="cart_confirm_actions">
              <button
                type="button"
                className="cart_confirm_btn cart_confirm_btn--cancel"
                onClick={closeConfirmModal}
              >
                {translations.cancel}
              </button>
              <button
                type="button"
                className="cart_confirm_btn cart_confirm_btn--confirm"
                onClick={confirmModalAction}
              >
                {confirmModal.type === "clear_cart"
                  ? translations.confirmClear
                  : translations.confirmRemove}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientCart;
