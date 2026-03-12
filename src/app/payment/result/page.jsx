"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CreateOrder from "@/API/Orders/CreateOrder";
import PaymentResultAPI from "@/API/Payment/PaymentResult";
import { clearCart } from "@/utils/cartUtils";

const PENDING_ORDER_KEY = "pendingOrderAfterPayment";

const PaymentResultContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const checkoutId = searchParams.get("checkoutId");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id || !checkoutId) {
      setError("Missing payment parameters");
      setLoading(false);
      return;
    }

    const checkPaymentAndOrder = async () => {
      const paymentResult = await PaymentResultAPI(
        { id, checkoutId },
        setError,
        setLoading
      );

      if (!paymentResult) {
        setPaymentFailed(true);
        setLoading(false);
        return;
      }

      const isApproved =
        paymentResult?.result === "Approved" ||
        paymentResult?.status === "Approved";

      if (!isApproved) {
        setPaymentFailed(true);
        setLoading(false);
        return;
      }

      const pendingOrderJson = sessionStorage.getItem(PENDING_ORDER_KEY);
      if (!pendingOrderJson) {
        setError("Order data not found");
        setLoading(false);
        return;
      }

      try {
        const orderData = JSON.parse(pendingOrderJson);
        sessionStorage.removeItem(PENDING_ORDER_KEY);
        const orderCreated = await CreateOrder(
          orderData,
          setError,
          setLoading,
          () => {}
        );
        if (orderCreated) {
          clearCart();
          localStorage.removeItem("savedCoupon");
          setSuccess(true);
          setTimeout(() => router.push("/"), 1500);
        }
      } catch (e) {
        setError("An error occurred while creating the order");
        setLoading(false);
      }
    };

    checkPaymentAndOrder();
  }, [id, checkoutId, router]);

  if (loading) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid rgba(215, 223, 43, 1)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <h2 style={{ margin: 0, fontSize: "1.25rem" }}>
          Payment Status In Progress
        </h2>
        <p style={{ color: "#666", margin: 0 }}>
          Checking payment status...
        </p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (paymentFailed) {
    return (
      <>
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem",
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "2rem",
              maxWidth: "400px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                margin: "0 auto 1rem",
                borderRadius: "50%",
                background: "#ffebee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              ✕
            </div>
            <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem" }}>
              Payment Failed
            </h2>
            <p style={{ color: "#666", margin: "0 0 1.5rem" }}>
              The payment could not be completed. Please try again from the checkout page.
            </p>
            <button
              onClick={() => router.push("/checkout")}
              style={{
                padding: "0.6rem 1.5rem",
                background: "rgba(215, 223, 43, 1)",
                color: "#000",
                border: "none",
                borderRadius: "8px",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Back to Checkout
            </button>
          </div>
        </div>
      </>
    );
  }

  if (error && !success) {
    return (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          minHeight: "50vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <h1>Payment Result</h1>
        <p style={{ color: "red", margin: 0 }}>{error}</p>
        <button
          onClick={() => router.push("/checkout")}
          style={{
            padding: "0.5rem 1rem",
            cursor: "pointer",
            background: "rgba(215, 223, 43, 1)",
            border: "none",
            borderRadius: "8px",
          }}
        >
          Back to Checkout
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "1rem",
        }}
        role="dialog"
        aria-modal="true"
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "2rem",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              margin: "0 auto 1rem",
              borderRadius: "50%",
              background: "#e8f5e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}
          >
            ✓
          </div>
          <h2 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem" }}>
            Payment Successful
          </h2>
          <p style={{ color: "#666", margin: "0 0 1.5rem" }}>
            Your payment was completed and the order has been placed. Redirecting to home...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "2rem",
        textAlign: "center",
        minHeight: "50vh",
      }}
    >
      <h1>Payment Result</h1>
      <p>Payment result will appear here.</p>
    </div>
  );
};

const PaymentResultFallback = () => (
  <div
    style={{
      padding: "2rem",
      textAlign: "center",
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "1rem",
    }}
  >
    <div
      style={{
        width: "48px",
        height: "48px",
        border: "4px solid #f3f3f3",
        borderTop: "4px solid rgba(215, 223, 43, 1)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
    <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Payment Status In Progress</h2>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

const PaymentResultPage = () => (
  <Suspense fallback={<PaymentResultFallback />}>
    <PaymentResultContent />
  </Suspense>
);

export default PaymentResultPage;
