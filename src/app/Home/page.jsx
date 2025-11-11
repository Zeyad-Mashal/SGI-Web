import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Featrues from "../components/Featrues/Featrues";
import Brands from "../components/Brands/Brands";
import Featured_Products from "../components/Featured_Products/Featured_Products";
import Banner from "../components/Banner/Banner";
import Our_Products from "../components/Our_Products/Our_Products";
import ContactUs from "../components/ContactUs/ContactUs";
import Footer from "../components/Footer/Footer";

const Home = () => {
  return (
    <div>
      <Hero />
      <Featrues />
      <Brands />
      <Featured_Products />
      <Banner />
      <Our_Products />
      <ContactUs />
    </div>
  );
};

export default Home;
