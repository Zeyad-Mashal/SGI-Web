import React from "react";
import "./Featrues.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faTruckFast,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { RiCustomerService2Line } from "react-icons/ri";
import { LiaShippingFastSolid } from "react-icons/lia";
import { TfiLoop } from "react-icons/tfi";
import { GrSecure } from "react-icons/gr";

const Featrues = () => {
  return (
    <div className="featrues">
      <div className="featrues_item">
        <RiCustomerService2Line />

        <div className="featrues_item_1">
          <h2>Responsive</h2>
          <p>Customer service available 24/7</p>
        </div>
      </div>

      <div className="featrues_item">
        <GrSecure />

        <div className="featrues_item_1">
          <h2>Secure</h2>
          <p>Certified marketplace since 2020</p>
        </div>
      </div>

      <div className="featrues_item">
        <LiaShippingFastSolid />

        <div className="featrues_item_1">
          <h2>Shipping</h2>
          <p>Free, fast and reliable worldwide</p>
        </div>
      </div>

      <div className="featrues_item">
        <TfiLoop />

        <div className="featrues_item_1">
          <h2>Transparent</h2>
          <p>Hassle-free return policy</p>
        </div>
      </div>
    </div>
  );
};

export default Featrues;
