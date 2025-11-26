"use client";
import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

import SaleBar from './components/SaleBar';
import TopSellers from './components/TopSeller';
import AllScarfsSection from './components/AllScarf';
import NewArrival from './components/NewArrvial';
import Footer from './components/Footer';
import SaleModal from './components/SaleModal';

export default function Home() {
  const whatsappNumber = "+201027157089";
  const message = "Hello! I want to inquire about Scarfs.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Show modal every time the user visits home
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <div className="bg-white font-sans text-brown-800 relative">
      {/* Sale Modal */}
      <SaleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Page Sections */}
      <SaleBar />
      <NewArrival />
      <TopSellers />
      <AllScarfsSection />
      <Footer />

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
