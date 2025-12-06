"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Brands.css";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import GetAllBrands from "@/API/Brands/GetAllBrands";
// import { Skeleton } from "@heroui/skeleton";
import { Card, Skeleton } from "@heroui/react";

const Brands = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  useEffect(() => {
    getAllBrands();
  }, []);
  const [allBrands, setAllBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const getAllBrands = () => {
    GetAllBrands(setAllBrands, setError, setLoading);
  };
  const brands = [
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
    <div className="Brands">
      <div className="barnds_container">
        <div className="brands_header">
          <div className="brands_header_title">
            <span>Brands</span>
            <h1>Browse By brand</h1>
          </div>

          {/* أزرار التنقل */}
          <div className="brands_nav_buttons">
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
          spaceBetween={20}
          loop={true}
          breakpoints={{
            320: { slidesPerView: 2.5 },
            480: { slidesPerView: 3 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
            1401: { slidesPerView: 5 },
          }}
          className="brands_swiper"
        >
          {loading
            ? "loading ..."
            : allBrands.map((brand) => (
                <SwiperSlide key={brand._id}>
                  <div className="brand_card">
                    <Image
                      src={brand.logo}
                      alt="brand image"
                      loading="lazy"
                      width={224}
                      height={60}
                    />
                    <span>{brand.name}</span>
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Brands;
