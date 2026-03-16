"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./product.css";
import { FaStar } from "react-icons/fa";
import { RiShoppingBag3Line } from "react-icons/ri";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useParams } from "next/navigation";
import ProductDetails from "@/API/Products/ProductDetails";
import {
  addToCart,
  getCart,
  getCartQtyForProduct,
  updateCartItemQuantityByMode,
} from "@/utils/cartUtils";
import { useToast } from "@/context/ToastContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
  toggleFavorite,
  isFavorited,
  getFavorites,
} from "@/utils/favoriteUtils";
import en from "@/translation/en.json";
import ar from "@/translation/ar.json";

const ClientProduct = () => {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState([]);
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [useBoxPrice, setUseBoxPrice] = useState(false);
  const [lang, setLang] = useState("en");
  const [translations, setTranslations] = useState(en);

  const [activeImg, setActiveImg] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [productDetails, setProductDetails] = useState([]);

  const cartQty =
    productDetails?._id && Array.isArray(cart)
      ? (cart.find(
          (i) =>
            i._id === productDetails._id &&
            (i.isBoxPricing ?? false) === useBoxPrice,
        )?.quantity ?? 0)
      : 0;
  const isInCart = cartQty > 0;

  const stockNum =
    productDetails?.stock != null
      ? Number(productDetails.stock)
      : productDetails?.quantity != null
        ? Number(productDetails.quantity)
        : null;
  const isOutOfStock = stockNum !== null && !isNaN(stockNum) && stockNum <= 0;
  const hasLowStock =
    stockNum !== null && !isNaN(stockNum) && stockNum > 0 && stockNum < 10;

  const updateQty = (value) => {
    const num = Math.max(0, Number(value));
    setQty(num);
  };

  const handleBoxClick = () => {
    const boxPrice = Number(productDetails?.boxPrice);
    const piecesNumber = Number(productDetails?.piecesNumber);

    if (
      productDetails?.boxPrice !== null &&
      productDetails?.boxPrice !== undefined &&
      productDetails?.boxPrice !== "" &&
      !isNaN(boxPrice) &&
      boxPrice > 0 &&
      productDetails?.piecesNumber !== null &&
      productDetails?.piecesNumber !== undefined &&
      productDetails?.piecesNumber !== "" &&
      !isNaN(piecesNumber) &&
      piecesNumber > 0
    ) {
      if (useBoxPrice) {
        // Switch back to unit pricing
        setUseBoxPrice(false);
        setQty(1);
        showToast(translations.switchedToUnitPricing, "info");
      } else {
        // Switch to box pricing - quantity represents number of boxes
        setUseBoxPrice(true);
        setQty(1); // Start with 1 box, user can increase
        showToast(translations.boxPricingApplied, "success");
      }
    }
  };

  // Get current price (box price if selected, otherwise regular price)
  const getCurrentPrice = () => {
    const boxPrice = Number(productDetails?.boxPrice);
    if (
      useBoxPrice &&
      productDetails?.boxPrice !== null &&
      productDetails?.boxPrice !== undefined &&
      productDetails?.boxPrice !== "" &&
      !isNaN(boxPrice) &&
      boxPrice > 0
    ) {
      return boxPrice;
    }
    return productDetails?.price || 0;
  };

  const [activeTab, setActiveTab] = useState("description");

  // Slider arrows
  const goNext = () => {
    if (!productDetails?.picUrls) return;

    const imgs = productDetails.picUrls;
    const currentIndex = imgs.indexOf(activeImg);
    const nextIndex = (currentIndex + 1) % imgs.length;
    setActiveImg(imgs[nextIndex]);
  };

  const goPrev = () => {
    if (!productDetails?.picUrls) return;

    const imgs = productDetails.picUrls;
    const currentIndex = imgs.indexOf(activeImg);
    const prevIndex = (currentIndex - 1 + imgs.length) % imgs.length;
    setActiveImg(imgs[prevIndex]);
  };

  useEffect(() => {
    setCart(getCart());
  }, [id, useBoxPrice]);

  useEffect(() => {
    // Get language from localStorage
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    setTranslations(savedLang === "ar" ? ar : en);

    getProductDetails();
    setFavorites(getFavorites());
    setCart(getCart());

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

  useEffect(() => {
    setFavorites(getFavorites());
  }, [productDetails]);

  const handleFavoriteClick = () => {
    if (productDetails && productDetails._id) {
      const wasFavorited = isFavorited(productDetails._id);
      const updatedFavorites = toggleFavorite(productDetails);
      setFavorites(updatedFavorites);
      if (wasFavorited) {
        showToast(translations.removedFromFavorites, "info");
      } else {
        showToast(translations.addedToFavorites, "success");
      }
    }
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getProductDetails = () => {
    ProductDetails(setProductDetails, setError, setLoading, id);
  };
  useEffect(() => {
    if (productDetails?.picUrls?.length > 0) {
      setActiveImg(productDetails.picUrls[0]);
      setImageLoading(false); // إخفاء الـ loader فور وصول البيانات
    } else {
      setActiveImg(null);
      setImageLoading(true);
    }
  }, [productDetails]);

  return (
    <div className="product">
      <div className="product_container">
        <div className="product_imgs">
          {/* Slider arrows */}
          <button className="slider_btn left" onClick={goPrev}>
            <IoIosArrowBack />
          </button>

          <button className="slider_btn right" onClick={goNext}>
            <IoIosArrowForward />
          </button>

          {/* Main image */}
          <div className="main_image_container">
            {loading || (!activeImg && !productDetails?.picUrls?.length) ? (
              <div className="image_loader">
                <div className="loader_spinner"></div>
                <p>{translations.loadingImage}</p>
              </div>
            ) : activeImg ? (
              <Image
                src={activeImg}
                alt="product image"
                width={390}
                height={390}
                className="main_image"
                priority
              />
            ) : null}
          </div>

          {/* Small images */}
          <div className="product_subimgs">
            {loading ? (
              <div className="subimages_loader">
                <div className="loader_spinner_small"></div>
                <div className="loader_spinner_small"></div>
                <div className="loader_spinner_small"></div>
              </div>
            ) : productDetails?.picUrls?.length > 0 ? (
              productDetails.picUrls.map((img, index) => (
                <div
                  key={index}
                  className={`subimg_box ${
                    activeImg === img ? "active_subimg" : ""
                  }`}
                  onClick={() => {
                    setActiveImg(img);
                  }}
                >
                  <Image
                    src={img}
                    alt="product"
                    width={130}
                    height={130}
                    loading="lazy"
                  />
                </div>
              ))
            ) : null}
          </div>
        </div>

        <div className="product_content">
          {/* <span>{productDetails?.categories[0]}</span> */}
          <h1>{productDetails.name}</h1>
          <span>{productDetails.brand}</span>
          {/* <p>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <span>(4.5 {translations.rating}) 150+ {translations.reviews}</span>
          </p> */}
          <h3>
            {translations.aed} {getCurrentPrice()}{" "}
            <span>
              {useBoxPrice ? translations.perBox : translations.perUnit}
            </span>
          </h3>
          {/* <h4>{translations.minimumOrder}</h4> */}
          <h5>
            {translations.reviewRefundPolicy}{" "}
            <a href="/returns">{translations.learnMore}</a>
          </h5>

          {stockNum !== null && !isNaN(stockNum) && (
            <div className="product_stock_status">
              <span
                className={`product_stock_badge ${isOutOfStock ? "out" : "in"}`}
              >
                {isOutOfStock ? translations.outOfStock : translations.inStock}
              </span>
              {hasLowStock && (
                <p className="product_stock_remaining">
                  {translations.remainingPieces.replace(
                    "{{count}}",
                    String(stockNum),
                  )}
                </p>
              )}
            </div>
          )}

          {productDetails?.boxPrice !== null &&
            productDetails?.boxPrice !== undefined &&
            productDetails?.boxPrice !== "" &&
            Number(productDetails?.boxPrice) > 0 &&
            productDetails?.piecesNumber !== null &&
            productDetails?.piecesNumber !== undefined &&
            productDetails?.piecesNumber !== "" &&
            Number(productDetails?.piecesNumber) > 0 && (
              <h4
                onClick={handleBoxClick}
                // style={{
                //   cursor: "pointer",
                //   color: useBoxPrice ? "#4caf50" : "inherit",
                //   fontWeight: useBoxPrice ? "bold" : "normal",
                //   textDecoration: useBoxPrice ? "underline" : "none",
                //   userSelect: "none",
                // }}
                className="boxItem"
              >
                {translations.reviewBoxAvailable}{" "}
                {useBoxPrice &&
                  `(${productDetails.piecesNumber} ${translations.piecesPerBox})`}{" "}
                {useBoxPrice && "✓"}
              </h4>
            )}

          <div className="Quantity">
            <h3>
              {translations.quantity}{" "}
              {useBoxPrice
                ? `(${translations.boxes})`
                : `(${translations.units})`}
            </h3>
            <div className="Quantity_counter">
              {isInCart ? (
                <div
                  className="shop_cart_counter product_page_cart_counter"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="shop_counter_btn"
                    onClick={() => {
                      if (!productDetails?._id) return;
                      if (cartQty === 1) {
                        updateCartItemQuantityByMode(
                          productDetails._id,
                          useBoxPrice,
                          0,
                        );
                        showToast(
                          translations.removedFromCart || "Removed from cart",
                          "info",
                        );
                      } else {
                        updateCartItemQuantityByMode(
                          productDetails._id,
                          useBoxPrice,
                          cartQty - 1,
                        );
                      }
                      setCart(getCart());
                    }}
                    aria-label={cartQty === 1 ? "Remove" : "Decrease"}
                  >
                    <FontAwesomeIcon
                      icon={cartQty === 1 ? faTrashAlt : faMinus}
                    />
                  </button>
                  <span className="shop_counter_qty">{cartQty}</span>
                  <button
                    type="button"
                    className="shop_counter_btn"
                    onClick={() => {
                      if (!productDetails?._id) return;
                      updateCartItemQuantityByMode(
                        productDetails._id,
                        useBoxPrice,
                        cartQty + 1,
                      );
                      setCart(getCart());
                    }}
                    aria-label="Increase"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              ) : (
                <div className="counter">
                  <button onClick={() => updateQty(Math.max(1, qty - 1))}>
                    -
                  </button>
                  <input
                    type="text"
                    value={qty}
                    onChange={(e) => updateQty(e.target.value)}
                  />
                  <button onClick={() => updateQty(qty + 1)}>+</button>
                </div>
              )}

              <div className="total">
                <h2>
                  {translations.total}
                  <span>
                    {((isInCart ? cartQty : qty) * getCurrentPrice()).toFixed(
                      2,
                    )}{" "}
                    {translations.aed}
                  </span>{" "}
                </h2>
                {useBoxPrice && productDetails?.piecesNumber && (
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      marginTop: "0.5rem",
                    }}
                  >
                    ({isInCart ? cartQty : qty} {translations.boxesPlural} ×{" "}
                    {productDetails.piecesNumber} {translations.pieces} ={" "}
                    {(isInCart ? cartQty : qty) * productDetails.piecesNumber}{" "}
                    {translations.totalPieces})
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="product_btns">
            {!isInCart && (
              <button
                onClick={() => {
                  if (productDetails && productDetails._id && !isOutOfStock) {
                    const productToAdd = {
                      ...productDetails,
                      price: getCurrentPrice(),
                      isBoxPricing: useBoxPrice,
                      piecesPerBox: useBoxPrice
                        ? productDetails.piecesNumber
                        : undefined,
                    };
                    addToCart(productToAdd, qty);
                    setCart(getCart());
                    const message = useBoxPrice
                      ? `${qty} ${translations.boxesPlural} ${translations.addedToCartWithBoxes} (${
                          qty * productDetails.piecesNumber
                        } ${translations.pieces})`
                      : translations.productAddedToCart;
                    showToast(message, "success");
                  }
                }}
                disabled={isOutOfStock}
                className={isOutOfStock ? "product_btn_disabled" : ""}
              >
                <RiShoppingBag3Line />{" "}
                {isOutOfStock
                  ? translations.outOfStock
                  : translations.addtocart}
              </button>
            )}
            {productDetails && productDetails._id && (
              <div
                onClick={handleFavoriteClick}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: isFavorited(productDetails._id)
                    ? "scale(1.2)"
                    : "scale(1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className={`heart-icon ${
                  isFavorited(productDetails._id) ? "favorited" : ""
                }`}
              >
                {isFavorited(productDetails._id) ? (
                  <FaHeart style={{ color: "#ef4444", fontSize: "24px" }} />
                ) : (
                  <FaRegHeart style={{ fontSize: "24px" }} />
                )}
              </div>
            )}
          </div>

          {productDetails?.uses != null && productDetails?.uses !== "" && (
            <div className="product_major_uses">
              <h3 className="product_major_uses_title">
                {translations.majorProductUses}
              </h3>
              <div className="product_major_uses_content">
                <pre
                  className="product_major_uses_text"
                  style={{
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    color: "inherit",
                    margin: 0,
                    padding: 0,
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                >
                  {productDetails.uses}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="product_desc">
        <div className="product_desc_btns">
          <button
            className={activeTab === "description" ? "active" : ""}
            onClick={() => setActiveTab("description")}
          >
            {translations.description}
          </button>

          {/* <button
            className={activeTab === "specs" ? "active" : ""}
            onClick={() => setActiveTab("specs")}
          >
            Specifications
          </button> */}

          <button
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => setActiveTab("reviews")}
          >
            {translations.reviews}
          </button>
        </div>

        <div className="product_desc_content">
          {activeTab === "description" && (
            <div className="product_desc_description">
              <h2>{translations.productDescription}</h2>
              <p>{productDetails.description}</p>
              <h2>{translations.idealFor}</h2>
              <ul>
                <li>
                  <pre
                    style={{
                      fontFamily: "inherit",
                      fontSize: "inherit",
                      color: "inherit",
                      margin: 0,
                      padding: 0,
                      whiteSpace: "pre-wrap",
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                    }}
                  >
                    {productDetails.features}
                  </pre>
                </li>
              </ul>
            </div>
          )}

          {/* {activeTab === "specs" && (
            <div className="product_desc_description">
              <h2>Specifications</h2>
              <ul>
                <li>Weight: 1L</li>
                <li>Material: Organic compound</li>
                <li>PH Level: 7.0</li>
                <li>Made in: USA</li>
              </ul>
            </div>
          )} */}

          {activeTab === "reviews" && (
            <div className="product_desc_description">
              <h2>{translations.reviews}</h2>
              <p>{translations.noReviewsYet}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProduct;
