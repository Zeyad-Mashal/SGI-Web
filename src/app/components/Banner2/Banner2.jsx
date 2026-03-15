"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import "./Banner2.css";
import en from "../../../translation/en.json";
import ar from "../../../translation/ar.json";

const BANNER_SLIDES = [
  { src: "/images/Banner-3A.png", alt: "Banner 3A" },
  { src: "/images/Banner-3B.png", alt: "Banner 3B" },
  { src: "/images/Banner-3D.png", alt: "Banner 3D" },
];

const AUTO_PLAY_MS = 5000;

const Banner2 = () => {
  const [translations, setTranslations] = useState(en);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";
    setTranslations(lang === "ar" ? ar : en);
  }, []);

  const goTo = useCallback((index) => {
    setCurrentIndex((prev) => {
      if (index < 0) return BANNER_SLIDES.length - 1;
      if (index >= BANNER_SLIDES.length) return 0;
      return index;
    });
  }, []);

  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);
  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BANNER_SLIDES.length);
    }, AUTO_PLAY_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="banner2">
      <div className="banner2_slider_wrap">
        <div
          className="banner2_slider_track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {BANNER_SLIDES.map((slide, i) => (
            <div key={i} className="banner2_slide">
              <Image
                src={slide.src}
                alt={slide.alt}
                width={1920}
                height={600}
                className="banner2_slide_img"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="banner2_arrow banner2_arrow_prev"
          onClick={goPrev}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <button
          type="button"
          className="banner2_arrow banner2_arrow_next"
          onClick={goNext}
          aria-label="Next slide"
        >
          ›
        </button>

        <div className="banner2_dots">
          {BANNER_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`banner2_dot ${i === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === currentIndex}
            />
          ))}
        </div>
      </div>

      <div className="banner2_content">
        <button>
          <a href="/shop">{translations.shopnow}</a>
        </button>
      </div>
    </div>
  );
};

export default Banner2;
