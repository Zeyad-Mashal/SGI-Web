import dynamic from "next/dynamic";
import Hero from "../components/Hero/Hero";
import { fetchHomePageData } from "@/lib/server/storefrontPrefetch";

const Featrues = dynamic(() => import("../components/Featrues/Featrues"));
const Brands = dynamic(() => import("../components/Brands/Brands"));
const Featured_Products = dynamic(() =>
  import("../components/Featured_Products/Featured_Products"),
);
const Banner2 = dynamic(() => import("../components/Banner2/Banner2"));
const Banner = dynamic(() => import("../components/Banner/Banner"));
const Categories = dynamic(() => import("../components/Categories/Categories"));
const Our_Products = dynamic(() =>
  import("../components/Our_Products/Our_Products"),
);
const ContactUs = dynamic(() => import("../components/ContactUs/ContactUs"));
const ScrollReveal = dynamic(() =>
  import("../components/ScrollReveal/ScrollReveal"),
);

export default async function Home() {
  const { featured, products, categories, brands } = await fetchHomePageData();

  return (
    <div>
      <div className="home-hero-enter">
        <Hero />
      </div>

      <div className="home-reveal" data-reveal="true">
        <Featrues />
      </div>

      <div className="home-reveal" data-reveal="true">
        <Brands initialBrands={brands} />
      </div>

      <div className="home-reveal" data-reveal="true">
        <Featured_Products initialProducts={featured} />
      </div>

      <div className="home-reveal" data-reveal="true">
        <Banner2 />
      </div>

      <div className="home-reveal" data-reveal="true">
        <Banner />
      </div>

      <div className="home-reveal" data-reveal="true">
        <Categories initialCategories={categories} />
      </div>

      <div className="home-reveal" data-reveal="true">
        <Our_Products initialProducts={products} />
      </div>

      <div className="home-reveal" data-reveal="true">
        <ContactUs />
      </div>

      <ScrollReveal />
    </div>
  );
}
