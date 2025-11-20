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
              width={200}
              height={200}
              loading="lazy"
            />
          </a>
        </div>
        <div className="Category_item">
          <a href="/">
            <Image
              src={"/images/Hotels.webp"}
              alt="category image"
              width={200}
              height={200}
              loading="lazy"
            />
          </a>
        </div>
        <div className="Category_item">
          <a href="/">
            <Image
              src={"/images/Laundry&Dryclean.webp"}
              alt="category image"
              width={200}
              height={200}
              loading="lazy"
            />
          </a>
        </div>
        <div className="Category_item">
          <a href="/">
            <Image
              src={"/images/Office&Pantry.webp"}
              alt="category image"
              width={200}
              height={200}
              loading="lazy"
            />
          </a>
        </div>
        <div className="Category_item">
          <a href="/">
            <Image
              src={"/images/Restaurant&Cafe.webp"}
              alt="category image"
              width={200}
              height={200}
              loading="lazy"
            />
          </a>
        </div>
        <div className="Category_item">
          <a href="/">
            <Image
              src={"/images/School&Nursery.webp"}
              alt="category image"
              width={200}
              height={200}
              loading="lazy"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Categories;
