import React from "react";
import Hero from "../components/Hero/Hero";
import Featrues from "../components/Featrues/Featrues";
import Brands from "../components/Brands/Brands";
import Featured_Products from "../components/Featured_Products/Featured_Products";
import Banner from "../components/Banner/Banner";
import Our_Products from "../components/Our_Products/Our_Products";
import ContactUs from "../components/ContactUs/ContactUs";
import Categories from "../components/Categories/Categories";
import Banner2 from "../components/Banner2/Banner2";
import ScrollReveal from "../components/ScrollReveal/ScrollReveal";

const Home = () => {
  return (
    <div>
      <div className="home-hero-enter">
        <Hero />
      </div>

      <div className="home-reveal" data-reveal="true">
        <Featrues />
      </div>

      <div className="home-reveal" data-reveal="true">
        <Brands />
      </div>

      <div className="home-reveal" data-reveal="true">
        <Featured_Products />
      </div>

      <div className="home-reveal" data-reveal="true">
        <Banner2 />
      </div>

      <div className="home-reveal" data-reveal="true">
        <Banner />
      </div>

      <div className="home-reveal" data-reveal="true">
        <Categories />
      </div>

      <div className="home-reveal" data-reveal="true">
        <Our_Products />
      </div>

      <div className="home-reveal" data-reveal="true">
        <ContactUs />
      </div>

      <ScrollReveal />
    </div>
  );
};

export default Home;
