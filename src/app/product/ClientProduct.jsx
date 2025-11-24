"use client";
import React, { useState } from "react";
import Image from "next/image";
import "./product.css";
import { FaStar } from "react-icons/fa";
import { RiShoppingBag3Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ClientProduct = () => {
  const price = 100;
  const [qty, setQty] = useState(1);

  const images = ["/images/p1.png", "/images/p2.png", "/images/p3.png"];

  const [activeImg, setActiveImg] = useState(images[0]);
  const updateQty = (value) => {
    const num = Math.max(0, Number(value));
    setQty(num);
  };

  const [activeTab, setActiveTab] = useState("description");

  // Slider arrows
  const goNext = () => {
    const currentIndex = images.indexOf(activeImg);
    const nextIndex = (currentIndex + 1) % images.length;
    setActiveImg(images[nextIndex]);
  };

  const goPrev = () => {
    const currentIndex = images.indexOf(activeImg);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setActiveImg(images[prevIndex]);
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
          <Image
            src={activeImg}
            alt="product image"
            loading="lazy"
            width={390}
            height={390}
            className="main_image"
          />

          {/* Small images */}
          <div className="product_subimgs">
            {images.map((img, index) => (
              <div
                key={index}
                className={`subimg_box ${
                  activeImg === img ? "active_subimg" : ""
                }`}
                onClick={() => setActiveImg(img)}
              >
                <Image
                  src={img}
                  alt="product"
                  width={130}
                  height={130}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="product_content">
          <span>Laundry & Dryclean</span>
          <h1>Crystal Brite Laundry Sour</h1>
          <p>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <span>(4.5 Rating) 150+ Reviews</span>
          </p>
          <h3>
            $ 44 <span>per unit</span>
          </h3>
          <h4>Minimum Order: 30 units / case</h4>
          <h5>
            Review our Refund & Exchange Policy before purchasing{" "}
            <a href="#">Learn more</a>
          </h5>

          <div className="Quantity">
            <h3>Quantity</h3>
            <div className="Quantity_counter">
              <div className="counter">
                <button onClick={() => updateQty(qty - 1)}>-</button>
                <input
                  type="text"
                  value={qty}
                  onChange={(e) => updateQty(e.target.value)}
                />
                <button onClick={() => updateQty(qty + 1)}>+</button>
              </div>

              <div className="total">
                <h2>
                  {" "}
                  Total: <span>${(qty * price).toFixed(2)}</span>
                </h2>
              </div>
            </div>
          </div>

          <div className="product_btns">
            <button>
              <RiShoppingBag3Line /> Add To Cart
            </button>
            <FaRegHeart />
          </div>
        </div>
      </div>

      <div className="product_desc">
        <div className="product_desc_btns">
          <button
            className={activeTab === "description" ? "active" : ""}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>

          <button
            className={activeTab === "specs" ? "active" : ""}
            onClick={() => setActiveTab("specs")}
          >
            Specifications
          </button>

          <button
            className={activeTab === "reviews" ? "active" : ""}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        <div className="product_desc_content">
          {activeTab === "description" && (
            <div className="product_desc_description">
              <h2>Product Description</h2>
              <p>
                Final-rinse sour formulated to neutralize residual alkalinity
                from detergents, preventing fabric yellowing and damage.
              </p>
              <h2>Major Product Uses:</h2>
              <ul>
                <li>prevent yellowing and fibre damage.</li>
                <li>improve finishing and maintain fabric whiteness.</li>
                <li>neutralize wash alkalinity.</li>
              </ul>
              <h2>Ideal For:</h2>
              <ul>
                <li>Hotels</li>
                <li>Offices</li>
                <li>Healthcare</li>
                <li>Schools</li>
                <li>Restaurants</li>
              </ul>
            </div>
          )}

          {activeTab === "specs" && (
            <div className="product_desc_description">
              <h2>Specifications</h2>
              <ul>
                <li>Weight: 1L</li>
                <li>Material: Organic compound</li>
                <li>PH Level: 7.0</li>
                <li>Made in: USA</li>
              </ul>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="product_desc_description">
              <h2>Reviews</h2>
              <p>No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientProduct;
