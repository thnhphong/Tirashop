import React from "react";
import Hero from "./Hero";
import OurProducts from "./Main/OurProducts";
import OurStory from "./Main/OurStory";
import BakeryCategories from "./Main/BakeryCategories";
import BeverageCategories from "./Main/BeverageCategories";
import { useEffect } from "react";

const Main = () => {
  useEffect(() => {
    document.title = "Tirashop - Home";
  }, []);
  return (
    <main className="pt-0"> {/* <-- pushes content below navbar */}
      <Hero/>
      <BakeryCategories/>
      <BeverageCategories/>
      <OurProducts />
      <OurStory />
    </main>
  );
};

export default Main;
