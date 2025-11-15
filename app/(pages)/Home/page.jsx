// app/page.jsx
import React from "react";
import SaleBar from "@/components/SaleBar";
import Navbar from "@/components/Navbar";
import NewArrivalsCarousel from "@/components/NewArrivalsCarousel";
import TopSellers from '../../components/TopSeller';


export default function Home() {
  return (
    <div className="bg-white text-brown-800 font-sans">
      <SaleBar />
      <Navbar />
      <NewArrivalsCarousel />
      <TopSellers/>
    </div>
  );
}
