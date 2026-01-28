"use client";
import React, { useEffect, useState } from "react";
import "./Categories.css";
import Image from "next/image";
import GetCategories from "@/API/Categories/GetCategories";
import Link from "next/link";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState("en");

  // Mapping between category images and category name keywords
  const categoryImageMap = {
    "CarWashnew1.webp": ["car wash", "carwash", "car wash", "automotive"],
    "Hotels2.webp": ["hotel", "hotels", "hospitality"],
    "Laundry&Dryclean2.webp": ["laundry", "dry clean", "dryclean", "cleaning"],
    "Office&Pantry2.webp": ["office", "pantry", "workplace"],
    "Restaurant&Cafe2.webp": ["restaurant", "cafe", "food", "dining"],
    "School&Nursery2.webp": ["school", "nursery", "education", "childcare"],
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    GetCategories(setCategories, setError, setLoading);
  }, []);

  // Function to find matching category for an image
  const findCategoryForImage = (imageName) => {
    const keywords = categoryImageMap[imageName] || [];
    if (keywords.length === 0 || categories.length === 0) return null;

    // Try to find a category that matches the keywords
    for (const category of categories) {
      const categoryNameEn = (category.name?.en || category.name || "").toLowerCase();
      const categoryNameAr = (category.name?.ar || "").toLowerCase();
      const categoryName = categoryNameEn || categoryNameAr;

      for (const keyword of keywords) {
        const lowerKeyword = keyword.toLowerCase();
        if (
          categoryName.includes(lowerKeyword) ||
          lowerKeyword.includes(categoryName)
        ) {
          return category;
        }
      }
    }
    
    // If no match found, return the first available category (fallback)
    // This ensures images still link to shop page
    return categories.length > 0 ? categories[0] : null;
  };

  // Static images array
  const staticImages = [
    { src: "/images/CarWashnew1.webp", name: "CarWashnew1.webp" },
    { src: "/images/Hotels2.webp", name: "Hotels2.webp" },
    { src: "/images/Laundry&Dryclean2.webp", name: "Laundry&Dryclean2.webp" },
    { src: "/images/Office&Pantry2.webp", name: "Office&Pantry2.webp" },
    { src: "/images/Restaurant&Cafe2.webp", name: "Restaurant&Cafe2.webp" },
    { src: "/images/School&Nursery2.webp", name: "School&Nursery2.webp" },
  ];

  return (
    <div className="Categories">
      <div className="Categories_container">
        {staticImages.map((image, index) => {
          const matchedCategory = findCategoryForImage(image.name);
          const categoryId = matchedCategory?._id;
          const href = categoryId ? `/shop?category=${categoryId}` : "/shop";

          return (
            <div key={index} className="Category_item">
              <Link href={href}>
                <Image
                  src={image.src}
                  alt={
                    matchedCategory
                      ? matchedCategory.name?.[lang] ||
                        matchedCategory.name?.en ||
                        "category image"
                      : "category image"
                  }
                  width={1000}
                  height={1000}
                  loading="lazy"
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
