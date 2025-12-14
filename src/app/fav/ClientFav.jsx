"use client";
import React, { useState, useEffect } from "react";
import "./fav.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from "next/image";
import { MdErrorOutline } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { RiShoppingBag3Line } from "react-icons/ri";
import { TbHeartBroken } from "react-icons/tb";
import { useRouter } from "next/navigation";
import {
  getFavorites,
  removeFromFavorites,
  clearFavorites,
} from "@/utils/favoriteUtils";
import { addToCart } from "@/utils/cartUtils";
import { useToast } from "@/context/ToastContext";

const ClientFav = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    const favs = getFavorites();
    setFavorites(favs);
  };

  const handleRemoveFavorite = (productId) => {
    const updatedFavorites = removeFromFavorites(productId);
    setFavorites(updatedFavorites);
    showToast("Removed from favorites", "info");
    if (updatedFavorites.length === 0) {
      // Don't automatically show empty state, let user see the removal
    }
  };

  const handleClearAll = () => {
    clearFavorites();
    setFavorites([]);
    showToast("All favorites cleared", "info");
  };

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    showToast("Product added to cart!", "success");
  };

  if (!mounted) {
    return (
      <div className="fav">
        <div className="fav_title">
          <h1>My Favorites</h1>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const favContent = favorites.length > 0;
  const emptyFav = favorites.length === 0;
  return (
    <div className="fav">
      {emptyFav === true ? (
        <div className="empty-fav">
          <div className="empty-fav-icon">
            <TbHeartBroken />
          </div>

          <h2 className="empty-fav-title">Your Favorites is Empty</h2>

          <p className="empty-fav-subtitle">
            Looks like you haven’t added anything yet. Start exploring and save
            the items you love.
          </p>

          <button
            onClick={() => router.push("/shop")}
            className="empty-fav-btn"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Browse Products
          </button>
        </div>
      ) : (
        ""
      )}

      {favContent == true ? (
        <>
          {" "}
          <div className="fav_title">
            <div className="fav_title_info">
              <h1>My Favorites</h1>
              <p>
                {favorites.length} Product{favorites.length !== 1 ? "s" : ""}{" "}
                saved for later
              </p>
            </div>
            {favorites.length > 0 && (
              <div className="fav_title_bnts">
                <button onClick={handleClearAll}>
                  <RiDeleteBin6Line />
                  Clear All
                </button>
              </div>
            )}
          </div>
          <div className="fav_list">
            {favorites.map((item) => (
              <div className="fav_item" key={item._id}>
                <Image
                  src={
                    item.picUrls && item.picUrls[0]
                      ? item.picUrls[0]
                      : "/images/empty_product.png"
                  }
                  alt={item.name}
                  width={120}
                  height={120}
                />
                <div className="fav_item_content">
                  <div className="fav_content_left">
                    <span>
                      {item.categories && item.categories.length > 0
                        ? item.categories[0]
                        : "Product"}
                    </span>
                    <h2>{item.name}</h2>
                    <div className="left_price">
                      <p>
                        AED {item.price} <span>per unit</span>
                      </p>
                      <h4>
                        <MdErrorOutline />
                        Min. Order : 30 Units
                      </h4>
                    </div>
                  </div>
                  <div className="fav_item_right">
                    <FaHeart
                      onClick={() => handleRemoveFavorite(item._id)}
                      style={{
                        color: "#ef4444",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      className="heart-icon favorited"
                    />
                    <div className="fav_right_btns">
                      <button
                        onClick={() => router.push(`/product/${item._id}`)}
                      >
                        <IoEyeOutline />
                        View
                      </button>
                      <button onClick={() => handleAddToCart(item)}>
                        <RiShoppingBag3Line />
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ClientFav;
