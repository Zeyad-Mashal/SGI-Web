import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Featrues from "../components/Featrues/Featrues";
import Brands from "../components/Brands/Brands";
import Featured_Products from "../components/Featured_Products/Featured_Products";
import Banner from "../components/Banner/Banner";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Featrues />
      <Brands />
      <Featured_Products />
      <Banner />
    </div>
  );
};

export default Home;
