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
import { useRouter } from "next/navigation";
import en from "../../../translation/en.json";
import ar from "../../../translation/ar.json";
const Brands = () => {
  const router = useRouter();
  const [translations, setTranslations] = useState(en);
  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    if (lang === "ar") {
      setTranslations(ar);
    } else {
      setTranslations(en);
    }
  }, []);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  useEffect(() => {
    getAllBrands();
  }, []);
  const [allBrands, setAllBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // العلامات التجارية المسموح بها فقط
  const allowedBrands = ["Cleenol", "INDUQUIM", "SEITZ", "THERMO","WRGHTS", "RULOPK", "SPELCO"];
  
  const getAllBrands = () => {
    GetAllBrands((brands) => {
      // تصفية العلامات التجارية لعرض فقط المسموح بها
      const filteredBrands = brands.filter((brand) => {
        if (!brand.name) return false;
        const brandName = brand.name.trim().toUpperCase();
        return allowedBrands.some((allowedBrand) => 
          brandName === allowedBrand.toUpperCase()
        );
      });
      setAllBrands(filteredBrands);
    }, setError, setLoading);
  };

  return (
    <div className="Brands">
      <div className="barnds_container">
        <div className="brands_header">
          <div className="brands_header_title">
            <span>{translations.brands}</span>
            <h1>{translations.browsebybrand}</h1>
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
            {allBrands.map((brand) => (
              <SwiperSlide key={brand._id}>
                <div 
                  className="brand_card"
                  onClick={() => {
                    router.push(`/shop?brand=${brand._id}`);
                  }}
                  style={{ cursor: "pointer" }}
                >
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
        )}
      </div>
    </div>
  );
};

export default Brands;
