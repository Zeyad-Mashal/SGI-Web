import React from "react";
import "./Banner.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import { navigate } from "next/dist/client/components/segment-cache-impl/navigation";
const Banner = () => {
  return (
    <div className="sgi-home-banner">
      <div className="sgi-home-banner_container">
        <div className="overlay"></div>
        <div className="banner_right">
          <span>Limited time offer </span>
          <h1>
            Professional Cleaning Solution <span>For Every Business</span>
          </h1>
          <p>
            Stock up on premium cleaning supplies at wholesale prices . perfect
            for hotels, restaurants, offices, healthcare facilities, and
            cleaning services companies .
          </p>
          <div className="banner_right_imgs">
            <Image
              src={"/images/banner1-removebg-preview.png"}
              width={150}
              height={150}
              alt="banner1"
              loading="lazy"
            />
            <Image
              src={"/images/banner2-removebg-preview.png"}
              width={150}
              height={150}
              alt="banner1"
              loading="lazy"
            />
          </div>
          <div className="banner_btns">
            <button className="banner_btn1">
              <a href="/shop">Shop Now</a>
            </button>
            <button className="banner_btn2">Contact Us</button>
          </div>
        </div>
        <div className="banner_left">
          <div className="banner_left_free">
            <p>Free shipping</p>
            <h3>+500$</h3>
          </div>
          <div className="banner_left_main">
            <p>
              <FontAwesomeIcon icon={faBolt} /> Exclusive Deal
            </p>
            <h1>Wholesale Benefits</h1>
            <span>Premium products at unbeatable prices</span>
            <div className="banner_left_main_products">
              <div className="banner_left_main_product">
                <Image
                  src={"/images/p1.png"}
                  alt="product banner"
                  loading="lazy"
                  width={150}
                  height={150}
                />
                <div className="banner_left_main_product_info">
                  <h3>Hand Sanitizer</h3>
                  <span>From 40$</span>
                </div>
              </div>
              <div className="banner_left_main_product">
                <Image
                  src={"/images/p1.png"}
                  alt="product banner"
                  loading="lazy"
                  width={150}
                  height={150}
                />
                <div className="banner_left_main_product_info">
                  <h3>Hand Sanitizer</h3>
                  <span>From 40$</span>
                </div>
              </div>
            </div>
            <hr />
            <div className="banner_left_main_stats">
              <div className="banner_left_main_stat">
                <h2>500+</h2>
                <span>Orders</span>
              </div>
              <div className="banner_left_main_stat">
                <h2>24h</h2>
                <span>Delivery</span>
              </div>
              <div className="banner_left_main_stat">
                <h2>100%</h2>
                <span>Quality</span>
              </div>
            </div>
          </div>

          <div className="banner_left_save">
            <p>Save</p>
            <h3>40%</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
