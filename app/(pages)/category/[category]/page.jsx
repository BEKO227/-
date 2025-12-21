"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/LanguageContext";
import { useParams } from "next/navigation";
import ProductCard from "../../../components/ProductCard";

export default function CategoryPage() {
  const { lang } = useLanguage();
  const { category } = useParams(); // category from URL
  const [scarves, setScarves] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category lookup object
  const categoriesMap = {
    all: { en: "All", ar: "الكل" },
    kuwaiti_design1: { en: "Kuwaiti Design 1", ar: "كويتي رسمة 1" },
    kuwaiti_design2: { en: "Kuwaiti Design 2", ar: "كويتي رسمة 2" },
    thiland: { en: "Thiland", ar: "تايلاندي" },
    "dirty-linen": { en: "Dirty Linen", ar: "كتان متسخ" },
    plain: { en: "Plain", ar: "سادة" },
    chiffon: { en: "Chiffon", ar: "شيفون" },
    cotton: { en: "Cotton", ar: "قطن" },
    "lycra-cotton": { en: "Lycra Cotton", ar: "قطن ليكرا" },
    "printed-modal": { en: "Printed Modal", ar: "مودال مطبوع" },
    modal: { en: "Modal", ar: "مودال" },
    packet: { en: "Packet", ar: "بنادانا باكت" },
    bandana: { en: "Bandana", ar: "بنادانا" },
  };

  useEffect(() => {
    async function fetchScarves() {
      const snapshot = await getDocs(collection(db, "scarves"));
      const result = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        // If category === 'all', include all scarves
        if (
          category.toLowerCase() === "all" ||
          (data.category || "").trim().toLowerCase() === category.toLowerCase()
        ) {
          result.push({ id: doc.id, ...data });
        }
      });

      setScarves(result);
      setLoading(false);
    }

    fetchScarves();
  }, [category]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* Navbar */}
      <div className="w-full bg-[#fdfaf7] py-1 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <Link
            href="/"
            className="py-2 px-4 border text-amber-950 rounded-full hover:bg-amber-700"
          >
            🏚️
          </Link>

          <div
            className="text-2xl font-bold text-amber-700"
            style={{ fontFamily: "'Diwani Letter', sans-serif" }}
          >
            قَمَرْ
          </div>
        </div>
      </div>

      {/* Page Content */}
      <section className="py-16 px-6 bg-[#fdfaf7] min-h-screen">
        <h1
          className={`text-4xl mb-10 text-center text-amber-900 font-bold ${
            lang === "ar" ? "draw-ar" : "draw-en"
          }`}
        >
          {lang === "ar"
            ? categoriesMap[category]?.ar
            : categoriesMap[category]?.en}
        </h1>

        {loading ? (
          <p className="text-center text-amber-800 text-xl">
            {lang === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        ) : scarves.length === 0 ? (
          <p className="text-center text-amber-800 text-xl">
            {lang === "ar"
              ? "لا توجد أوشحة في هذه الفئة"
              : "No scarves in this category"}
          </p>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {scarves.map((product) => (
              <motion.div key={product.id} variants={cardVariants}>
                <ProductCard product={product} small />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
}
