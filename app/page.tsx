"use client";
import Image from "next/image";
import SaleBar from './components/SaleBar';
import Navbar from './components/Navbar';
import TopSellers from './components/TopSeller';
import AllScarfsSection from './components/AllScarf';
import { FaWhatsapp } from "react-icons/fa"; // Using react-icons
import Footer from './components/Footer';
import NewArrival from './components/NewArrvial';

export default function Home() {
  const whatsappNumber = "+201027157089"; // replace with your WhatsApp number including country code
  const message = "Hello! I want to inqure about Scarfs."; // optional default message
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-white font-sans text-brown-800 relative">
      <SaleBar />
      <Navbar />
      <NewArrival/>
      <TopSellers/>
      <AllScarfsSection/>
      <Footer/>

      {/* WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 w-16 h-16 bg-green-500 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:bg-green-600 transition"
      >
        <FaWhatsapp />
      </a>
    </div>
  );
}
