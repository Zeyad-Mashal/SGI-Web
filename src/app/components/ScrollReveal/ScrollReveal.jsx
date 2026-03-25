"use client";
import { useEffect } from "react";
import "./ScrollReveal.css";

const ScrollReveal = () => {
  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const nodes = Array.from(
      document.querySelectorAll('[data-reveal="true"]'),
    );

    nodes.forEach((node, i) => {
      // simple stagger for a smoother stacked reveal
      const delayMs = Math.min(i * 80, 320);
      node.style.setProperty("--reveal-delay", `${delayMs}ms`);
    });

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      nodes.forEach((n) => n.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return null;
};

export default ScrollReveal;

