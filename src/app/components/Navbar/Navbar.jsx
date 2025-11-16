"use client";
import React, { useState } from "react";
import "./Navbar.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faPhone,
  faUser,
  faHeart,
  faCartShopping,
  faBarsStaggered,
  faArrowRight,
  faXmark,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { CiSearch } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { RiShoppingBag3Line } from "react-icons/ri";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false); // ✅ جديد

  const categories = [
    {
      name: "Cleaning Supplies",
      sub: ["Detergents", "Mops & Buckets", "Brushes"],
    },
    {
      name: "Paper Products",
      sub: ["Tissues", "Paper Towels", "Napkins"],
    },
    {
      name: "Dispensers",
      sub: ["Soap Dispensers", "Towel Dispensers", "Sanitizer Stands"],
    },
  ];

  const toggleCategory = (index) => {
    setActiveCategory(activeCategory === index ? null : index);
  };

  return (
    <div className="navbar">
      {/* 🔸 Top Navbar */}
      <div className="top_navbar">
        <p>
          Premium Cleaning & Hygiene Products for Professionals{" "}
          <a href="#">shop now</a>
        </p>
        <p>Arabic</p>
      </div>

      {/* 🔸 Middle Navbar */}
      <div className="middle_navbar">
        <div className="mobile_menu_icon">
          <FontAwesomeIcon
            icon={faBarsStaggered}
            onClick={() => setMenuOpen(true)}
          />
          <a href="/fav">
            <FaRegHeart />
          </a>

          <a href="/profile">
            <FaRegUser />
          </a>

          <a href="/cart">
            <RiShoppingBag3Line />
          </a>
        </div>

        <div className="logo">
          <a href="/">
            <Image
              src="/images/logo-black.png"
              alt="logo"
              width={120}
              height={120}
            />
          </a>
        </div>

        <div className="search">
          <input type="text" placeholder="search" />
          <span>
            <CiSearch />
          </span>
        </div>

        <div className="phone_number">
          <FiPhone />

          <div>
            <p>Call Us</p>
            <span>1-800-555-1234</span>
          </div>
        </div>

        <div className="navbar_links">
          <a href="/fav">
            <FaRegHeart />
          </a>

          <a href="/profile">
            <FaRegUser />
          </a>

          <a href="/cart">
            <RiShoppingBag3Line />
          </a>
        </div>
      </div>

      {/* 🔸 Bottom Navbar (Desktop Only) */}
      <div className="menu desktop_menu">
        <div
          className="mega_menu_btn"
          onClick={() => setMegaMenuOpen(!megaMenuOpen)}
        >
          <FontAwesomeIcon icon={faBarsStaggered} />
          <span>Browse all categories</span>
        </div>

        <ul className="main_links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="/shop">Shop</a>
          </li>
          <li>
            <a href="#">Contact Us</a>
          </li>
        </ul>
        <div className="login_links">
          <a href="/login">Login</a>
          <span>
            <a href="/register">Sign Up</a>
          </span>
        </div>
        <div className="our_shop">
          <a href="/shop">
            Explore all products <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </div>
      </div>

      {/* ✅ Mega Menu Dropdown */}
      {megaMenuOpen && (
        <div className="mega_menu_dropdown">
          <div className="mega_menu_content">
            {categories.map((cat, index) => (
              <>
                <div key={index} className="mega_category">
                  <h4>{cat.name}</h4>
                  <ul>
                    {cat.sub.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                </div>
                <div className="mega_category">
                  <h4>{cat.name}</h4>
                  <ul>
                    {cat.sub.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                </div>
              </>
            ))}
          </div>
        </div>
      )}

      {/* 🔸 Mobile Menu Overlay */}
      <div className={`mobile_menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile_menu_header">
          <Image
            src="/images/logo-black.png"
            alt="logo"
            width={100}
            height={100}
          />

          <FontAwesomeIcon
            icon={faXmark}
            className="close_icon"
            onClick={() => setMenuOpen(false)}
          />
        </div>

        <div className="mobile_menu_links">
          <a href="/">Home</a>
          <a href="#">About</a>
          <a href="/shop">Shop</a>
          <a href="#">Contact Us</a>

          <div className="mobile_categories">
            <h3>Categories</h3>
            {categories.map((cat, index) => (
              <div key={index} className="category_item">
                <div
                  className="category_header"
                  onClick={() => toggleCategory(index)}
                >
                  <span>{cat.name}</span>
                  <FontAwesomeIcon icon={faChevronDown} />
                </div>
                {activeCategory === index && (
                  <ul className="subcategory_list">
                    {cat.sub.map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div className="mobile_actions">
            <a href="/login">Login</a>
            <a href="/register" className="signup_btn">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
