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

  // Mapping between category images and specific subcategory names
  const subcategoryMap = {
    "Laundry&Dryclean2.webp": "Washing Detergent",
    "Restaurant&Cafe2.webp": "Detergents - Sanitizers - Disinfectants",
    "Office&Pantry2.webp": "Washroom Hygiene Solutions",
    "School&Nursery2.webp": "Green Certified Detergents",
    "CarWashnew1.webp": "Exterior",
    "Hotels2.webp": "Polisher",
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    GetCategories(setCategories, setError, setLoading);
  }, []);

  // Function to find matching subcategory for an image
  const findSubcategoryForImage = (imageName) => {
    const targetSubcategoryName = subcategoryMap[imageName];
    if (!targetSubcategoryName || categories.length === 0) return null;

    const normalizeString = (str) => {
      return str.toLowerCase().trim().replace(/\s+/g, ' ');
    };

    const targetNormalized = normalizeString(targetSubcategoryName);

    // Search through all categories and their subCategories
    for (const category of categories) {
      if (category.subCategories && Array.isArray(category.subCategories)) {
        for (const subcategory of category.subCategories) {
          const subcategoryNameEn = normalizeString(subcategory.name?.en || subcategory.name || "");
          const subcategoryNameAr = normalizeString(subcategory.name?.ar || "");
          
          // Check exact match first (most precise)
          if (
            subcategoryNameEn === targetNormalized ||
            subcategoryNameAr === targetNormalized
          ) {
            return subcategory;
          }
          
          // Then check if target is included in subcategory name
          if (
            subcategoryNameEn.includes(targetNormalized) ||
            subcategoryNameAr.includes(targetNormalized)
          ) {
            return subcategory;
          }
          
          // Finally check if subcategory name is included in target (for partial matches)
          if (
            targetNormalized.includes(subcategoryNameEn) ||
            targetNormalized.includes(subcategoryNameAr)
          ) {
            return subcategory;
          }
        }
      }
    }
    
    return null;
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
          const matchedSubcategory = findSubcategoryForImage(image.name);
          const subcategoryId = matchedSubcategory?._id;
          const href = subcategoryId ? `/shop?category=${subcategoryId}` : "/shop";

          return (
            <div key={index} className="Category_item">
              <Link href={href}>
                <Image
                  src={image.src}
                  alt={
                    matchedSubcategory
                      ? matchedSubcategory.name?.[lang] ||
                        matchedSubcategory.name?.en ||
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
