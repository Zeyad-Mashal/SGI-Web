"use client";
import React, { useState } from "react";
import "./cart.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GoGift } from "react-icons/go";
import Image from "next/image";
import { FaRegHeart } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { FaArrowRight } from "react-icons/fa6";
import { BsBox2 } from "react-icons/bs";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BsPatchCheck } from "react-icons/bs";

const ClientCart = () => {
  const price = 100;
  const [qty, setQty] = useState(1);
  const updateQty = (value) => {
    const num = Math.max(0, Number(value));
    setQty(num);
  };
  return (
    <div className="cart">
      <div className="cart_container">
        <div className="cart_content">
          <h1>Shopping Cart</h1>
          <p>Review your wholesale order before checkout</p>
          <div className="cart_content_info">
            <div className="cart_left">
              <div className="cart_count">
                <div className="cart_count_left">
                  <h3>Cart Items (2)</h3>
                  <p>All prices include volume discounts where applicable</p>
                </div>
                <div className="cart_count_right">
                  <RiDeleteBin6Line />
                  Clear Cart
                </div>
              </div>
              <div className="cart_list">
                <div className="cart_product">
                  <Image
                    src={"/images/p1.png"}
                    alt="cart product"
                    loading="lazy"
                    width={200}
                    height={200}
                  />
                  <div className="cart_product_content">
                    <div className="product_item_top">
                      <div className="product_item_top_title">
                        <h2>White Spot Concentrated Lemon</h2>
                        <span>Floor Care</span>
                        <p>
                          $100 <span>per unit</span>
                        </p>
                      </div>
                      <div className="product_item_top_btns">
                        <FaRegHeart />
                        <RiDeleteBin6Line />
                      </div>
                    </div>
                    <div className="product_item_bottom">
                      <div className="Quantity_counter">
                        <div className="counter">
                          <button onClick={() => updateQty(qty - 1)}>-</button>

                          <input
                            type="text"
                            value={qty}
                            onChange={(e) => updateQty(e.target.value)}
                          />

                          <button onClick={() => updateQty(qty + 1)}>+</button>
                        </div>

                        <p>
                          <MdErrorOutline />
                          Min. Order : 30 Units
                        </p>

                        <div className="total">
                          <h2>
                            Item Total <span>${(qty * price).toFixed(2)}</span>
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="cart_product">
                  <Image
                    src={"/images/p2.png"}
                    alt="cart product"
                    loading="lazy"
                    width={200}
                    height={200}
                  />
                  <div className="cart_product_content">
                    <div className="product_item_top">
                      <div className="product_item_top_title">
                        <h2>Crystal Brite Laundry Sour</h2>
                        <span>Floor Care</span>
                        <p>
                          $100 <span>per unit</span>
                        </p>
                      </div>
                      <div className="product_item_top_btns">
                        <FaRegHeart />
                        <RiDeleteBin6Line />
                      </div>
                    </div>
                    <div className="product_item_bottom">
                      <div className="Quantity_counter">
                        <div className="counter">
                          <button onClick={() => updateQty(qty - 1)}>-</button>

                          <input
                            type="text"
                            value={qty}
                            onChange={(e) => updateQty(e.target.value)}
                          />

                          <button onClick={() => updateQty(qty + 1)}>+</button>
                        </div>

                        <p>
                          <MdErrorOutline />
                          Min. Order : 30 Units
                        </p>

                        <div className="total">
                          <h2>
                            Item Total <span>${(qty * price).toFixed(2)}</span>
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="cart_right">
              <div className="cart_right_promo">
                <h3>
                  <GoGift />
                  Promo Code
                </h3>
                <div className="promo_input">
                  <input type="text" />
                  <button>Apply</button>
                </div>
                <p>Try Bulk10 for 10% off</p>
              </div>
              <div className="cart_right_summry">
                <h3>Order Summary</h3>
                <div className="summry">
                  <h4>Subtotal (2 items)</h4>
                  <p>$4836.00</p>
                </div>
                <div className="summry">
                  <h4>Shipping</h4>
                  <p>Free</p>
                </div>
                <div className="summry">
                  <h4>Tax (8%)</h4>
                  <p>$386.88</p>
                </div>
                <hr />
                <div className="summry">
                  <h4>Total</h4>
                  <p>$5222.88</p>
                </div>
                <button>
                  Proceed to checkout <FaArrowRight />
                </button>
                <p>
                  <BsBox2 />
                  Bulk packaging available
                </p>
                <p>
                  <LiaShippingFastSolid />
                  Fast delivery (2-3 business days)
                </p>
                <p>
                  <BsPatchCheck />
                  Secure Checkout Process
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientCart;
