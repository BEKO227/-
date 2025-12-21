"use client";

import React, { useEffect, useState } from "react";
import ProductCard from './../../components/ProductCard';
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/LanguageContext";

export default function AllScarfsPage() {
  const { lang } = useLanguage();
  const [scarves, setScarves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Define categories
  const categories = [
    { key: "all", en: "All", ar: "الكل" },
    { key: "kuwaiti_design1", en: "Kuwaiti Design 1", ar: "كويتي رسمة 1" },
    { key: "kuwaiti-design2", en: "Kuwaiti Design 2", ar: "كويتي رسمة 2" },
    { key: "thiland", en: "Thiland", ar: "تايلاندي" },
    { key: "chiffon", en: "Chiffon", ar: "شيفون" },
    { key: "printed-modal", en: "Printed Modal", ar: "مودال مطبوع" },
    { key: "modal", en: "Modal", ar: "مودال" },
    { key: "packet", en: "Packet", ar: "بنادانا باكت" },
    { key: "bandana", en: "Bandana", ar: "بنادانا" },
    { key: "dirty-linen", en: "Dirty Linen", ar: "كتان متسخ" },
    { key: "plain", en: "Plain", ar: "سادة" },
    { key: "cotton", en: "Cotton", ar: "قطن" },
    { key: "lycra-cotton", en: "Lycra Cotton", ar: "قطن ليكرا" },
  ];

  // Fetch scarves from Firestore
  useEffect(() => {
    async function fetchScarves() {
      const querySnapshot = await getDocs(collection(db, "scarves"));
      const fetchedScarves = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedScarves.push({ 
          id: doc.id, 
          ...data, 
          category: (data.category || "uncategorized").trim().toLowerCase()
        });
      });
      setScarves(fetchedScarves);
      setLoading(false);
    }
    fetchScarves();
  }, []);

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Filter scarves based on selected category
  const filteredScarves = scarves.filter(product =>
    selectedCategory === "all"
      ? true
      : (product.category || "").trim().toLowerCase() === selectedCategory
  );

  return (
    <>
      {/* Navbar */}
      <div className="w-full bg-[#fdfaf7] py-1 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <Link
            href="/"
            className="py-2 px-4 border text-amber-950 rounded-full hover:bg-amber-700 transition-colors"
          >
            🏚️
          </Link>
          <div
            className="text-2xl font-bold text-amber-700"
            style={{
              fontFamily: "'Diwani Letter', sans-serif",
              fontSize: "1.5rem",
              fontWeight: "bold",
            }}
          >
            قَمَرْ
          </div>
        </div>
      </div>

      {/* Scarves Section */}
      <section className="py-16 px-6 bg-[#fdfaf7] min-h-screen">
        <h1  className={`
            text-4xl mb-6 text-center text-amber-900 font-bold
            ${lang === "ar" ? "draw-ar" : "draw-en"}
          `}>
          {lang === "ar" ? "جميع الأوشحة" : "All Scarves"}
        </h1>

        {/* Categories Filter - Dropdown */}
        <div className="flex justify-center mb-8">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-[#D4AF37] rounded-lg text-amber-900 font-semibold bg-white hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
          >
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {lang === "ar" ? cat.ar : cat.en}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent my-12" />

        {loading ? (
          <p className="text-center text-amber-800 text-xl">
            {lang === "ar" ? "جاري تحميل الأوشحة..." : "Loading scarfs..."}
          </p>
        ) : filteredScarves.length === 0 ? (
          <p className="text-center text-amber-800 text-xl">
            {lang === "ar" ? "لا توجد أوشحة لهذه الفئة" : "No scarves in this category"}
          </p>
        ) : (
          <motion.div
            key={selectedCategory}   // ✅ FORCE RE-ANIMATION
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredScarves.map((product) => (
              <motion.div key={product.id} variants={cardVariants}>
                <ProductCard product={product} small={true} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
}
