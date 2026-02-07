"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Featured_Products.css";
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
import GetFeaturedProducts from "@/API/Products/GetFeaturedProducts";
import { addToCart } from "@/utils/cartUtils";
import { useToast } from "@/context/ToastContext";
import {
  toggleFavorite,
  isFavorited,
  getFavorites,
} from "@/utils/favoriteUtils";
import en from "../../../translation/en.json";
import ar from "../../../translation/ar.json";
const Featured_Products = () => {
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
    getFeaturedProduct();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const getFeaturedProduct = () => {
    GetFeaturedProducts((products) => {
      // فلترة المنتجات لعرض فقط التي type = "featured"
      const featuredProducts = products.filter((product) => {
        const productType = product.type || product.Type || "";
        return productType.toLowerCase() === "featured";
      });
      setAllProducts(featuredProducts);
    }, setError, setLoading);
  };
  return (
    <div className="Featured_Products">
      <div className="Featured_Products_container">
        <div className="Featured_Products_header">
          <div className="Featured_Products_header_title">
            <span>{translations.todays}</span>
            <h1>{translations.featuredproducts}</h1>
          </div>

          {/* أزرار التنقل */}
          <div className="Featured_Products_nav_buttons">
            <button ref={prevRef} className="nav_btn">
              <FontAwesomeIcon icon={faArrowLeft} />
            </button>
            <button ref={nextRef} className="nav_btn">
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="loader_container">
            <span className="loader"></span>
            <span className="loader"></span>
            <span className="loader"></span>
            <span className="loader"></span>
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay]}
            onInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
              swiper.navigation.init();
              swiper.navigation.update();
            }}
            spaceBetween={10}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 2.25 },
              480: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 4 },
              1400: { slidesPerView: 5 },
            }}
            className="Featured_Products_swiper"
          >
            {allProducts.map((item) => (
              <SwiperSlide key={item._id}>
                <div className="Featured_card">
                  <a href={`/product/${item._id}`}>
                    <div className="Featured_img">
                      <Image
                        src={item.picUrls?.[0] || "/images/empty_product.png"}
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

                    {/* <div className="Featured_stars">
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <p>{translations.reviews} (230)</p>
                    </div> */}
                  </a>

                  <div className="Featured_price">
                    <h3>
                      {translations.aed} {item.price}
                    </h3>
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
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default Featured_Products;
