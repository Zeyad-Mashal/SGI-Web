"use client";
import React, { useState, useEffect } from "react";
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
import { IoCartSharp } from "react-icons/io5";
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
} from "@/utils/cartUtils";
import { useRouter } from "next/navigation";

const ClientCart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [content, setContent] = useState(false);
  const [emptyContent, setEmptyContent] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setMounted(true);
    loadCart();
  }, []);

  useEffect(() => {
    if (mounted) {
      const currentSubtotal = getCartTotal();
      const currentTax = currentSubtotal * 0.08; // 8% tax
      const currentTotal = currentSubtotal + currentTax;
      setSubtotal(currentSubtotal);
      setTax(currentTax);
      setTotal(currentTotal);
    }
  }, [cartItems, mounted]);

  const loadCart = () => {
    const cart = getCart();
    if (cart.length === 0) {
      setEmptyContent(true);
      setContent(false);
    } else {
      setCartItems(cart);
      setEmptyContent(false);
      setContent(true);
    }
  };

  const updateQty = (productId, value) => {
    const num = Math.max(1, Number(value));
    const updatedCart = updateCartItemQuantity(productId, num);
    setCartItems(updatedCart);
    if (updatedCart.length === 0) {
      setEmptyContent(true);
      setContent(false);
    }
  };

  const removeItem = (productId) => {
    const updatedCart = removeFromCart(productId);
    setCartItems(updatedCart);
    if (updatedCart.length === 0) {
      setEmptyContent(true);
      setContent(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
    setCartItems([]);
    setEmptyContent(true);
    setContent(false);
  };
  // Show loading state during initial mount to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="cart">
        <div className="cart_container">
          <div className="cart_content">
            <h1>Shopping Cart</h1>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      {emptyContent === true ? (
        <div className="empty_cart">
          <Image
            src={"/images/empty_cart.png"}
            alt="empty cart"
            loading="lazy"
            width={90}
            height={90}
          />

          <h1>Your Cart Is Empty</h1>
          <p>
            Start adding wholesale cleaning supplies to your cart and save big
            on bulk orders !{" "}
          </p>
          <div className="empty_content">
            <p>
              <BsBox2 />
              Bulk Pricing
            </p>
            <p>
              <LiaShippingFastSolid />
              Free Shipping $500+
            </p>
            <p>
              <BsPatchCheck />
              Quality Assured
            </p>
          </div>
          <button onClick={() => router.push("/shop")}>Browse Products</button>
        </div>
      ) : (
        ""
      )}

      {content === true ? (
        <div className="cart_container">
          <div className="cart_content">
            <h1>Shopping Cart</h1>
            <p>Review your wholesale order before checkout</p>
            <div className="cart_content_info">
              <div className="cart_left">
                <div className="cart_count">
                  <div className="cart_count_left">
                    <h3>Cart Items ({cartItems.length})</h3>
                    <p>All prices include volume discounts where applicable</p>
                  </div>
                  <div className="cart_count_right" onClick={handleClearCart}>
                    <RiDeleteBin6Line />
                    Clear Cart
                  </div>
                </div>
                <div className="cart_list">
                  {cartItems.map((item) => (
                    <div className="cart_product" key={item._id}>
                      <Image
                        src={
                          item.picUrls && item.picUrls[0]
                            ? item.picUrls[0]
                            : "/images/empty_product.png"
                        }
                        alt={item.name}
                        loading="lazy"
                        width={200}
                        height={200}
                      />
                      <div className="cart_product_content">
                        <div className="product_item_top">
                          <div className="product_item_top_title">
                            <h2>{item.name}</h2>
                            <span>
                              {item.categories && item.categories.length > 0
                                ? item.categories[0]
                                : "Product"}
                            </span>
                            <p>
                              AED {item.price} <span>per unit</span>
                            </p>
                          </div>
                          <div className="product_item_top_btns">
                            <FaRegHeart />
                            <RiDeleteBin6Line
                              onClick={() => removeItem(item._id)}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>
                        <div className="product_item_bottom">
                          <div className="Quantity_counter">
                            <div className="counter">
                              <button
                                onClick={() =>
                                  updateQty(item._id, item.quantity - 1)
                                }
                              >
                                -
                              </button>

                              <input
                                type="text"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateQty(item._id, e.target.value)
                                }
                              />

                              <button
                                onClick={() =>
                                  updateQty(item._id, item.quantity + 1)
                                }
                              >
                                +
                              </button>
                            </div>

                            <p>
                              <MdErrorOutline />
                              Min. Order : 30 Units
                            </p>

                            <div className="total">
                              <h2>
                                Item Total{" "}
                                <span>
                                  AED {(item.price * item.quantity).toFixed(2)}
                                </span>
                              </h2>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
                    <h4>
                      Subtotal (
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items)
                    </h4>
                    <p>AED {subtotal.toFixed(2)}</p>
                  </div>
                  <div className="summry">
                    <h4>Shipping</h4>
                    <p>{subtotal >= 500 ? "Free" : "Calculated at checkout"}</p>
                  </div>
                  <div className="summry">
                    <h4>Tax (8%)</h4>
                    <p>AED {tax.toFixed(2)}</p>
                  </div>
                  <hr />
                  <div className="summry">
                    <h4>Total</h4>
                    <p>AED {total.toFixed(2)}</p>
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
      ) : (
        ""
      )}
    </div>
  );
};

export default ClientCart;
