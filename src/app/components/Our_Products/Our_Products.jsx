"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Our_Products.css";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faStar,
  faMinus,
  faTrashAlt,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { MdKeyboardArrowRight } from "react-icons/md";
import GetProducts from "@/API/Products/GetProducts";
import {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeFromCart,
} from "@/utils/cartUtils";
import { useToast } from "@/context/ToastContext";
import {
  toggleFavorite,
  isFavorited,
  getFavorites,
} from "@/utils/favoriteUtils";
import en from "../../../translation/en.json";
import ar from "../../../translation/ar.json";
const Our_Products = ({ initialProducts = [] }) => {
  const [translations, setTranslations] = useState(en);
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    if (lang === "ar") {
      setTranslations(ar);
    } else {
      setTranslations(en);
    }
  }, []);
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  useEffect(() => {
    getAllProducts();
    setFavorites(getFavorites());
    setCart(getCart());
  }, []);
  useEffect(() => {
    const refreshCart = () => setCart(getCart());
    window.addEventListener("focus", refreshCart);
    window.addEventListener("storage", refreshCart);
    return () => {
      window.removeEventListener("focus", refreshCart);
      window.removeEventListener("storage", refreshCart);
    };
  }, []);
  const getCartQty = (productId) =>
    cart.find((i) => i._id === productId)?.quantity ?? 0;
  const handleAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item, 1);
    setCart(getCart());
    showToast("Product added to cart!", "success");
  };
  const handleUpdateQty = (e, productId, newQty) => {
    e.preventDefault();
    e.stopPropagation();
    if (newQty < 1) {
      removeFromCart(productId);
      showToast("Removed from cart", "info");
    } else {
      updateCartItemQuantity(productId, newQty);
    }
    setCart(getCart());
  };
  const handleRemoveFromCart = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromCart(productId);
    setCart(getCart());
    showToast("Removed from cart", "info");
  };

  const handleFavoriteClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const wasFavorited = isFavorited(item._id);
    const updatedFavorites = toggleFavorite(item);
    setFavorites(updatedFavorites);
    if (wasFavorited) {
      showToast("Removed from favorites", "info");
    } else {
      showToast("Added to favorites!", "success");
    }
  };
  const [allProducts, setAllProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getAllProducts = () => {
    GetProducts(
      setAllProducts,
      setError,
      setLoading,
      1,
      undefined,
      { skipLoadingIndicator: initialProducts.length > 0 },
    );
  };
  return (
    <div className="Our_Products">
      <div className="our_products_container">
        <div className="Our_Products_header">
          <div className="Our_Products_header_title">
            <span>{translations.ourproducts}</span>
            <h2>{translations.exploreourproducts}</h2>
          </div>
          <a href="/shop">
            {translations.viewall} <MdKeyboardArrowRight />
          </a>
        </div>
        <div className="Our_Products_list">
          {loading ? (
            <div className="loader_container">
              <span className="loader"></span>
              <span className="loader"></span>
              <span className="loader"></span>
              <span className="loader"></span>
              <span className="loader"></span>
              <span className="loader"></span>
              <span className="loader"></span>
            </div>
          ) : (
            allProducts.slice(0, 8).map((item) => {
              return (
                <div className="Our_Products_item" key={item._id}>
                  <a href={`/product/${item._id}`}>
                    <div className="ourProducts_img">
                      <Image
                        src={
                          item.picUrls && item.picUrls[0]
                            ? item.picUrls[0]
                            : "/images/empty_product.png"
                        }
                        alt="product image"
                        width={1000}
                        height={1000}
                        loading="lazy"
                      />
                      <FontAwesomeIcon
                        icon={isFavorited(item._id) ? faHeartSolid : faHeart}
                        className={`heart-icon ${
                          isFavorited(item._id) ? "favorited" : ""
                        }`}
                        onClick={(e) => handleFavoriteClick(e, item)}
                        style={{
                          color: isFavorited(item._id) ? "#ef4444" : "inherit",
                          cursor: "pointer",
                          transition: "all 0.3s ease",
                          transform: isFavorited(item._id)
                            ? "scale(1.2)"
                            : "scale(1)",
                        }}
                      />
                      <p>{translations.featured}</p>
                    </div>
                    <h2>{item.name}</h2>
                    {/* <div className="Our_Products_stars">
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <p>{translations.reviews} (230)</p>
                    </div> */}
                    <div className="Our_Products_price">
                      <h3>
                        {translations.aed} {item.price}
                      </h3>
                      {getCartQty(item._id) === 0 ? (
                        <button
                          className="Our_Products_add_btn"
                          onClick={(e) => handleAddToCart(e, item)}
                        >
                          {translations.addtocart}
                        </button>
                      ) : (
                        <div
                          className="Our_Products_cart_counter"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="Our_Products_counter_btn"
                            onClick={(e) =>
                              getCartQty(item._id) === 1
                                ? handleRemoveFromCart(e, item._id)
                                : handleUpdateQty(
                                    e,
                                    item._id,
                                    getCartQty(item._id) - 1
                                  )
                            }
                            aria-label={
                              getCartQty(item._id) === 1
                                ? "Remove"
                                : "Decrease"
                            }
                          >
                            <FontAwesomeIcon
                              icon={
                                getCartQty(item._id) === 1
                                  ? faTrashAlt
                                  : faMinus
                              }
                            />
                          </button>
                          <span className="Our_Products_counter_qty">
                            {getCartQty(item._id)}
                          </span>
                          <button
                            type="button"
                            className="Our_Products_counter_btn"
                            onClick={(e) =>
                              handleUpdateQty(
                                e,
                                item._id,
                                getCartQty(item._id) + 1
                              )
                            }
                            aria-label="Increase"
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </button>
                        </div>
                      )}
                    </div>
                  </a>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Our_Products;
