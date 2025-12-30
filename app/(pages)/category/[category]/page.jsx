"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/LanguageContext";
import { useParams, useRouter } from "next/navigation";
import ProductCard from "../../../components/ProductCard";

export default function CategoryPage() {
  const { lang } = useLanguage();
  const { category } = useParams();
  const router = useRouter();

  const [scarves, setScarves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState("all");

  // TWO-STEP CATEGORY MAP
  const categoriesMap = {
    all: { en: "All", ar: "الكل", sub: [] },

    cotton: {
      en: "Cotton",
      ar: "قطن",
      sub: [
        { key: "modal", en: "Modal", ar: "مودال" },
        { key: "printed_modal", en: "Printed Modal", ar: "مودال مطبوع" },
        { key: "jel", en: "Jel", ar: "چيل" },
        { key: "packet", en: "Packet", ar: "باكيت" },
      ],
    },

    bandana: { en: "Bandana", ar: "بنادانا", sub: [] },

    chiffon: { en: "Chiffon", ar: "شيفون", sub: [] },

    silk: { en: "Silk", ar: "حرير", sub: [] },

    kuwaiti: {
      en: "Kuwaiti",
      ar: "كويتي",
      sub: [
        { key: "woven", en: "Woven", ar: "منسوج" },
        { key: "breezy", en: "Breezy", ar: "خفيف" },
      ],
    },

    thiland: { en: "Thailand", ar: "تايلاندي", sub: [] },
  };

  useEffect(() => {
    async function fetchScarves() {
      setLoading(true);

      const snapshot = await getDocs(collection(db, "scarves"));
      const result = [];

      snapshot.forEach((doc) => {
        const data = doc.data();

        const cat = (data.category || "").toLowerCase().trim();
        const sub = (data.subCategory || "").toLowerCase().trim();
        const urlCat = category.toLowerCase();

        // 1️⃣ Show all
        if (urlCat === "all") {
          result.push({ id: doc.id, ...data });
          return;
        }

        // 2️⃣ Filter by main category
        if (cat !== urlCat) return;

        // 3️⃣ If sub selected → filter also by sub
        if (selectedSub !== "all" && sub !== selectedSub) return;

        result.push({ id: doc.id, ...data });
      });

      setScarves(result);
      setLoading(false);
    }

    fetchScarves();
  }, [category, selectedSub]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const currentCat = categoriesMap[category];

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
        {/* Title */}
        <h1 className="text-4xl mb-8 text-center text-amber-900 font-bold">
          {lang === "ar" ? currentCat?.ar : currentCat?.en}
        </h1>

        {/* SUB CATEGORY FILTER */}
        {currentCat?.sub?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setSelectedSub("all")}
              className={`px-4 py-2 border rounded-full ${
                selectedSub === "all"
                  ? "bg-amber-800 text-white"
                  : "text-amber-900"
              }`}
            >
              {lang === "ar" ? "الكل" : "All"}
            </button>

            {currentCat.sub.map((s) => (
              <button
                key={s.key}
                onClick={() => setSelectedSub(s.key)}
                className={`px-4 py-2 border rounded-full ${
                  selectedSub === s.key
                    ? "bg-amber-800 text-white"
                    : "text-amber-900"
                }`}
              >
                {lang === "ar" ? s.ar : s.en}
              </button>
            ))}
          </div>
        )}

        {/* CONTENT */}
        {loading ? (
          <p className="text-center text-amber-800 text-xl">
            {lang === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        ) : scarves.length === 0 ? (
          <p className="text-center text-amber-800 text-xl">
            {lang === "ar"
              ? "لا توجد منتجات في هذا القسم"
              : "No products in this category"}
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
