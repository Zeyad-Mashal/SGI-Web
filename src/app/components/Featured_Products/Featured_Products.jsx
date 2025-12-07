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
import GetFeaturedProducts from "@/API/Products/GetFeaturedProducts";
const Featured_Products = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  useEffect(() => {
    getFeaturedProduct();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const getFeaturedProduct = () => {
    GetFeaturedProducts(setAllProducts, setError, setLoading);
  };
  return (
    <div className="Featured_Products">
      <div className="Featured_Products_container">
        <div className="Featured_Products_header">
          <div className="Featured_Products_header_title">
            <span>Today’s</span>
            <h1>Featured Products</h1>
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
                  <a href="/product">
                    <div className="Featured_img">
                      <Image
                        src={item.picUrls?.[0] || "/images/empty_product.png"}
                        alt="product image"
                        width={150}
                        height={150}
                        loading="lazy"
                      />
                      <FontAwesomeIcon icon={faHeart} />
                      <p>Featured</p>
                    </div>

                    <h2>{item.name}</h2>

                    <div className="Featured_stars">
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <p>(230 reviews)</p>
                    </div>
                  </a>

                  <div className="Featured_price">
                    <h3>AED {item.price}</h3>
                    <button>Add to Cart</button>
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
