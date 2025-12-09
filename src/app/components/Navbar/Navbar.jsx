"use client";
import React, { useState, useEffect } from "react";
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
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { CiSearch } from "react-icons/ci";
import { FiPhone } from "react-icons/fi";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { RiShoppingBag3Line } from "react-icons/ri";
import en from "../../../translation/en.json";
import ar from "../../../translation/ar.json";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeMainCategory, setActiveMainCategory] = useState(null);
  const [subPanelVisible, setSubPanelVisible] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
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
    {
      name: "Waste Management",
      sub: ["Trash Bags", "Recycling Bins", "Compost Supplies"],
    },
    {
      name: "Hygiene & Safety",
      sub: ["Gloves", "Masks", "Sanitizers"],
    },
    {
      name: "Facility Care",
      sub: ["Air Fresheners", "Floor Care", "Surface Care"],
    },
  ];

  const closeMegaMenu = () => {
    setMegaMenuOpen(false);
    setActiveMainCategory(null);
    setSubPanelVisible(false);
  };

  const openSubPanel = (index) => {
    setActiveMainCategory(index);
    setSubPanelVisible(true);
  };

  const handleBackToMain = () => {
    setSubPanelVisible(false);
    setActiveMainCategory(null);
  };

  const toggleCategory = (index) => {
    setActiveCategory(activeCategory === index ? null : index);
  };
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang");

    if (!savedLang) {
      localStorage.setItem("lang", "en");
      setLang("en");
    } else {
      setLang(savedLang);
    }
    if (savedLang === "ar") {
      setIsArabic(true);
    }
  }, []);
  // تغيير اللغه
  const toggleLang = () => {
    const newLang = lang === "en" ? "ar" : "en";
    setLang(newLang);
    localStorage.setItem("lang", newLang);
    window.location.reload();
  };

  // كود الترجمه في كل الصفحات
  const [translations, setTranslations] = useState(en);

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";

    if (lang === "ar") {
      setTranslations(ar);
    } else {
      setTranslations(en);
    }
  }, []);

  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchBox, setShowSearchBox] = useState(false); // 📱 للموبايل
  const products = [
    { id: 1, name: "Blue Mop" },
    { id: 2, name: "Large Tissue Box" },
    { id: 3, name: "Hand Soap" },
    { id: 4, name: "Microfiber Cloth" },
  ];
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.trim().length > 0) {
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="navbar">
      <div className="top_navbar">
        <p>
          {translations.navbartop} <a href="/shop">{translations.shopnow}</a>
        </p>
        <p onClick={toggleLang} className="lang_switch">
          {lang === "en" ? (
            <span>
              <Image
                src={"/images/united-arab-emirates.png"}
                alt="aue flag arabic lang"
                width={30}
                height={30}
              />
              AR
            </span>
          ) : (
            <span>
              <Image
                src={"/images/united-kingdom.png"}
                alt="aue flag arabic lang"
                width={30}
                height={30}
              />
              EN
            </span>
          )}
        </p>
      </div>

      {/* 🔸 Middle Navbar */}
      <div className="middle_navbar">
        <div className="mobile_menu_icon">
          <FontAwesomeIcon
            icon={faBarsStaggered}
            onClick={() => setMenuOpen(true)}
          />
          <span
            className="mobile_search_icon"
            onClick={() => setShowSearchBox(true)}
          >
            <CiSearch />
          </span>
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
          <input
            type="text"
            placeholder="search"
            value={searchValue}
            onChange={handleSearch}
            onFocus={() => searchValue && setSearchResults(products)}
          />
          <span>
            <CiSearch />
          </span>

          {/* ⬇ Dropdown */}
          {searchResults.length > 0 && (
            <div className="search_dropdown">
              {searchResults.map((item) => (
                <p key={item.id}>{item.name}</p>
              ))}
            </div>
          )}
        </div>

        <div className="phone_number">
          <FiPhone />

          <div>
            <p>Call Us</p>
            <span>
              <a href="tel:1-800-555-1234" target="_blanck">
                1-800-555-1234
              </a>
            </span>
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
          onClick={() =>
            setMegaMenuOpen((prev) => {
              const next = !prev;
              if (!next) {
                setSubPanelVisible(false);
                setActiveMainCategory(null);
              }
              return next;
            })
          }
        >
          <FontAwesomeIcon icon={faBarsStaggered} />
          <span>Browse all categories</span>
        </div>

        <ul className="main_links">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/shop">Shop</a>
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
        <>
          <div className="mega_menu_overlay" onClick={closeMegaMenu}></div>
          <div
            className={`mega_menu_dropdown side ${isArabic ? "ar-rtl" : ""} ${
              subPanelVisible ? "sub_open" : ""
            }`}
          >
            <div className="mega_menu_header_row">
              <span>Browse all categories</span>
              <FontAwesomeIcon icon={faXmark} onClick={closeMegaMenu} />
            </div>
            <div className="mega_menu_track">
              <div className="mega_panel mega_panel_main">
                {categories.map((cat, index) => (
                  <button
                    key={cat.name}
                    className={`mega_main_item ${
                      activeMainCategory === index ? "active" : ""
                    }`}
                    onClick={() => openSubPanel(index)}
                  >
                    <span>{cat.name}</span>
                    <FontAwesomeIcon icon={faChevronDown} rotation={270} />
                  </button>
                ))}
              </div>
              <div className="mega_panel mega_panel_sub">
                <div className="mega_sub_header">
                  <button className="mega_back_btn" onClick={handleBackToMain}>
                    <FontAwesomeIcon icon={faChevronDown} rotation={90} />
                    <span>Main menu</span>
                  </button>
                </div>
                <h4 className="mega_sub_title">
                  {activeMainCategory !== null
                    ? categories[activeMainCategory].name
                    : "Choose a category"}
                </h4>
                <ul className="mega_sub_list">
                  {activeMainCategory !== null ? (
                    categories[activeMainCategory].sub.map((item) => (
                      <li key={item}>{item}</li>
                    ))
                  ) : (
                    <li className="mega_placeholder">
                      Select a category to see subcategories
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </>
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
          <a href="/shop">Shop</a>

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

      {showSearchBox && (
        <div className="mobile_search_modal">
          <div className="mobile_search_header">
            <input
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={handleSearch}
            />
            <FontAwesomeIcon
              icon={faXmark}
              className="close_search"
              onClick={() => {
                setShowSearchBox(false);
                setSearchValue("");
                setSearchResults([]);
              }}
            />
          </div>

          <div className="mobile_search_results">
            {searchResults.length > 0 ? (
              searchResults.map((item) => <p key={item.id}>{item.name}</p>)
            ) : (
              <p className="no_items">No results...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
