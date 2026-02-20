"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
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
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import GetProducts from "@/API/Products/GetProducts";
import GetProductSByCategory from "@/API/Categories/GetProductSByCategory";
import GetProductsByBrand from "@/API/Brands/GetProductsByBrand";
import GetCategories from "@/API/Categories/GetCategories";
import Image from "next/image";
import { addToCart } from "@/utils/cartUtils";
import { useToast } from "@/context/ToastContext";
import {
  toggleFavorite,
  isFavorited,
  getFavorites,
} from "@/utils/favoriteUtils";
import { faChevronDown, faChevronRight, faTimes, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import en from "@/translation/en.json";
import ar from "@/translation/ar.json";

export default function Shop() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryId = searchParams.get("category");
  const brandId = searchParams.get("brand");
  const pageParam = searchParams.get("page");
  const currentPage = pageParam && !isNaN(pageParam) && parseInt(pageParam, 10) > 0 
    ? parseInt(pageParam, 10) 
    : 1;
  const [favorites, setFavorites] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalProducts: 0,
  });
  const [showFilter, setShowFilter] = useState(false);
  const [showDesktopFilter, setShowDesktopFilter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState(null);
  const [lang, setLang] = useState("en");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [translations, setTranslations] = useState(en);
  
  useEffect(() => {
    // Get language from localStorage
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    setTranslations(savedLang === "ar" ? ar : en);
    
    // Fetch categories
    GetCategories(setCategories, setError, setCategoriesLoading);
    
    setFavorites(getFavorites());

    // Listen for language changes
    const handleStorageChange = () => {
      const newLang = localStorage.getItem("lang") || "en";
      setLang(newLang);
      setTranslations(newLang === "ar" ? ar : en);
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also check periodically for language changes (in case it's changed in the same window)
    const interval = setInterval(() => {
      const currentLang = localStorage.getItem("lang") || "en";
      if (currentLang !== lang) {
        setLang(currentLang);
        setTranslations(currentLang === "ar" ? ar : en);
      }
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [lang]);

  // Hide filter when brand is selected, show it otherwise
  useEffect(() => {
    if (brandId) {
      setShowDesktopFilter(false);
    } else {
      setShowDesktopFilter(true);
    }
  }, [brandId]);

  useEffect(() => {
    // Fetch products when categoryId, brandId or page changes
    if (brandId) {
      getProductsByBrand(brandId, currentPage);
      // Clear category filters when brand is selected
      setSelectedCategoryId(null);
      setSelectedSubCategoryId(null);
      setExpandedCategory(null);
    } else if (categoryId) {
      getProductsByCategory(categoryId, currentPage);
      // Find which category/subcategory is selected
      let foundMainCategory = null;
      let foundSubCategory = null;
      
      categories.forEach((cat, index) => {
        if (cat._id === categoryId) {
          foundMainCategory = cat._id;
          setSelectedCategoryId(cat._id);
          setSelectedSubCategoryId(null);
          // Expand the category if it has subcategories
          if (cat.subCategories && cat.subCategories.length > 0) {
            setExpandedCategory(index);
          }
        } else if (cat.subCategories) {
          cat.subCategories.forEach((subCat) => {
            if (subCat._id === categoryId) {
              foundSubCategory = subCat._id;
              setSelectedSubCategoryId(subCat._id);
              setSelectedCategoryId(null);
              setExpandedCategory(index);
            }
          });
        }
      });
    } else {
      getAllProducts(currentPage);
      setSelectedCategoryId(null);
      setSelectedSubCategoryId(null);
      setExpandedCategory(null);
    }
  }, [categoryId, brandId, currentPage, categories]);

  // رفع الشاشة لأول الصفحة من فوق (بدون أخطاء)
  const scrollToTop = () => {
    window.scrollTo(0, 0);
    if (typeof document !== "undefined") {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  // عند تغيير رقم الصفحة: نرفع الشاشة فوراً وبعد التحديث
  useEffect(() => {
    scrollToTop();
    const t1 = setTimeout(scrollToTop, 0);
    const t2 = setTimeout(scrollToTop, 100);
    const t3 = setTimeout(scrollToTop, 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [currentPage]);

  // بعد ما الداتا الجديدة تتحمّل والـ DOM يتحدّث: نرجع الشاشة لفوق عشان ما تعلقش في النص
  const wasLoadingRef = useRef(loading);
  useEffect(() => {
    if (wasLoadingRef.current && !loading) {
      scrollToTop();
      requestAnimationFrame(() => scrollToTop());
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToTop()));
      const delays = [50, 150, 350, 600, 1000];
      const timers = delays.map((ms) => setTimeout(scrollToTop, ms));
      return () => timers.forEach(clearTimeout);
    }
    wasLoadingRef.current = loading;
  }, [loading]);

  // Debug: Log pagination state
  useEffect(() => {
    console.log('Pagination state:', pagination);
    console.log('Current page:', currentPage);
    console.log('Products count:', allProducts.length);
  }, [pagination, currentPage, allProducts.length]);

  const handleFavoriteClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const wasFavorited = isFavorited(item._id);
    const updatedFavorites = toggleFavorite(item);
    setFavorites(updatedFavorites);
    if (wasFavorited) {
      showToast(translations.removedFromFavorites, "info");
    } else {
      showToast(translations.addedToFavorites, "success");
    }
  };
  
  const getAllProducts = (page = 1) => {
    GetProducts((products) => {
      setAllProducts(products);
      setOriginalProducts(products);
    }, setError, setLoading, page, setPagination);
  };

  const getProductsByCategory = (categoryId, page = 1) => {
    // امسح المنتجات السابقة فوراً قبل جلب المنتجات الجديدة
    setAllProducts([]);
    setOriginalProducts([]);
    
    GetProductSByCategory((products) => {
      // تأكد من أن products هو array حتى لو كان فارغاً
      const productsArray = Array.isArray(products) ? products : [];
      setAllProducts(productsArray);
      setOriginalProducts(productsArray);
    }, setError, setLoading, categoryId, page, setPagination);
  };

  const getProductsByBrand = (brandId, page = 1) => {
    // امسح المنتجات السابقة فوراً قبل جلب المنتجات الجديدة
    setAllProducts([]);
    setOriginalProducts([]);
    
    GetProductsByBrand((products) => {
      // تأكد من أن products هو array حتى لو كان فارغاً
      const productsArray = Array.isArray(products) ? products : [];
      setAllProducts(productsArray);
      setOriginalProducts(productsArray);
    }, setError, setLoading, brandId, page, setPagination);
  };

  const handleCategoryClick = (categoryIndex) => {
    const category = categories[categoryIndex];
    const hasSubCategories = category && category.subCategories && category.subCategories.length > 0;
    
    if (expandedCategory === categoryIndex) {
      // إذا كانت مفتوحة، أغلقها
      setExpandedCategory(null);
      // Reset subcategory selection
      setSelectedSubCategoryId(null);
      // إذا كانت الـ category ليس لديها subcategories، امسح المنتجات
      if (!hasSubCategories) {
        setAllProducts([]);
        setSelectedCategoryId(null);
        // امسح الـ category من الـ URL
        router.push(pathname);
      }
    } else {
      // افتح الـ category
      setExpandedCategory(categoryIndex);
      // Reset subcategory selection when expanding main category
      setSelectedSubCategoryId(null);
      
      // إذا كانت الـ category ليس لديها subcategories، امسح المنتجات وأظهر رسالة
      if (!hasSubCategories) {
        setAllProducts([]);
        setSelectedCategoryId(null);
        // امسح الـ category من الـ URL
        router.push(pathname);
      }
    }
  };

  const handleSubCategoryClick = (subCategoryId) => {
    setSelectedSubCategoryId(subCategoryId);
    setSelectedCategoryId(null);
    // Close filter on mobile
    if (window.innerWidth <= 991) {
      setShowFilter(false);
    }
    // Update URL and fetch products
    const params = new URLSearchParams();
    params.set("category", subCategoryId);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMainCategoryClick = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setSelectedSubCategoryId(null);
    // Close filter on mobile
    if (window.innerWidth <= 991) {
      setShowFilter(false);
    }
    // Update URL and fetch products
    const params = new URLSearchParams();
    params.set("category", categoryId);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleMainCategoryArrowClick = (categoryId, e) => {
    // Stop event propagation to prevent opening sub panel
    e.stopPropagation();
    // Navigate to shop page with main category ID
    handleMainCategoryClick(categoryId);
  };

  const clearFilter = () => {
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setExpandedCategory(null);
    // Remove category and brand from URL and fetch all products
    router.push(pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (pagination.totalPages && newPage > pagination.totalPages)) {
      return;
    }
    scrollToTop();
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
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
          {/* Category Filter */}
          <div className="filter_top">
            <h2>
              <MdOutlineSettingsInputComponent /> {translations.categories}
            </h2>
            
            {/* Clear Filter Button */}
            {(selectedCategoryId || selectedSubCategoryId || brandId) && (
              <button 
                className="clear_filter_btn"
                onClick={clearFilter}
              >
                <FontAwesomeIcon icon={faTimes} />
                {translations.clearFilter}
              </button>
            )}

            {/* Categories List */}
            {categoriesLoading ? (
              <div className="category_loading">{translations.loadingCategories}</div>
            ) : categories.length > 0 ? (
              <div className="categories_list">
                {categories.map((category, index) => {
                  const categoryName = category.name?.[lang] || category.name?.en || category.name || translations.unnamedCategory;
                  const hasSubCategories = category.subCategories && category.subCategories.length > 0;
                  const isExpanded = expandedCategory === index;
                  const isSelected = selectedCategoryId === category._id;
                  
                  return (
                    <div key={category._id || index} className="category_item_wrapper">
                      <div
                        className={`category_main_item ${isSelected ? "selected" : ""} ${isExpanded ? "expanded" : ""}`}
                        onClick={() => {
                          if (hasSubCategories) {
                            // إذا كان لديها subcategories، افتح/أغلق القائمة
                            handleCategoryClick(index);
                          } else {
                            // إذا لم يكن لديها subcategories، اختر الـ category مباشرة
                            handleMainCategoryClick(category._id);
                          }
                        }}
                      >
                        <span className="category_name">{categoryName}</span>
                        <FontAwesomeIcon 
                          icon={lang === "ar" ? faArrowLeft : faArrowRight} 
                          onClick={(e) => handleMainCategoryArrowClick(category._id, e)}
                          style={{ cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}
                          className="main_category_arrow"
                        />
                      </div>
                      
                      {/* Subcategories */}
                      {hasSubCategories && isExpanded && (
                        <div className="subcategories_list">
                          {category.subCategories && category.subCategories.length > 0 ? (
                            category.subCategories.map((subCategory) => {
                              const subCategoryName = subCategory.name?.[lang] || subCategory.name?.en || subCategory.name || translations.unnamedSubcategory;
                              const isSubSelected = selectedSubCategoryId === subCategory._id;
                              
                              return (
                                <div
                                  key={subCategory._id}
                                  className={`subcategory_item ${isSubSelected ? "selected" : ""}`}
                                  onClick={() => handleSubCategoryClick(subCategory._id)}
                                >
                                  {subCategoryName}
                                </div>
                              );
                            })
                          ) : (
                            <div className="no_subcategories_message">
                              <p>{translations.noSubcategoriesAvailable}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* إذا كانت الـ category مفتوحة وليس لديها subcategories، امسح المنتجات */}
                      {!hasSubCategories && isExpanded && (
                        <div className="no_subcategories_message">
                          <p>{translations.thisCategoryHasNoSubcategories}</p>
                        </div>
                      )}
          </div>
                  );
                })}
          </div>
            ) : (
              <div className="no_categories">{translations.noCategoriesAvailable}</div>
            )}
          </div>
        </div>

        {/* SHOP CONTENT */}
        <div className="shop_content">
          <div className="shop_filter_top">
            {!brandId && (
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
                {translations.filters}
              </h3>
            )}

            <p>
              <span>{pagination.totalProducts || allProducts.length}</span> {translations.productsFound}
            </p>
            {/* <select>
              <option value="Most Popular">Most Popular</option>
              <option value="Most Popular">Most Popular</option>
              <option value="Most Popular">Most Popular</option>
              <option value="Most Popular">Most Popular</option>
            </select> */}
            <div className="shop_display">
              <TbAlignBoxRightMiddle 
                className={`flex-display ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              />
              <AiOutlineBars 
                className={`grid-display ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              />
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
            ) : allProducts.length === 0 && (selectedCategoryId || selectedSubCategoryId || brandId) ? (
              <div className="no_products_message">
                <div className="no_products_icon">
                  <FiBox />
                </div>
                <h3>{translations.thisFilterHasNoProducts}</h3>
                <p>{translations.trySelectingDifferentCategory}</p>
                <button className="clear_filter_btn_inline" onClick={clearFilter}>
                  {translations.clearFilter}
                </button>
              </div>
            ) : allProducts.length === 0 ? (
              <div className="no_products_message">
                <div className="no_products_icon">
                  <FiBox />
                </div>
                <h3>{translations.noProductsFound}</h3>
                <p>{translations.noProductsAvailable}</p>
              </div>
            ) : (
              allProducts.map((item) => {
                return (
                  <div className={`Featured_card ${viewMode === "list" ? "list_view" : "grid_view"}`} key={item._id}>
                    {viewMode === "list" ? (
                      <>
                        <a href={`/product/${item._id}`} className="list_view_link">
                          <div className="Featured_img">
                            <Image
                              src={
                                item.picUrls && item.picUrls[0]
                                  ? item.picUrls[0]
                                  : "/images/empty_product.png"
                              }
                              alt="product image"
                              width={1000}
                              height={1000}
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
                          </div>
                          <div className="list_view_content">
                            <div className="list_view_info">
                              <h2>{item.name}</h2>
                              {/* <div className="Featured_stars">
                                <p>{translations.minimumOrder}</p>
                              </div> */}
                            </div>
                            <div className="Featured_price">
                              <h3>{translations.aed} {item.price}</h3>
                            </div>
                          </div>
                        </a>
                        <div className="list_view_actions">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(item, 1);
                              showToast(translations.productAddedToCart, "success");
                            }}
                          >
                            {translations.addtocart}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                    <a href={`/product/${item._id}`}>
                      <div className="Featured_img">
                        <Image
                          src={
                            item.picUrls && item.picUrls[0]
                              ? item.picUrls[0]
                              : "/images/empty_product.png"
                          }
                          alt="product image"
                              width={1000}
                              height={1000}
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
                        <p>{translations.featured}</p>
                      </div>
                      {/* <div className="Featured_stars">
                            <p>{translations.minimumOrder}</p>
                      </div> */}
                      <h2>{item.name}</h2>
                    </a>

                    <div className="Featured_price">
                      <h3>{translations.aed} {item.price}</h3>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(item, 1);
                          showToast(translations.productAddedToCart, "success");
                        }}
                      >
                        {translations.addtocart}
                      </button>
                    </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* PAGINATION */}
          {(pagination.totalPages > 1 || (allProducts.length > 0 && currentPage > 1)) && (
            <div className="pagination">
              <button
                className="pagination_button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                <FaChevronLeft />
                {translations.previous}
              </button>
              
              <div className="pagination_numbers">
                {Array.from({ length: pagination.totalPages || 1 }, (_, i) => i + 1).map((pageNum) => {
                  // Show first page, last page, current page, and pages around current
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        className={`pagination_number ${
                          currentPage === pageNum ? "active" : ""
                        }`}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return (
                      <span key={pageNum} className="pagination_dots">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}
              </div>

              <button
                className="pagination_button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === pagination.totalPages || loading
                }
              >
                {translations.next}
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
