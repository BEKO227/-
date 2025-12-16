"use client";

import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";

import SaleBar from "./components/SaleBar";
import TopSellers from "./components/TopSeller";
import AllScarfsSection from "./components/AllScarf";
import NewArrival from "./components/NewArrvial";
import Footer from "./components/Footer";
import SaleModal from "./components/SaleModal";
import { useLanguage } from "./LanguageContext";
import Categories from './components/Categories';
import HomeBundles from './components/Bundles';

export default function Home() {
  const whatsappNumber = "+201027157089";
  const message = "Hello! I want to inquire about Scarfs.";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { lang } = useLanguage();


  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <div
      className={`min-h-screen bg-[#FAF7F2] relative transition-all duration-300 
        ${lang === "ar" ? "rtl font-cairo" : "ltr font-serif text-brown-900"}`}
    >
      {/* Modal */}
      <SaleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Hero Background */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none"></div>

      <main className="mx-auto">

        {/* SALE BAR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <SaleBar />
        </motion.div>


        {/* NEW ARRIVALS */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <NewArrival />
        </motion.section>

        {/* GOLD DIVIDER */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent my-12" />
        

        {/* TOP SELLERS */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-14"
        >
          <TopSellers />
        </motion.section>
        

        {/* GOLD DIVIDER */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent my-12" />

        {/* CATEGORIES */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >

        <Categories

        />
        </motion.section>        

        <div className="w-full h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent my-12" />

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >

        <HomeBundles/>

        </motion.section>

        {/* GOLD DIVIDER */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent my-12" />

        {/* ALL SCARFS */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-20"
        >
          <AllScarfsSection />
        </motion.section>

      </main>

      {/* FOOTER */}
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
