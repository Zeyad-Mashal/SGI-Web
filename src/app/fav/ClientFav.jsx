"use client";
import React, { useState } from "react";
import "./fav.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from "next/image";
import { MdErrorOutline } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { RiShoppingBag3Line } from "react-icons/ri";
import { TbHeartBroken } from "react-icons/tb";

const ClientFav = () => {
  const [favContent, setFavContent] = useState(true);
  const [emptyFav, setEmptyFav] = useState(false);
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

          <a href="/shop" className="empty-fav-btn">
            Browse Products
          </a>
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
              <p>3 Products saved for later</p>
            </div>
            <div className="fav_title_bnts">
              <button
                onClick={() => {
                  setEmptyFav(true);
                  setFavContent(false);
                }}
              >
                <RiDeleteBin6Line />
                Clear All
              </button>
            </div>
          </div>
          <div className="fav_list">
            <div className="fav_item">
              <Image
                src={"/images/p1.png"}
                alt="favourite product image"
                width={120}
                height={120}
              />
              <div className="fav_item_content">
                <div className="fav_content_left">
                  <span>Floor Care</span>
                  <h2>White Spot Concentrated Lemon</h2>
                  <div className="left_price">
                    <p>
                      $100 <span>per unit</span>
                    </p>
                    <h4>
                      <MdErrorOutline />
                      Min. Order : 30 Units
                    </h4>
                  </div>
                </div>
                <div className="fav_item_right">
                  <FaHeart />
                  <div className="fav_right_btns">
                    <button>
                      <IoEyeOutline />
                      View
                    </button>
                    <button>
                      <RiShoppingBag3Line />
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="fav_item">
              <Image
                src={"/images/p1.png"}
                alt="favourite product image"
                width={120}
                height={120}
              />
              <div className="fav_item_content">
                <div className="fav_content_left">
                  <span>Floor Care</span>
                  <h2>White Spot Concentrated Lemon</h2>
                  <div className="left_price">
                    <p>
                      $100 <span>per unit</span>
                    </p>
                    <h4>
                      <MdErrorOutline />
                      Min. Order : 30 Units
                    </h4>
                  </div>
                </div>
                <div className="fav_item_right">
                  <FaHeart />
                  <div className="fav_right_btns">
                    <button>
                      <IoEyeOutline />
                      View
                    </button>
                    <button>
                      <RiShoppingBag3Line />
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="fav_item">
              <Image
                src={"/images/p1.png"}
                alt="favourite product image"
                width={120}
                height={120}
              />
              <div className="fav_item_content">
                <div className="fav_content_left">
                  <span>Floor Care</span>
                  <h2>White Spot Concentrated Lemon</h2>
                  <div className="left_price">
                    <p>
                      $100 <span>per unit</span>
                    </p>
                    <h4>
                      <MdErrorOutline />
                      Min. Order : 30 Units
                    </h4>
                  </div>
                </div>
                <div className="fav_item_right">
                  <FaHeart />
                  <div className="fav_right_btns">
                    <button>
                      <IoEyeOutline />
                      View
                    </button>
                    <button>
                      <RiShoppingBag3Line />
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default ClientFav;
