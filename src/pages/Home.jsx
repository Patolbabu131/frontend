import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CoursesSection from "../components/CoursesSection";
import CertificationSection from "../components/CertificationSection";
import Collab from "../components/Collab";
import Footer from "../components/Footer";
import CoursesCard from "../admin/pages/CoursesCard";

function Home() {
  useEffect(() => {
    // 1) set the Chatling config on window
    window.chtlConfig = { chatbotId: "9586524846" };

    // 2) create and append the Chatling embed script
    const script = document.createElement("script");
    script.async = true;
    script.id = "chatling-embed-script";
    script.type = "text/javascript";
    script.src = "https://chatling.ai/js/embed.js";
    script.setAttribute("data-id", "9586524846");
    document.body.appendChild(script);

    // 3) clean up on unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []); // empty deps → only run once on mount

  return (
    <>
      <Navbar />
      <HeroSection />
      <CertificationSection />
      <CoursesCard />
      <Collab />
      <Footer />
    </>
  );
}

export default Home;
