"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useLanguage } from "@/app/LanguageContext";

export default function TopSellersPage() {
  const { lang } = useLanguage();
  const router = useRouter();
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <>
      {/* Navbar with Back Button */}
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

      {/* Top Sellers Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-6 bg-linear-to-b from-[#fdfaf7] to-[#fff9f2] min-h-screen">
        <h1
          className={`text-4xl mb-12 text-center font-extrabold text-amber-900 tracking-wide ${
            lang === "ar" ? "draw-ar" : "draw-en"
          }`}
        >
          {lang === "ar" ? "الأكثر مبيعًا" : "Top Sellers"}
        </h1>

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
            className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {topSellers.map((item) => (
              <motion.div key={item.id} variants={cardVariants}>
                <div
                  onClick={() => router.push(`/products/${item.id}`)}
                  className="group relative rounded-3xl overflow-hidden shadow-lg sm:shadow-2xl hover:shadow-3xl transition-transform duration-500 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm sm:backdrop-blur-lg cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="relative w-full h-56 sm:h-72 overflow-hidden rounded-t-3xl">
                    <img
                      src={item.images?.[0] || "/placeholder.jpg"}
                      alt={lang === "ar" ? item.title_ar || item.title : item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/50 z-10" />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap gap-2 z-20">
                    {item.isTopSeller && (
                      <span className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow bg-linear-to-r from-amber-400 to-amber-600">
                        {lang === "ar" ? "الأكثر مبيعًا" : "Top Seller"}
                      </span>
                    )}
                    {item.isNewArrival && (
                      <span className="px-3 py-1 text-xs font-semibold text-white rounded-full shadow bg-linear-to-r from-blue-400 to-blue-600">
                        {lang === "ar" ? "وصول جديد" : "New Arrival"}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5">
                    <h3 className="text-xl font-serif text-amber-900 leading-snug mb-2">
                      {lang === "ar" ? item.title_ar || item.title : item.title}
                    </h3>

                    <p className="text-lg text-amber-700 font-bold mb-2">
                      {item.price}EGP
                    </p>

                    <p className="text-gray-500 text-sm mb-3">
                      {lang === "ar" ? "المخزون" : "Stock"}: {item.stock}
                    </p>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span
                          key={idx}
                          className={`transition-colors duration-300 ${
                            idx < Math.round(item.ratingsAverage)
                              ? "text-yellow-400 hover:text-yellow-500"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-gray-400 text-xs ml-1">
                        ({item.ratingsQuantity})
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
}
