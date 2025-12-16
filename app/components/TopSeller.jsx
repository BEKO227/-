"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useLanguage } from "@/app/LanguageContext";

export default function TopSellers() {
  const { lang } = useLanguage();
  const MotionLink = motion(Link);

  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopSellers() {
      const snapshot = await getDocs(collection(db, "scarves"));
      const products = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.isTopSeller) {
          products.push({ id: doc.id, ...data });
        }
      });
      // Only take the first 3 top sellers
      setTopSellers(products.slice(0, 3));
      setLoading(false);
    }
    fetchTopSellers();
  }, []);

  if (loading) {
    return (
      <p className="text-center text-amber-800 text-xl py-20">
        {lang === "ar" ? "جاري تحميل المنتجات..." : "Loading products..."}
      </p>
    );
  }

  return (
    <section className="py-20 bg-[#fdfaf7] relative overflow-hidden">
      <motion.h2
        className={`text-4xl mb-6 text-center text-amber-900 font-bold ${
          lang === "ar" ? "draw-ar" : "draw-en"
        }`}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {lang === "ar" ? "الأكثر مبيعاً" : "Top Sellers"}
      </motion.h2>

      {/* Desktop Collage Layout */}
      <div className="relative w-full max-w-6xl mx-auto h-[600px] hidden md:block">
        {topSellers.map((item, i) => {
          const desktopImage =
            item.images && item.images.length > 1
              ? item.images[1]
              : item.images?.[0] || "/placeholder.jpg";

          return (
            <MotionLink
              key={item.id}
              href={`/products/${item.id}`}
              className={`absolute rounded-2xl overflow-hidden shadow-lg group transition-all duration-500 ${
                i === 0
                  ? "top-0 left-0 w-[40%] h-[60%] rotate-2"
                  : i === 1
                  ? "top-10 right-0 w-[45%] h-[70%] rotate-2"
                  : "bottom-0 left-[25%] w-[35%] h-[50%]"
              }`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            >
              <img
                src={desktopImage}
                alt={lang === "ar" ? item.title_ar || item.title : item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end items-center p-4">
                <p className="text-white text-lg font-semibold mb-2 text-center">
                  {lang === "ar" ? item.title_ar || item.title : item.title}
                </p>
                <p className="text-white font-medium text-sm mb-1">
                  {lang === "ar" ? "السعر" : "Price"}: ${item.price}
                </p>
                <p className="text-white font-medium text-sm mb-2">
                  {lang === "ar" ? "المخزون" : "Stock"}: {item.stock}
                </p>
                {item.isNewArrival && (
                  <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                    {lang === "ar" ? "وصول جديد" : "New Arrival"}
                  </span>
                )}
              </div>
            </MotionLink>
          );
        })}
      </div>

      {/* Mobile Stacked Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 md:hidden pb-24">
        {topSellers.map((item) => (
          <MotionLink
            key={item.id}
            href={`/products/${item.id}`}
            className="rounded-2xl overflow-hidden shadow-md group relative"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={item.images?.[0] || "/placeholder.jpg"}
              alt={lang === "ar" ? item.title_ar || item.title : item.title}
              className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end items-center p-4">
              <p className="text-white text-base font-medium mb-1 text-center">
                {lang === "ar" ? item.title_ar || item.title : item.title}
              </p>
              <p className="text-white font-medium text-sm mb-1">
                {lang === "ar" ? "السعر" : "Price"}: ${item.price}
              </p>
              <p className="text-white font-medium text-sm mb-2">
                {lang === "ar" ? "المخزون" : "Stock"}: {item.stock}
              </p>
              {item.isNewArrival && (
                <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                  {lang === "ar" ? "وصول جديد" : "New Arrival"}
                </span>
              )}
            </div>
          </MotionLink>
        ))}
      </div>

      {/* View More Button */}
      <div className="mt-6 md:mt-20 text-center">
        <Link href="/topsellers">
          <button className="px-6 py-3 rounded-full border border-amber-900 text-amber-900 font-semibold hover:bg-amber-700 transition-colors duration-300 cursor-pointer hover:scale-105">
            {lang === "ar" ? "عرض المزيد" : "View More"}
          </button>
        </Link>
      </div>
    </section>
  );
}
