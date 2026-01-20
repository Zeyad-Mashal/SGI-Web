"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "./product.css";
import { FaStar } from "react-icons/fa";
import { RiShoppingBag3Line } from "react-icons/ri";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useParams } from "next/navigation";
import ProductDetails from "@/API/Products/ProductDetails";
import { addToCart } from "@/utils/cartUtils";
import { useToast } from "@/context/ToastContext";
import {
  toggleFavorite,
  isFavorited,
  getFavorites,
} from "@/utils/favoriteUtils";
const ClientProduct = () => {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState([]);
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [useBoxPrice, setUseBoxPrice] = useState(false);

  const images = ["/images/p1.png", "/images/p2.png", "/images/p3.png"];

  const [activeImg, setActiveImg] = useState(images[0]);
  const updateQty = (value) => {
    const num = Math.max(0, Number(value));
    setQty(num);
  };

  const handleBoxClick = () => {
    const boxPrice = Number(productDetails?.boxPrice);
    const piecesNumber = Number(productDetails?.piecesNumber);
    
    if (productDetails?.boxPrice !== null &&
        productDetails?.boxPrice !== undefined &&
        productDetails?.boxPrice !== "" &&
        !isNaN(boxPrice) &&
        boxPrice > 0 &&
        productDetails?.piecesNumber !== null &&
        productDetails?.piecesNumber !== undefined &&
        productDetails?.piecesNumber !== "" &&
        !isNaN(piecesNumber) &&
        piecesNumber > 0) {
      if (useBoxPrice) {
        // Switch back to unit pricing
        setUseBoxPrice(false);
        setQty(1);
        showToast("Switched to unit pricing", "info");
      } else {
        // Switch to box pricing - quantity represents number of boxes
        setUseBoxPrice(true);
        setQty(1); // Start with 1 box, user can increase
        showToast("Box pricing applied!", "success");
      }
    }
  };

  // Get current price (box price if selected, otherwise regular price)
  const getCurrentPrice = () => {
    const boxPrice = Number(productDetails?.boxPrice);
    if (useBoxPrice && 
        productDetails?.boxPrice !== null &&
        productDetails?.boxPrice !== undefined &&
        productDetails?.boxPrice !== "" &&
        !isNaN(boxPrice) &&
        boxPrice > 0) {
      return boxPrice;
    }
    return productDetails?.price || 0;
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
  const [productDetails, setProductDetails] = useState([]);

  useEffect(() => {
    getProductDetails();
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    setFavorites(getFavorites());
  }, [productDetails]);

  const handleFavoriteClick = () => {
    if (productDetails && productDetails._id) {
      const wasFavorited = isFavorited(productDetails._id);
      const updatedFavorites = toggleFavorite(productDetails);
      setFavorites(updatedFavorites);
      if (wasFavorited) {
        showToast("Removed from favorites", "info");
      } else {
        showToast("Added to favorites!", "success");
      }
    }
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
            AED {getCurrentPrice()}{" "}
            <span>{useBoxPrice ? "per box" : "per unit"}</span>
          </h3>
          <h4>Minimum Order: 30 units / case</h4>
          <h5>
            Review our Refund & Exchange Policy before purchasing{" "}
            <a href="#">Learn more</a>
          </h5>
          {productDetails?.boxPrice !== null &&
           productDetails?.boxPrice !== undefined &&
           productDetails?.boxPrice !== "" &&
           Number(productDetails?.boxPrice) > 0 &&
           productDetails?.piecesNumber !== null &&
           productDetails?.piecesNumber !== undefined &&
           productDetails?.piecesNumber !== "" &&
           Number(productDetails?.piecesNumber) > 0 && (
            <h4
              onClick={handleBoxClick}
              // style={{
              //   cursor: "pointer",
              //   color: useBoxPrice ? "#4caf50" : "inherit",
              //   fontWeight: useBoxPrice ? "bold" : "normal",
              //   textDecoration: useBoxPrice ? "underline" : "none",
              //   userSelect: "none",
              // }}
              className="boxItem"
            >
              Review Box Available{" "}
              {useBoxPrice && `(${productDetails.piecesNumber} pieces per box)`}{" "}
              {useBoxPrice && "✓"}
            </h4>
          )}

          <div className="Quantity">
            <h3>Quantity {useBoxPrice ? "(Boxes)" : "(Units)"}</h3>
            <div className="Quantity_counter">
              <div className="counter">
                <button onClick={() => updateQty(Math.max(1, qty - 1))}>
                  -
                </button>
                <input
                  type="text"
                  value={qty}
                  onChange={(e) => updateQty(e.target.value)}
                />
                <button onClick={() => updateQty(qty + 1)}>+</button>
              </div>

              <div className="total">
                <h2>
                  Total: <span>AED {(qty * getCurrentPrice()).toFixed(2)}</span>
                </h2>
                {useBoxPrice && productDetails?.piecesNumber && (
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#666",
                      marginTop: "0.5rem",
                    }}
                  >
                    ({qty} box(es) × {productDetails.piecesNumber} pieces ={" "}
                    {qty * productDetails.piecesNumber} total pieces)
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="product_btns">
            <button
              onClick={() => {
                if (productDetails && productDetails._id) {
                  // Create a modified product object with the current price
                  // If box pricing, use boxPrice and quantity represents boxes
                  // If unit pricing, use regular price and quantity represents units
                  const productToAdd = {
                    ...productDetails,
                    price: getCurrentPrice(),
                    // Store pricing mode info for cart
                    isBoxPricing: useBoxPrice,
                    piecesPerBox: useBoxPrice
                      ? productDetails.piecesNumber
                      : undefined,
                  };
                  addToCart(productToAdd, qty);
                  const message = useBoxPrice
                    ? `${qty} box(es) added to cart! (${
                        qty * productDetails.piecesNumber
                      } pieces)`
                    : "Product added to cart!";
                  showToast(message, "success");
                }
              }}
            >
              <RiShoppingBag3Line /> Add To Cart
            </button>
            {productDetails && productDetails._id && (
              <div
                onClick={handleFavoriteClick}
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: isFavorited(productDetails._id)
                    ? "scale(1.2)"
                    : "scale(1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className={`heart-icon ${
                  isFavorited(productDetails._id) ? "favorited" : ""
                }`}
              >
                {isFavorited(productDetails._id) ? (
                  <FaHeart style={{ color: "#ef4444", fontSize: "24px" }} />
                ) : (
                  <FaRegHeart style={{ fontSize: "24px" }} />
                )}
              </div>
            )}
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
