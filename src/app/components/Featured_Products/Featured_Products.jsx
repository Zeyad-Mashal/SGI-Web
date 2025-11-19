"use client";
import React, { useRef } from "react";
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
const Featured_Products = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const Featured_Products = [
    { img: "/images/brand1.png", products: 145 },
    { img: "/images/brand2.png", products: 210 },
    { img: "/images/brand3.png", products: 98 },
    { img: "/images/brand4.png", products: 120 },
    { img: "/images/brand4.png", products: 120 },
    { img: "/images/brand5.png", products: 75 },
    { img: "/images/brand5.png", products: 75 },
    { img: "/images/brand1.png", products: 75 },
  ];

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

        <Swiper
          modules={[Navigation, Autoplay]}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          // autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={10}
          loop={true}
          breakpoints={{
            320: { slidesPerView: 1.5 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1400: { slidesPerView: 5 },
          }}
          className="Featured_Products_swiper"
        >
          {Featured_Products.map((brand, index) => (
            <SwiperSlide key={index}>
              <div className="Featured_card">
                <a href="/product">
                  <div className="Featured_img">
                    <FontAwesomeIcon icon={faHeart} />
                    <p>Featured</p>
                  </div>
                  <h2>White Spot Concentrated Lemon</h2>
                  <div className="Featured_stars">
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <FontAwesomeIcon icon={faStar} />
                    <p>(230 reviews) (m.order 30 units)</p>
                  </div>
                </a>

                <div className="Featured_price">
                  <h3>$25.00</h3>
                  <button>Add to Cart</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Featured_Products;
