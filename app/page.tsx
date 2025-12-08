"use client";

import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";

import SaleBar from "./components/SaleBar";
import TopSellers from "./components/TopSeller";
import AllScarfsSection from "./components/AllScarf";
import NewArrival from "./components/NewArrvial";
import Footer from "./components/Footer";
import SaleModal from "./components/SaleModal";
import { useLanguage } from "./LanguageContext";

export default function Home() {
  const whatsappNumber = "+201027157089";
  const message = "Hello! I want to inquire about Scarfs.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { lang } = useLanguage();

  // Show popup on home visit
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <div
      className={`min-h-screen bg-white relative transition-all duration-300 ${
        lang === "ar" ? "rtl font-cairo" : "ltr font-sans text-brown-900"
      }`}
    >
      {/* Modal */}
      <SaleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Hero Background */}
      <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-[0.08] pointer-events-none"></div>

      {/* Content */}
      <main className="space-y-20 pt-6 md:pt-10">
        <SaleBar />

        <section className="animate-fade-in-up">
          <NewArrival />
        </section>

        <section className="animate-fade-in-up delay-150">
          <TopSellers />
        </section>

        <section className="animate-fade-in-up delay-300">
          <AllScarfsSection />
        </section>
      </main>

      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="
          fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full
          bg-green-500 shadow-xl shadow-green-700/40 
          flex items-center justify-center text-white text-3xl 
          hover:bg-green-600 active:scale-95 
          transition-all duration-300 hover:shadow-2xl
          hover:shadow-green-600/50
        "
      >
        <FaWhatsapp />
      </a>
    </div>
  );
}
