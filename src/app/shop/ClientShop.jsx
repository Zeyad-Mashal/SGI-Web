"use client";
import { useEffect, useState } from "react";
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
import GetCategories from "@/API/Categories/GetCategories";
import Image from "next/image";
import { addToCart } from "@/utils/cartUtils";
import { useToast } from "@/context/ToastContext";
import {
  toggleFavorite,
  isFavorited,
  getFavorites,
} from "@/utils/favoriteUtils";
import { faChevronDown, faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Shop() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryId = searchParams.get("category");
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
  
  useEffect(() => {
    // Get language from localStorage
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    
    // Fetch categories
    GetCategories(setCategories, setError, setCategoriesLoading);
    
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    // Fetch products when categoryId or page changes
    if (categoryId) {
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
  }, [categoryId, currentPage, categories]);

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
      showToast("Removed from favorites", "info");
    } else {
      showToast("Added to favorites!", "success");
    }
  };
  
  const getAllProducts = (page = 1) => {
    GetProducts((products) => {
      setAllProducts(products);
      setOriginalProducts(products);
    }, setError, setLoading, page, setPagination);
  };

  const getProductsByCategory = (categoryId, page = 1) => {
    GetProductSByCategory((products) => {
      setAllProducts(products);
      setOriginalProducts(products);
    }, setError, setLoading, categoryId, page, setPagination);
  };

  const handleCategoryClick = (categoryIndex) => {
    if (expandedCategory === categoryIndex) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryIndex);
    }
    // Reset subcategory selection when expanding/collapsing main category
    setSelectedSubCategoryId(null);
  };

  const handleSubCategoryClick = (subCategoryId) => {
    setSelectedSubCategoryId(subCategoryId);
    setSelectedCategoryId(null);
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
    // Update URL and fetch products
    const params = new URLSearchParams();
    params.set("category", categoryId);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilter = () => {
    setSelectedCategoryId(null);
    setSelectedSubCategoryId(null);
    setExpandedCategory(null);
    // Remove category from URL and fetch all products
    router.push(pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (pagination.totalPages && newPage > pagination.totalPages)) {
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              <MdOutlineSettingsInputComponent /> Categories
            </h2>
            
            {/* Clear Filter Button */}
            {(selectedCategoryId || selectedSubCategoryId) && (
              <button 
                className="clear_filter_btn"
                onClick={clearFilter}
              >
                <FontAwesomeIcon icon={faTimes} />
                Clear Filter
              </button>
            )}

            {/* Categories List */}
            {categoriesLoading ? (
              <div className="category_loading">Loading categories...</div>
            ) : categories.length > 0 ? (
              <div className="categories_list">
                {categories.map((category, index) => {
                  const categoryName = category.name?.[lang] || category.name?.en || category.name || "Unnamed Category";
                  const hasSubCategories = category.subCategories && category.subCategories.length > 0;
                  const isExpanded = expandedCategory === index;
                  const isSelected = selectedCategoryId === category._id;
                  
                  return (
                    <div key={category._id || index} className="category_item_wrapper">
                      <div
                        className={`category_main_item ${isSelected ? "selected" : ""} ${isExpanded ? "expanded" : ""}`}
                        onClick={() => {
                          if (hasSubCategories) {
                            handleCategoryClick(index);
                          } else {
                            handleMainCategoryClick(category._id);
                          }
                        }}
                      >
                        <span className="category_name">{categoryName}</span>
                        {hasSubCategories && (
                          <FontAwesomeIcon 
                            icon={isExpanded ? faChevronDown : faChevronRight} 
                            className="category_chevron"
                          />
                        )}
                      </div>
                      
                      {/* Subcategories */}
                      {hasSubCategories && isExpanded && (
                        <div className="subcategories_list">
                          {category.subCategories.map((subCategory) => {
                            const subCategoryName = subCategory.name?.[lang] || subCategory.name?.en || subCategory.name || "Unnamed Subcategory";
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
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="no_categories">No categories available</div>
            )}
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
              <span>{pagination.totalProducts || allProducts.length}</span> products found
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
            ) : allProducts.length === 0 && (selectedCategoryId || selectedSubCategoryId) ? (
              <div className="no_products_message">
                <div className="no_products_icon">
                  <FiBox />
                </div>
                <h3>This filter has no products</h3>
                <p>Try selecting a different category or clear the filter to see all products.</p>
                <button className="clear_filter_btn_inline" onClick={clearFilter}>
                  Clear Filter
                </button>
              </div>
            ) : allProducts.length === 0 ? (
              <div className="no_products_message">
                <div className="no_products_icon">
                  <FiBox />
                </div>
                <h3>No products found</h3>
                <p>There are currently no products available.</p>
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
                      <div className="Featured_stars">
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <FontAwesomeIcon icon={faStar} />
                        <p>(230 reviews) (m.order 30 units)</p>
                      </div>
                      <h2>{item.name}</h2>
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

          {/* PAGINATION */}
          {(pagination.totalPages > 1 || (allProducts.length > 0 && currentPage > 1)) && (
            <div className="pagination">
              <button
                className="pagination_button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                <FaChevronLeft />
                Previous
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
                Next
                <FaChevronRight />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
