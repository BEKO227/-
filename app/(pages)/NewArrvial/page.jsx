"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/LanguageContext";

export default function NewArrivalPage() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const q = query(
          collection(db, "scarves"),
          where("isNewArrival", "==", true)
        );
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNewArrivals(products);
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  /* Animations */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <>
      {/* Top Bar */}
      <div className="w-full bg-[#fdfaf7] py-2 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <Link
            href="/"
            className="py-2 px-4 border border-amber-800/30 rounded-full
                       text-amber-900 hover:bg-amber-800 hover:text-white
                       transition-all"
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
      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Title */}
        <h1
          className={`
            text-4xl mb-6 text-center text-amber-900
            ${lang === "ar" ? "draw-ar" : "draw-en"}
          `}
        >
          {lang === "en" ? "New Arrivals" : "أحدث المنتجات"}
        </h1>

        {/* Divider */}
        <div className="w-full h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent my-10" />

        {/* Content */}
        {loading ? (
          <p className="text-center text-amber-700 text-lg">
            {lang === "en" ? "Loading..." : "جاري التحميل..."}
          </p>
        ) : newArrivals.length === 0 ? (
          <p className="text-center text-amber-700 text-lg">
            {lang === "en"
              ? "No new arrivals at the moment."
              : "لا توجد منتجات جديدة حالياً"}
          </p>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {newArrivals.map((product) => (
              <motion.div key={product.id} variants={cardVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
}
