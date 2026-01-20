import React from "react";
import "./Categories.css";
import Image from "next/image";
const Categories = () => {
  return (
    <div className="Categories">
      <div className="Categories_container">
        <div className="Category_item">
          <a href="/">
            <Image
              src={"/images/CarWashnew1.webp"}
              alt="category image"
              width={1000}
              height={1000}
              loading="lazy"
            />
          </a>
        </div>
        <div className="Category_item">
          <a href="/">
            <Image
              src={"/images/Hotels2.webp"}
              alt="category image"
              width={1000}
              height={1000}
              loading="lazy"
            />
          </a>
        </div>
        <div className="Category_item">
          <a href="/">
            <Image
              src={"/images/Laundry&Dryclean2.webp"}
              alt="category image"
              width={1000}
              height={1000}
              loading="lazy"
            />
          </a>
        </div>
        <div className="Category_item">
          <a href="/">
            <Image
              src={"/images/Office&Pantry2.webp"}
              alt="category image"
              width={1000}
              height={1000}
              loading="lazy"
            />
          </a>
        </div>
        <div className="Category_item">
          <a href="/">
            <Image
              src={"/images/Restaurant&Cafe2.webp"}
              alt="category image"
              width={1000}
              height={1000}
              loading="lazy"
            />
          </a>
        </div>
        <div className="Category_item">
          <a href="/">
            <Image
              src={"/images/School&Nursery2.webp"}
              alt="category image"
              width={1000}
              height={1000}
              loading="lazy"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Categories;
