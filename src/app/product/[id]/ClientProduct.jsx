"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./product.css";
import { FaStar } from "react-icons/fa";
import { RiShoppingBag3Line } from "react-icons/ri";
import { FaRegHeart } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useParams } from "next/navigation";
import ProductDetails from "@/API/Products/ProductDetails";
import { addToCart } from "@/utils/cartUtils";
import { useToast } from "@/context/ToastContext";
const ClientProduct = () => {
  const { showToast } = useToast();
  const { id } = useParams();
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
    if (!productDetails?.picUrls) return;

    const imgs = productDetails.picUrls;
    const currentIndex = imgs.indexOf(activeImg);
    const nextIndex = (currentIndex + 1) % imgs.length;
    setActiveImg(imgs[nextIndex]);
  };

  const goPrev = () => {
    if (!productDetails?.picUrls) return;

    const imgs = productDetails.picUrls;
    const currentIndex = imgs.indexOf(activeImg);
    const prevIndex = (currentIndex - 1 + imgs.length) % imgs.length;
    setActiveImg(imgs[prevIndex]);
  };

  useEffect(() => {
    getProductDetails();
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const getProductDetails = () => {
    ProductDetails(setProductDetails, setError, setLoading, id);
  };
  useEffect(() => {
    if (productDetails?.picUrls?.length > 0) {
      setActiveImg(productDetails.picUrls[0]);
    }
  }, [productDetails]);

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
            src={activeImg ? activeImg : "/images/empty_product.png"}
            alt="product image"
            loading="lazy"
            width={390}
            height={390}
            className="main_image"
          />

          {/* Small images */}
          <div className="product_subimgs">
            {productDetails?.picUrls?.length > 0 &&
              productDetails.picUrls.map((img, index) => (
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
          {/* <span>{productDetails?.categories[0]}</span> */}
          <h1>{productDetails.name}</h1>
          <p>
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <span>(4.5 Rating) 150+ Reviews</span>
          </p>
          <h3>
            AED {productDetails.price} <span>per unit</span>
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
                  Total: <span>AED {(qty * (productDetails.price || 0)).toFixed(2)}</span>
                </h2>
              </div>
            </div>
          </div>

          <div className="product_btns">
            <button
              onClick={() => {
                if (productDetails && productDetails._id) {
                  addToCart(productDetails, qty);
                  showToast("Product added to cart!", "success");
                }
              }}
            >
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

          {/* <button
            className={activeTab === "specs" ? "active" : ""}
            onClick={() => setActiveTab("specs")}
          >
            Specifications
          </button> */}

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
              <p>{productDetails.description}</p>
              <h2>Major Product Uses:</h2>
              <ul>
                <li>{productDetails.uses}</li>
              </ul>
              <h2>Ideal For:</h2>
              <ul>
                <li>{productDetails.features}</li>
              </ul>
            </div>
          )}

          {/* {activeTab === "specs" && (
            <div className="product_desc_description">
              <h2>Specifications</h2>
              <ul>
                <li>Weight: 1L</li>
                <li>Material: Organic compound</li>
                <li>PH Level: 7.0</li>
                <li>Made in: USA</li>
              </ul>
            </div>
          )} */}

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
