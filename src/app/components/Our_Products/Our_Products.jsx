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
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { MdKeyboardArrowRight } from "react-icons/md";
import GetProducts from "@/API/Products/GetProducts";
import { addToCart } from "@/utils/cartUtils";
import { useToast } from "@/context/ToastContext";
import {
  toggleFavorite,
  isFavorited,
  getFavorites,
} from "@/utils/favoriteUtils";
import en from "../../../translation/en.json";
import ar from "../../../translation/ar.json";
const Our_Products = () => {
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
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  useEffect(() => {
    getAllProducts();
    setFavorites(getFavorites());
  }, []);

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
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getAllProducts = () => {
    GetProducts(setAllProducts, setError, setLoading);
  };
  return (
    <div className="Our_Products">
      <div className="our_products_container">
        <div className="Our_Products_header">
          <div className="Our_Products_header_title">
            <span>{translations.ourproducts}</span>
            <h1>{translations.exploreourproducts}</h1>
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
            allProducts.slice(-8).map((item) => {
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
                    <div className="Our_Products_stars">
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <p>{translations.reviews} (230)</p>
                    </div>
                    <div className="Our_Products_price">
                      <h3>AED {item.price}</h3>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(item, 1);
                          showToast("Product added to cart!", "success");
                        }}
                      >
                        {translations.addtocart}
                      </button>
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
