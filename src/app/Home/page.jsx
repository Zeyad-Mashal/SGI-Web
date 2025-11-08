import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Featrues from "../components/Featrues/Featrues";
import Brands from "../components/Brands/Brands";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <Featrues />
      <Brands />
    </div>
  );
};

export default Home;
