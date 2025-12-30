"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./../../components/ProductCard";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/LanguageContext";
import { useRouter } from "next/navigation";

export default function AllScarfsPage() {
  const { lang } = useLanguage();
  const [scarves, setScarves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");

  const router = useRouter();

  // MAIN categories
  const categories = [
    { key: "all", en: "All", ar: "الكل" },
    { key: "cotton", en: "Cotton", ar: "قطن" },
    { key: "bandana", en: "Bandana", ar: "بنادانا" },
    { key: "chiffon", en: "Chiffon", ar: "شيفون" },
    { key: "silk", en: "Silk", ar: "حرير" },
    { key: "kuwaiti", en: "Kuwaiti", ar: "كويتي" },
    { key: "thiland", en: "Thailand", ar: "تايلاندي" },
  ];

  // SUB-CATEGORIES per category (edit later as you add more)
  const subCategories = {
    cotton: [
      { key: "all", en: "All", ar: "الكل" },
      { key: "modal", en: "Modal", ar: "مودال" },
      { key: "printed_modal", en: "Printed Modal", ar: "مودال مطبوع" },
      { key: "jel", en: "Gel", ar: "چيل" },
      { key: "packet", en: "Packet", ar: "باكيت" },
    ],
    kuwaiti: [
      { key: "all", en: "All", ar: "الكل" },
      { key: "woven", en: "Woven", ar: "منسوج" },
      { key: "breezy", en: "Breezy", ar: "خفيف" },
    ],
  };

  useEffect(() => {
    async function fetchScarves() {
      const querySnapshot = await getDocs(collection(db, "scarves"));
      const fetched = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();

        fetched.push({
          id: doc.id,
          ...data,
          category: (data.category || "").trim().toLowerCase(),
          subCategory: (data.subCategory || "").trim().toLowerCase(),
        });
      });

      setScarves(fetched);
      setLoading(false);
    }

    fetchScarves();
  }, []);

  // Filter logic
  const filteredScarves = scarves.filter((p) => {
    const cat = (p.category || "").toLowerCase();
    const sub = (p.subCategory || "").toLowerCase();

    // no filter
    if (selectedCategory === "all") return true;

    // category only
    if (selectedSubCategory === "all")
      return cat === selectedCategory;

    // category + subcategory
    return cat === selectedCategory && sub === selectedSubCategory;
  });

  // animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      {/* Navbar */}
      <div className="w-full bg-[#fdfaf7] py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <button
            onClick={() => router.back()}
            className="py-2 px-4 border text-amber-950 rounded-full hover:bg-amber-700 transition-colors duration-300"
          >
            ← {lang === "ar" ? "رجوع" : "Back"}
          </button>
        </div>
      </div>

      <section className="py-16 px-6 bg-[#fdfaf7] min-h-screen">
        <h1
          className={`text-4xl mb-6 text-center text-amber-900 font-bold ${
            lang === "ar" ? "draw-ar" : "draw-en"
          }`}
        >
          {lang === "ar" ? "جميع الأوشحة" : "All Scarves"}
        </h1>

        {/* CATEGORY SELECT */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">

          {/* main */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory("all");
            }}
            className="px-4 py-2 border rounded-lg"
          >
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {lang === "ar" ? cat.ar : cat.en}
              </option>
            ))}
          </select>

          {/* sub — only show when NOT all */}
          {selectedCategory !== "all" &&
            subCategories[selectedCategory] && (
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                {subCategories[selectedCategory].map((sub) => (
                  <option key={sub.key} value={sub.key}>
                    {lang === "ar" ? sub.ar : sub.en}
                  </option>
                ))}
              </select>
            )}
        </div>

        {loading ? (
          <p className="text-center text-xl text-amber-800">
            {lang === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        ) : filteredScarves.length === 0 ? (
          <p className="text-center text-xl text-amber-800">
            {lang === "ar"
              ? "لا توجد منتجات لهذه الفئة"
              : "No products in this category"}
          </p>
        ) : (
          <motion.div
            key={selectedCategory + selectedSubCategory}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredScarves.map((p) => (
              <motion.div key={p.id} variants={cardVariants}>
                <ProductCard product={p} small />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
}
