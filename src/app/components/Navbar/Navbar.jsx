"use client";
import React, { useState, useEffect } from "react";
import "./Navbar.css";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
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
import Search from "@/API/Search/Search";
import GetCategories from "@/API/Categories/GetCategories";
import GetProductSByCategory from "@/API/Categories/GetProductSByCategory";
import LogoutModal from "@/app/components/LogoutModal/LogoutModal";
import { getCartItemCount } from "@/utils/cartUtils";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeMainCategory, setActiveMainCategory] = useState(null);
  const [subPanelVisible, setSubPanelVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // Initialize isArabic from localStorage immediately
  const [isArabic, setIsArabic] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lang") === "ar";
    }
    return false;
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    GetCategories(setCategories, setError, setLoading);
    // تحديث عدد المنتجات في السلة
    updateCartCount();
    
    // الاستماع لتغييرات localStorage من نفس النافذة
    const handleStorageChange = (e) => {
      if (e.key === 'cart' || !e.key) {
        updateCartCount();
      }
    };
    
    // الاستماع لتغييرات localStorage من نوافذ أخرى
    window.addEventListener('storage', handleStorageChange);
    
    // فحص السلة كل 500ms للتحديث الفوري (أسرع)
    const interval = setInterval(updateCartCount, 500);
    
    // تحديث عند تغيير التركيز على النافذة
    const handleFocus = () => {
      updateCartCount();
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const updateCartCount = () => {
    const count = getCartItemCount();
    setCartItemCount(count);
  };

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

  const handleSubCategoryClick = (subCategoryId) => {
    // Close the mega menu
    closeMegaMenu();
    // Navigate to shop page with category ID
    router.push(`/shop?category=${subCategoryId}`);
  };

  const toggleCategory = (index) => {
    setActiveCategory(activeCategory === index ? null : index);
  };
  // Initialize lang from localStorage immediately to avoid initial render with wrong language
  const [lang, setLang] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lang") || "en";
    }
    return "en";
  });
  const [token, setToken] = useState(null);
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    const token = localStorage.getItem("sgitoken");
    setToken(token);
    if (!savedLang) {
      localStorage.setItem("lang", "en");
      setLang("en");
    } else {
      setLang(savedLang);
    }
    if (savedLang === "ar") {
      setIsArabic(true);
    } else {
      setIsArabic(false);
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("sgitoken");
    localStorage.removeItem("userId");
    setToken(null);
    window.location.reload();
  };
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
  const [searchedProducts, setSearchedProducts] = useState([]);
  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setError(null);
    if (value.trim().length === 0) {
      setSearchResults([]);
      setSearchedProducts([]); // اغلاق نتائج البحث
      return;
    }

    setLoading(true);
    const response = await Search(
      setSearchedProducts,
      setError,
      setLoading,
      value
    );

    if (response && response.products) {
      setSearchResults(response.products);
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
          {token && (
            <a href="/profile">
              <FaRegUser />
            </a>
          )}

          <a href="/cart" className="cart_link">
            <RiShoppingBag3Line />
            {cartItemCount > 0 && (
              <span className="cart_badge">{cartItemCount}</span>
            )}
          </a>
        </div>
        <div className="logo">
          <a href="/">
            <Image
              src="/images/logo-black.png"
              alt="logo"
              width={1000}
              height={1000}
            />
          </a>
        </div>
        <div className="search">
          <input
            type="text"
            placeholder="search"
            value={searchValue}
            onChange={handleSearch}
            onFocus={() => {
              if (searchValue.trim().length > 0) {
                handleSearch({ target: { value: searchValue } });
              }
            }}
          />
          <span>
            <CiSearch />
          </span>

          {/* ⬇ Dropdown */}
          {/* 🔎 SEARCH DROPDOWN */}
          {searchValue.trim().length > 0 && (
            <div className="search_dropdown">
              {/* لو فيه Error */}
              {error && (
                <div className="no_results">
                  <FontAwesomeIcon icon={faXmark} className="no_results_icon" />
                  <p>No products found, Please Search Another Product.</p>
                </div>
              )}

              {/* لو مفيش نتائج */}
              {!error && searchedProducts.length === 0 && (
                <div className="no_results">
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="no_results_icon"
                  />
                  <p>{translations.searching}</p>
                </div>
              )}

              {/* لو فيه نتائج */}
              {searchedProducts.length > 0 &&
                searchedProducts.map((item) => (
                  <div className="search_item" key={item._id}>
                    <a href={`/product/${item._id}`}>
                      <Image
                        src={item?.picUrls?.[0] || "/images/empty_product.png"}
                        alt={item.name || "product image"}
                        width={100}
                        height={100}
                      />
                      <div className="search_item_info">
                        <p>{item.name}</p>
                        <p>
                          {item.price} {translations.aed}
                        </p>
                      </div>
                    </a>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="phone_number">
          <FiPhone />

          <div>
            <p>{translations.callus}</p>
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

          {token && (
            <a href="/profile">
              <FaRegUser />
            </a>
          )}

          <a href="/cart" className="cart_link">
            <RiShoppingBag3Line />
            {cartItemCount > 0 && (
              <span className="cart_badge">{cartItemCount}</span>
            )}
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
          <span>{translations.browseallcategories}</span>
        </div>

        <ul className="main_links">
          <li>
            <a href="/" className={pathname === "/" ? "active" : ""}>{translations.home}</a>
          </li>
          <li>
            <a href="/shop" className={pathname === "/shop" ? "active" : ""}>{translations.shop}</a>
          </li>
          <li>
            <a href="/returns" className={pathname === "/returns" ? "active" : ""}>{translations.returnsTitle || "Returns Policy"}</a>
          </li>
          <li>
            <a href="/Privacy" className={pathname === "/Privacy" ? "active" : ""}>{translations.privacyTitle || "Privacy Policy"}</a>
          </li>
        </ul>
        <div className="login_links">
          {token ? (
            <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
              {translations.logout || "Logout"}
            </button>
          ) : (
            <>
              <a href="/login">{translations.login}</a>
              <span>
                <a href="/register">{translations.signup}</a>
              </span>
            </>
          )}
        </div>
        <div className="our_shop">
          <a href="/shop">
            {translations.exploreallproducts}{" "}
            <FontAwesomeIcon icon={faArrowRight} />
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
              <span>{translations.browseallcategories}</span>
              <FontAwesomeIcon icon={faXmark} onClick={closeMegaMenu} />
            </div>
            <div className="mega_menu_track">
              {isArabic ? (
                <>
                  {/* RTL: Sub panel first, then main panel */}
                  <div className="mega_panel mega_panel_sub">
                    <div className="mega_sub_header">
                      <button
                        className="mega_back_btn"
                        onClick={handleBackToMain}
                      >
                        <FontAwesomeIcon icon={faChevronDown} rotation={90} />
                        <span>{translations.mainmenu}</span>
                      </button>
                    </div>
                    <h4 className="mega_sub_title">
                      {activeMainCategory !== null
                        ? categories[activeMainCategory]?.name?.[lang] ||
                          categories[activeMainCategory]?.name?.en ||
                          "Choose a category"
                        : "Choose a category"}
                    </h4>
                    <ul className="mega_sub_list">
                      {activeMainCategory !== null &&
                      categories[activeMainCategory]?.subCategories ? (
                        categories[activeMainCategory].subCategories.map(
                          (subCat) => (
                            <li
                              key={subCat._id}
                              onClick={() => handleSubCategoryClick(subCat._id)}
                              style={{ cursor: "pointer" }}
                            >
                              {subCat.name?.[lang] || subCat.name?.en || ""}
                            </li>
                          )
                        )
                      ) : (
                        <li className="mega_placeholder">
                          {translations.selectacategorytoseesubcategories}
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="mega_panel mega_panel_main">
                    {categories.map((cat, index) => (
                      <button
                        key={cat._id || index}
                        className={`mega_main_item ${
                          activeMainCategory === index ? "active" : ""
                        }`}
                        onClick={() => openSubPanel(index)}
                      >
                        <span>{cat.name?.[lang] || cat.name?.en || ""}</span>
                        <FontAwesomeIcon icon={faChevronDown} rotation={270} />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* LTR: Main panel first, then sub panel */}
                  <div className="mega_panel mega_panel_main">
                    {categories.map((cat, index) => (
                      <button
                        key={cat._id || index}
                        className={`mega_main_item ${
                          activeMainCategory === index ? "active" : ""
                        }`}
                        onClick={() => openSubPanel(index)}
                      >
                        <span>{cat.name?.[lang] || cat.name?.en || ""}</span>
                        <FontAwesomeIcon icon={faChevronDown} rotation={270} />
                      </button>
                    ))}
                  </div>
                  <div className="mega_panel mega_panel_sub">
                    <div className="mega_sub_header">
                      <button
                        className="mega_back_btn"
                        onClick={handleBackToMain}
                      >
                        <FontAwesomeIcon icon={faChevronDown} rotation={90} />
                        <span>{translations.mainmenu}</span>
                      </button>
                    </div>
                    <h4 className="mega_sub_title">
                      {activeMainCategory !== null
                        ? categories[activeMainCategory]?.name?.[lang] ||
                          categories[activeMainCategory]?.name?.en ||
                          "Choose a category"
                        : "Choose a category"}
                    </h4>
                    <ul className="mega_sub_list">
                      {activeMainCategory !== null &&
                      categories[activeMainCategory]?.subCategories ? (
                        categories[activeMainCategory].subCategories.map(
                          (subCat) => (
                            <li
                              key={subCat._id}
                              onClick={() => handleSubCategoryClick(subCat._id)}
                              style={{ cursor: "pointer" }}
                            >
                              {subCat.name?.[lang] || subCat.name?.en || ""}
                            </li>
                          )
                        )
                      ) : (
                        <li className="mega_placeholder">
                          {translations.selectacategorytoseesubcategories}
                        </li>
                      )}
                    </ul>
                  </div>
                </>
              )}
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
          <a href="/" className={pathname === "/" ? "active" : ""}>{translations.home}</a>
          <a href="/shop" className={pathname === "/shop" ? "active" : ""}>{translations.shop}</a>
          <a href="/returns" className={pathname === "/returns" ? "active" : ""}>{translations.returnsTitle || "Returns Policy"}</a>
          <a href="/Privacy" className={pathname === "/Privacy" ? "active" : ""}>{translations.privacyTitle || "Privacy Policy"}</a>
          <div className="mobile_categories">
            <h3>{translations.categories}</h3>
            {categories.map((cat, index) => (
              <div key={cat._id || index} className="category_item">
                <div
                  className="category_header"
                  onClick={() => toggleCategory(index)}
                >
                  <span>{cat.name?.[lang] || cat.name?.en || ""}</span>
                  <FontAwesomeIcon icon={faChevronDown} />
                </div>
                {activeCategory === index &&
                  cat.subCategories &&
                  cat.subCategories.length > 0 && (
                    <ul className="subcategory_list">
                      {cat.subCategories.map((subCat, i) => (
                        <li
                          key={subCat._id || i}
                          onClick={() => {
                            handleSubCategoryClick(subCat._id);
                            setMenuOpen(false);
                          }}
                          style={{ cursor: "pointer" }}
                        >
                          {subCat.name?.[lang] || subCat.name?.en || ""}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
            ))}
          </div>

          <div className="mobile_actions">
            {token ? (
              <button
                className="logout-btn mobile-logout-btn"
                onClick={() => setShowLogoutModal(true)}
              >
                {translations.logout || "Logout"}
              </button>
            ) : (
              <>
                <a href="/login">{translations.login}</a>
                <a href="/register" className="signup_btn">
                  {translations.signup}
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {showSearchBox && (
        <div className="mobile_search_modal">
          <div className="mobile_search_header">
            <input
              type="text"
              placeholder={translations.searchproducts}
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
            {searchedProducts.length > 0 ? (
              searchedProducts.map((item) => (
                <div className="search_item" key={item._id}>
                  <a href={`/product/${item._id}`}>
                    <Image
                      src={item?.picUrls?.[0] || "/images/empty_product.png"}
                      alt={item.name || "product image"}
                      width={100}
                      height={100}
                    />
                    <div className="search_item_info">
                      <p>{item.name}</p>
                      <p>{item.price} AED</p>
                    </div>
                  </a>
                </div>
              ))
            ) : (
              <p className="no_items">{translations.noresults}</p>
            )}
          </div>
        </div>
      )}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default Navbar;
