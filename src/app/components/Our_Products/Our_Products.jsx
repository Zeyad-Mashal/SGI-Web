"use client";
import React, { useRef } from "react";
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
import { MdKeyboardArrowRight } from "react-icons/md";

const Our_Products = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const Our_Products = [
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
    <div className="Our_Products">
      <div className="our_products_container">
        <div className="Our_Products_header">
          <div className="Our_Products_header_title">
            <span>Our Products</span>
            <h1>Explore Our Products</h1>
          </div>
          <a href="/shop">
            View All <MdKeyboardArrowRight />
          </a>
        </div>
        <div className="Our_Products_list">
          <div className="Our_Products_item">
            <div className="Our_Products_img">
              <FontAwesomeIcon icon={faHeart} />
              <p>Featured</p>
            </div>
            <h2>White Spot Concentrated Lemon</h2>
            <div className="Our_Products_stars">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <p>(230 reviews)</p>
            </div>
            <div className="Our_Products_price">
              <h3>$25.00</h3>
              <button>Add to Cart</button>
            </div>
          </div>
          <div className="Our_Products_item">
            <div className="Our_Products_img">
              <FontAwesomeIcon icon={faHeart} />
              <p>Featured</p>
            </div>
            <h2>White Spot Concentrated Lemon</h2>
            <div className="Our_Products_stars">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <p>(230 reviews)</p>
            </div>
            <div className="Our_Products_price">
              <h3>$25.00</h3>
              <button>Add to Cart</button>
            </div>
          </div>
          <div className="Our_Products_item">
            <div className="Our_Products_img">
              <FontAwesomeIcon icon={faHeart} />
              <p>Featured</p>
            </div>
            <h2>White Spot Concentrated Lemon</h2>
            <div className="Our_Products_stars">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <p>(230 reviews)</p>
            </div>
            <div className="Our_Products_price">
              <h3>$25.00</h3>
              <button>Add to Cart</button>
            </div>
          </div>
          <div className="Our_Products_item">
            <div className="Our_Products_img">
              <FontAwesomeIcon icon={faHeart} />
              <p>Featured</p>
            </div>
            <h2>White Spot Concentrated Lemon</h2>
            <div className="Our_Products_stars">
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <FontAwesomeIcon icon={faStar} />
              <p>(230 reviews)</p>
            </div>
            <div className="Our_Products_price">
              <h3>$25.00</h3>
              <button>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Our_Products;
