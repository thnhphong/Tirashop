import React from "react";
import Navbar from "./components/Navbar";
import Main from "./components/Main";
import Footer from "./components/Footer";
import ScrollToTopButton from "./components/ScrollToTopButton";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
     <Main />
     <Footer />
     <ScrollToTopButton />
     </div>
  )
};

export default Home;
