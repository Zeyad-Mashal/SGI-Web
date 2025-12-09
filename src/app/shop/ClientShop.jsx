"use client";
import { useEffect, useState } from "react";
import { MdOutlineSettingsInputComponent } from "react-icons/md";
import { FiBox, FiFilter } from "react-icons/fi";
import { TbAlignBoxRightMiddle } from "react-icons/tb";
import { AiOutlineBars } from "react-icons/ai";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faHeart as faHeartSolid,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import "./shop.css";
import { IoMdClose } from "react-icons/io";
import GetProducts from "@/API/Products/GetProducts";
import Image from "next/image";
import { addToCart } from "@/utils/cartUtils";
import { useToast } from "@/context/ToastContext";
import {
  toggleFavorite,
  isFavorited,
  getFavorites,
} from "@/utils/favoriteUtils";
export default function Shop() {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    getAllProducts();
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
  const [showFilter, setShowFilter] = useState(false);
  const [showDesktopFilter, setShowDesktopFilter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const getAllProducts = () => {
    GetProducts(setAllProducts, setError, setLoading);
  };
  return (
    <div className="shop">
      <div
        className={`shop_container ${!showDesktopFilter ? "full_width" : ""}`}
      >
        {/* FILTER SIDEBAR */}
        <div
          className={`shop_filter ${showFilter ? "show_mobile_filter" : ""}`}
        >
          {showFilter === true ? (
            <div className="close_filter">
              <IoMdClose onClick={() => setShowFilter(false)} />
            </div>
          ) : (
            ""
          )}
          <div className="filter_top">
            <h2>
              <MdOutlineSettingsInputComponent /> Filters
            </h2>
            <input type="text" placeholder="Search Products" />
            <label>
              <span>
                <FiBox />
                In Stock Only
              </span>
              <input type="checkbox" />
            </label>
          </div>
          <div className="filter_top">
            <h2>
              <MdOutlineSettingsInputComponent /> Filters
            </h2>
            <input type="text" placeholder="Search Products" />
            <label>
              <span>
                <FiBox />
                In Stock Only
              </span>
              <input type="checkbox" />
            </label>
          </div>
          <div className="filter_top">
            <h2>
              <MdOutlineSettingsInputComponent /> Filters
            </h2>
            <input type="text" placeholder="Search Products" />
            <label>
              <span>
                <FiBox />
                In Stock Only
              </span>
              <input type="checkbox" />
            </label>
          </div>
        </div>

        {/* SHOP CONTENT */}
        <div className="shop_content">
          <div className="shop_filter_top">
            <h3
              onClick={() => {
                if (window.innerWidth <= 991) {
                  // موبايل
                  setShowFilter(!showFilter);
                } else {
                  // ديسكتوب
                  setShowDesktopFilter(!showDesktopFilter);
                }
              }}
            >
              <FiFilter />
              Filters
            </h3>

            <p>
              <span>{allProducts.length}</span> products found
            </p>
            <select>
              <option value="Most Popular">Most Popular</option>
              <option value="Most Popular">Most Popular</option>
              <option value="Most Popular">Most Popular</option>
              <option value="Most Popular">Most Popular</option>
            </select>
            <div className="shop_display">
              <TbAlignBoxRightMiddle className="flex-display" />
              <AiOutlineBars className="grid-display" />
            </div>
          </div>

          <div className="shop_list">
            {/* CARD 1 */}
            {loading ? (
              <div className="loader_container">
                <span className="loader"></span>
                <span className="loader"></span>
                <span className="loader"></span>
                <span className="loader"></span>
                <span className="loader"></span>
                <span className="loader"></span>
              </div>
            ) : (
              allProducts.map((item) => {
                return (
                  <div className="Featured_card" key={item._id}>
                    <a href={`/product/${item._id}`}>
                      <div className="Featured_img">
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
                        <FontAwesomeIcon
                          icon={isFavorited(item._id) ? faHeartSolid : faHeart}
                          className={`heart-icon ${
                            isFavorited(item._id) ? "favorited" : ""
                          }`}
                          onClick={(e) => handleFavoriteClick(e, item)}
                          style={{
                            color: isFavorited(item._id)
                              ? "#ef4444"
                              : "inherit",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            transform: isFavorited(item._id)
                              ? "scale(1.2)"
                              : "scale(1)",
                          }}
                        />
                        <p>Featured</p>
                      </div>
                      <h2>{item.name}</h2>
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
                      <h3>AED {item.price}</h3>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(item, 1);
                          showToast("Product added to cart!", "success");
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
