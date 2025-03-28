import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CoursesSection from "../components/CoursesSection";
import CertificationSection from "../components/CertificationSection";
import Collab from "../components/Collab";
import Footer from "../components/Footer";
import CoursesCard from "../admin/pages/CoursesCard";

function Home() {
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