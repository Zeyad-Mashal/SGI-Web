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
import { MdKeyboardArrowRight } from "react-icons/md";
import GetProducts from "@/API/Products/GetProducts";
const Our_Products = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  useEffect(() => {
    getAllProducts();
  }, []);
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
            <span>Our Products</span>
            <h1>Explore Our Products</h1>
          </div>
          <a href="/shop">
            View All <MdKeyboardArrowRight />
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
                        width={150}
                        height={150}
                        loading="lazy"
                      />
                      <FontAwesomeIcon icon={faHeart} />
                      <p>Featured</p>
                    </div>
                    <h2>{item.name}</h2>
                    <div className="Our_Products_stars">
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <p>(230 reviews)</p>
                    </div>
                    <div className="Our_Products_price">
                      <h3>AED {item.price}</h3>
                      <button>Add to Cart</button>
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
