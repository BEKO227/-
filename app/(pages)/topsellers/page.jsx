"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { allScarfs } from './../../../data/products';
import { useLanguage } from '@/app/LanguageContext';

// Filter top sellers
const topSellers = allScarfs.filter((item) => item.isTopSeller === true);

export default function TopSellersPage() {
  const { lang } = useLanguage(); // Get current language

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
      <section className="py-20 bg-[#fdfaf7]">
        <motion.h1
          className="text-4xl font-bold text-center text-amber-800 mb-16 tracking-wide uppercase"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {lang === "en" ? "All Top Sellers" : "جميع المنتجات الأكثر مبيعًا"}
        </motion.h1>
        
        <div className="w-full h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent my-12" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {topSellers.map((item, i) => {
            const MotionLink = motion(Link);
            return (
              <MotionLink
                key={i}
                href={`/products/${item.id}`}
                className="rounded-2xl overflow-hidden shadow-lg group relative"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              >
                <img
                  src={item.imageCover}
                  alt={item.title}
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end justify-center">
                  <p className="text-white text-lg font-semibold mb-4">
                    {lang === "en" ? item.titleEn || item.title : item.titleAr || item.title}
                  </p>
                </div>
              </MotionLink>
            );
          })}
        </div>
      </section>
    </>
  );
}
