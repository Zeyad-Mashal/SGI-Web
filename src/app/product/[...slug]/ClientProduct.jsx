"use client";
import React, { useEffect, useRef, useState } from "react";
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

const ClientProduct = ({ initialProduct = null }) => {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState([]);
  const params = useParams();
  const slug = params.slug;
  const id = Array.isArray(slug) ? slug[slug.length - 1] : slug;

  const firstDetailsFetchRef = useRef(true);
  const [qty, setQty] = useState(1);
  const [useBoxPrice, setUseBoxPrice] = useState(false);
  const [lang, setLang] = useState("en");
  const [translations, setTranslations] = useState(en);

  const [activeImg, setActiveImg] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [productDetails, setProductDetails] = useState(
    initialProduct ?? null,
  );

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
  }, [lang, id]);

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
  const [loading, setLoading] = useState(() => !initialProduct);
  const [error, setError] = useState(null);
  const getProductDetails = () => {
    const suppress =
      firstDetailsFetchRef.current && !!initialProduct;
    firstDetailsFetchRef.current = false;
    ProductDetails(setProductDetails, setError, setLoading, id, {
      suppressInitialLoading: suppress,
    });
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

  // Local reviews state
  const [showModal, setShowModal] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewHoverRating, setNewReviewHoverRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);

  // Get combined reviews from productDetails.ratings
  const getCombinedReviews = () => {
    const ratings = productDetails?.ratings || [];
    return ratings
      .map(r => {
        if (!r) return null;
        const reviewerName = r.postedBy || r.user?.name || r.userName || r.user?.username || r.name || (lang === "ar" ? "عميل مؤكد" : "Verified Customer");
        return {
          id: r._id || r.id || `rating-${Date.now()}-${Math.random()}`,
          name: reviewerName,
          rating: r.numberOfStar || r.stars || r.rating || 5,
          comment: r.review || r.comment || "",
          date: r.createdAt ? r.createdAt.split("T")[0] : (r.date || new Date().toISOString().split("T")[0])
        };
      })
      .filter(Boolean);
  };

  const combinedReviews = getCombinedReviews();
  const totalReviewsCount = combinedReviews.length;
  const averageRating = totalReviewsCount > 0
    ? (combinedReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviewsCount).toFixed(1)
    : "0.0";

  // Star counts breakdown for progress bars
  const starCounts = [0, 0, 0, 0, 0]; // index 0 = 1 star, ..., index 4 = 5 stars
  combinedReviews.forEach(r => {
    const ratingIndex = Math.min(5, Math.max(1, Math.round(r.rating))) - 1;
    starCounts[ratingIndex]++;
  });

  const [submittingReview, setSubmittingReview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleAddReviewSubmit = async (e) => {
    e.preventDefault();
    
    // Check if sgitoken exists
    const token = localStorage.getItem("sgitoken") || localStorage.getItem("sgiToken");
    if (!token) {
      showToast(translations.loginToReview || "Please log in first to submit a review.", "error");
      return;
    }

    if (!newReviewComment.trim() || newReviewRating === 0) {
      showToast(translations.reviewValidation || "Please fill out all fields and select a rating.", "error");
      return;
    }

    setSubmittingReview(true);

    try {
      const authHeader = token.startsWith("sgiQ") ? token : `sgiQ${token}`;
      const productId = productDetails?._id || id;
      const response = await fetch(`https://sgi-dy1p.onrender.com/api/v1/product/rate/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "authorization": authHeader
        },
        body: JSON.stringify({
          numberOfStar: newReviewRating,
          review: newReviewComment
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Close the add review modal
        setShowModal(false);
        
        // Reset form inputs
        setNewReviewComment("");
        setNewReviewRating(0);
        setNewReviewHoverRating(0);

        // Show success modal overlay for 2 seconds
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2000);

        // Refresh product reviews and details
        getProductDetails();
      } else {
        showToast(result.message || "Failed to submit review", "error");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      showToast("An error occurred while submitting your review.", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getAvatarColor = (name) => {
    const colors = [
      "#3b82f6", "#10b981", "#f59e0b", "#ef4444", 
      "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

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
          <div className="product_rating_top">
            <div className="product_rating_top_stars">
              {Array.from({ length: 5 }).map((_, idx) => (
                <FaStar
                  key={idx}
                  style={{
                    color: idx < Math.round(Number(averageRating)) ? "rgba(255, 169, 13, 1)" : "#d1d5db",
                  }}
                />
              ))}
            </div>
            <span>
              ({averageRating} {translations.rating}) {totalReviewsCount} {translations.reviews}
            </span>
          </div>
          <h3>
             {getCurrentPrice()}{" "}{translations.aed}
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
                  {" "}
                  <span>
                    {translations.aed}
                    {((isInCart ? cartQty : qty) * getCurrentPrice()).toFixed(
                      2,
                    )}
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
            <div className="product_reviews_section">
              <div className="reviews_layout_grid">
                {/* Left side: Summary Card */}
                <div className="reviews_summary_card">
                  <h3>{translations.averageRating || "Average Rating"}</h3>
                  <div className="giant_rating_score">
                    <span className="score_num">{averageRating}</span>
                    <span className="score_out_of">/ 5</span>
                  </div>
                  
                  <div className="summary_stars">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <FaStar
                        key={idx}
                        style={{
                          color: idx < Math.round(Number(averageRating)) ? "rgba(255, 169, 13, 1)" : "#d1d5db",
                        }}
                      />
                    ))}
                  </div>
                  
                  <p className="total_reviews_label">
                    {translations.basedOn || "Based on"} {totalReviewsCount} {translations.productReviews || "reviews"}
                  </p>
                  
                  {/* Star breakdown */}
                  <div className="star_breakdown_list">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = starCounts[stars - 1] || 0;
                      const percentage = totalReviewsCount > 0 ? (count / totalReviewsCount) * 100 : 0;
                      return (
                        <div key={stars} className="breakdown_row">
                          <span className="star_label">
                            {stars} <FaStar style={{ color: "rgba(255, 169, 13, 1)", fontSize: "0.85rem", verticalAlign: "middle" }} />
                          </span>
                          <div className="progress_bar_wrapper">
                            <div 
                              className="progress_bar_fill" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="count_label">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                  
                  <button 
                    className="add_review_trigger_btn"
                    onClick={() => setShowModal(true)}
                  >
                    {translations.addReview || "Add a Review"}
                  </button>
                </div>

                {/* Right side: Review Cards List */}
                <div className="reviews_list_wrapper">
                  <h3 className="reviews_list_title">{translations.reviewsTitle || "Customer Reviews"}</h3>
                  
                  {combinedReviews.length === 0 ? (
                    <p className="no_reviews_placeholder">{translations.noReviewsYet || "No reviews yet."}</p>
                  ) : (
                    <>
                      <div className="reviews_cards_scroll_area">
                        {combinedReviews.slice(0, visibleReviewsCount).map((review) => {
                          const initials = review.name ? review.name.trim().charAt(0).toUpperCase() : "?";
                          const avatarBg = getAvatarColor(review.name || "");
                          return (
                            <div key={review.id} className="review_item_card">
                              <div className="review_card_header">
                                <div className="reviewer_avatar" style={{ backgroundColor: avatarBg }}>
                                  {initials}
                                </div>
                                <div className="reviewer_details">
                                  <div className="reviewer_meta">
                                    <span className="reviewer_name">{review.name}</span>
                                    <span className="review_date">{review.date}</span>
                                  </div>
                                  <div className="review_stars_row">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                      <FaStar
                                        key={idx}
                                        style={{
                                          color: idx < review.rating ? "rgba(255, 169, 13, 1)" : "#d1d5db",
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <p className="review_comment_text">{review.comment}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Expand controls */}
                      {totalReviewsCount > 3 && (
                        <div className="reviews_expand_controls">
                          {visibleReviewsCount < totalReviewsCount ? (
                            <button 
                              className="expand_btn"
                              onClick={() => setVisibleReviewsCount(prev => Math.min(totalReviewsCount, prev + 5))}
                            >
                              {translations.showMore || "Show More"}
                            </button>
                          ) : null}
                          
                          {visibleReviewsCount > 3 ? (
                            <button 
                              className="expand_btn outline"
                              onClick={() => setVisibleReviewsCount(3)}
                            >
                              {translations.showLess || "Show Less"}
                            </button>
                          ) : null}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="review_modal_overlay" onClick={() => setShowModal(false)}>
          <div className="review_modal_box" onClick={(e) => e.stopPropagation()}>
            <button className="modal_close_btn" onClick={() => setShowModal(false)}>&times;</button>
            <h2>{translations.writeReview || "Write a Review"}</h2>
            
            <form onSubmit={handleAddReviewSubmit} className="review_form">
              <div className="form_group">
                <label>{translations.yourRating || "Your Rating"}</label>
                <div className="interactive_stars_row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      className="star_select_btn"
                      onClick={() => setNewReviewRating(star)}
                      onMouseEnter={() => setNewReviewHoverRating(star)}
                      onMouseLeave={() => setNewReviewHoverRating(0)}
                    >
                      <FaStar
                        style={{
                          color: star <= (newReviewHoverRating || newReviewRating)
                            ? "rgba(255, 169, 13, 1)"
                            : "#d1d5db"
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>



              <div className="form_group">
                <label htmlFor="reviewer_comment">{translations.reviewComment || "Your Review"}</label>
                <textarea
                  id="reviewer_comment"
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder={translations.reviewComment || "Your Review"}
                  rows={4}
                  required
                ></textarea>
              </div>

              <div className="modal_actions">
                <button type="button" className="cancel_btn" onClick={() => setShowModal(false)} disabled={submittingReview}>
                  {translations.cancel || "Cancel"}
                </button>
                <button type="submit" className="submit_btn" disabled={submittingReview}>
                  {submittingReview ? (translations.submitting || "Submitting...") : (translations.submitReview || "Submit Review")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="review_success_overlay">
          <div className="review_success_box">
            <div className="success_checkmark">✓</div>
            <h2>{translations.reviewSuccessMessage || "Your review has been submitted successfully. Thank you!"}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProduct;
