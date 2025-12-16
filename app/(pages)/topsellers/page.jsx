"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useLanguage } from "@/app/LanguageContext";

export default function TopSellersPage() {
  const { lang } = useLanguage();
  const MotionLink = motion(Link);
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch top sellers from Firestore
  useEffect(() => {
    async function fetchTopSellers() {
      const querySnapshot = await getDocs(collection(db, "scarves"));
      const fetched = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isTopSeller) fetched.push({ id: doc.id, ...data });
      });
      setTopSellers(fetched);
      setLoading(false);
    }
    fetchTopSellers();
  }, []);

  // Framer Motion variants
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
      <div className="w-full bg-[#fdfaf7] py-2 shadow-md">
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

      {/* Top Sellers Section */}
      <section className="py-20 px-4 bg-[#fdfaf7] min-h-screen">
        <h1
          className={`text-4xl mb-6 text-center text-amber-900 font-bold ${
            lang === "ar" ? "draw-ar" : "draw-en"
          }`}
        >
          {lang === "ar" ? "الأكثر مبيعًا" : "Top Sellers"}
        </h1>

        <div className="w-full h-px my-12 bg-linear-to-r from-transparent via-[#D4AF37] to-transparent" />

        {loading ? (
          <p className="text-center text-amber-800 text-xl">
            {lang === "ar" ? "جاري تحميل المنتجات..." : "Loading products..."}
          </p>
        ) : topSellers.length === 0 ? (
          <p className="text-center text-amber-800 text-xl">
            {lang === "ar" ? "لا توجد منتجات" : "No products available"}
          </p>
        ) : (
          <motion.div
            className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {topSellers.map((item, i) => (
              <motion.div key={item.id} variants={cardVariants}>
                <MotionLink
                  href={`/products/${item.id}`}
                  className="rounded-2xl overflow-hidden shadow-lg group relative"
                >
                  {/* Product Image */}
                  <img
                    src={item.images?.[0] || "/placeholder.jpg"}
                    alt={lang === "ar" ? item.title_ar || item.title : item.title}
                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end items-center p-4">
                    <p className="text-white text-lg font-semibold mb-1 text-center">
                      {lang === "ar" ? item.title_ar || item.title : item.title}
                    </p>
                    <p className="text-white font-medium text-sm mb-1">
                      {lang === "ar" ? "السعر" : "Price"}: ${item.price}
                    </p>
                    <p className="text-white font-medium text-sm mb-1">
                      {lang === "ar" ? "المخزون" : "Stock"}: {item.stock}
                    </p>
                    {item.isNewArrival && (
                      <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full mb-1">
                        {lang === "ar" ? "وصول جديد" : "New Arrival"}
                      </span>
                    )}
                    <div className="flex items-center space-x-1 mt-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span
                          key={idx}
                          className={`text-yellow-400 ${
                            idx < Math.round(item.ratingsAverage) ? "" : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-white text-xs ml-1">({item.ratingsQuantity})</span>
                    </div>
                  </div>
                </MotionLink>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
}
