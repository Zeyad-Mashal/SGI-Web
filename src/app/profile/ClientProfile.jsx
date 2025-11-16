import React from "react";
import "./profile.css";
import Image from "next/image";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { MdOutlineDateRange } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { MdOutlineAttachMoney } from "react-icons/md";
import { RiFilePaper2Line } from "react-icons/ri";

const ClientProfile = () => {
  return (
    <div className="profile">
      <div className="profile_container">
        <div className="profile_info">
          <div className="profile_info_top">
            <Image
              src={"/images/p1.png"}
              alt="profile pic"
              loading="lazy"
              width={120}
              height={120}
            />
            <div className="profile_info_content">
              <div className="profile_title">
                <h1>Sarah Johnson</h1>
                <button>
                  <FaRegEdit />
                  Edit Profile
                </button>
              </div>
              <p>Procurement Manager</p>
              <p>Premium Cleaning Solution inc.</p>
              <div className="profile_contact">
                <span>
                  <MdOutlineMailOutline />
                  sarah.johnson@email.com
                </span>
                <span>
                  <FiPhone />
                  +1 (555) 123-475
                </span>
                <span>
                  <MdOutlineDateRange />
                  Member since January 2023
                </span>
              </div>
            </div>
          </div>
          <div className="profile_info_bottom">
            <div className="profile_bottom_item">
              <BsBoxSeam />
              <div className="bottom_item_content">
                <h3>148</h3>
                <p>Total Orders</p>
              </div>
            </div>
            <div className="profile_bottom_item">
              <MdOutlineAttachMoney />

              <div className="bottom_item_content">
                <h3>45000$</h3>
                <p>Total Spent</p>
              </div>
            </div>
            <div className="profile_bottom_item">
              <BsBoxSeam />
              <div className="bottom_item_content">
                <h3>25%</h3>
                <p>Active Savings</p>
              </div>
            </div>
          </div>
        </div>
        <div className="RecentOrders">
          <div className="RecentOrders_title">
            <h2>
              <RiFilePaper2Line />
              RecentOrders
            </h2>
            <a href="/">View All</a>
          </div>
          <div className="RecentOrders_list">
            <div className="RecentOrders_item">
              <div className="RecentOrders_item_left">
                <BsBoxSeam />
                <div>
                  <h3>ORD-5244</h3>
                  <p>NOV4,2026 . 24 items</p>
                </div>
              </div>
              <div className="RecentOrders_item_right">
                <h3>$450.000</h3>
              </div>
            </div>
            <div className="RecentOrders_item">
              <div className="RecentOrders_item_left">
                <BsBoxSeam />
                <div>
                  <h3>ORD-5244</h3>
                  <p>NOV4,2026 . 24 items</p>
                </div>
              </div>
              <div className="RecentOrders_item_right">
                <h3>$450.000</h3>
              </div>
            </div>
            <div className="RecentOrders_item">
              <div className="RecentOrders_item_left">
                <BsBoxSeam />
                <div>
                  <h3>ORD-5244</h3>
                  <p>NOV4,2026 . 24 items</p>
                </div>
              </div>
              <div className="RecentOrders_item_right">
                <h3>$450.000</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="Information">
          <h2>
            <RiFilePaper2Line />
            Business Information
          </h2>
          <div className="Information_list">
            <div className="Information_item">
              <h3>Company Name</h3>
              <p>Premium Cleaning Solution inc.</p>
            </div>
            <div className="Information_item">
              <h3>Company Name</h3>
              <p>Premium Cleaning Solution inc.</p>
            </div>
            <div className="Information_item">
              <h3>Company Name</h3>
              <p>Premium Cleaning Solution inc.</p>
            </div>
            <div className="Information_item">
              <h3>Company Name</h3>
              <p>Premium Cleaning Solution inc.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;
