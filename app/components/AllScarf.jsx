"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { db } from '@/lib/firebase';
import { collection, getDocs } from "firebase/firestore";
import { useLanguage } from "../LanguageContext"; // import language context

export default function AllScarfsSection() {
  const [scarfs, setScarfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage(); // get current language

  useEffect(() => {
    async function fetchScarfs() {
      const querySnapshot = await getDocs(collection(db, "scarves"));
      const scarves = [];
      querySnapshot.forEach((doc) => {
        scarves.push({ id: doc.id, ...doc.data() });
      });
      setScarfs(scarves);
      setLoading(false);
    }

    fetchScarfs();
  }, []);

  // Take only the first 4 scarves for preview
  const topScarfs = scarfs.slice(0, 6);

  if (loading) {
    return (
      <section className="py-16 px-6 bg-[#fdfaf7] text-center">
        <p className="text-xl text-amber-900 font-semibold">
          {lang === "en" ? "Loading scarfs..." : "جاري تحميل الأوشحة..."}
        </p>
      </section>
    );
  }

  return (
    <section
      id="all-scarfs"
      className={`py-16 px-6 bg-[#fdfaf7] ${lang === "ar" ? "rtl font-cairo" : "ltr font-sans"}`}
    >
      <h2           
      className={`
            text-4xl mb-6 text-center text-amber-900 font-bold
            ${lang === "ar" ? "draw-ar" : "draw-en"}
          `}>
        {lang === "en" ? "All Scarves" : "كل الأوشحة"}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {topScarfs.map((scarf, index) => (
          <ProductCard key={`${scarf.id}-${index}`} product={scarf} small={true} />
        ))}
      </div>

      {/* View More Button */}
      <div className="mt-10 text-center">
        <Link href="/AllScarfs" className="inline-block">
          <button
            className="
              px-7 py-3.5 rounded-full
              font-semibold
              border border-amber-900
              text-amber-900
              bg-white

              shadow-[0_6px_18px_rgba(0,0,0,0.06)]
              hover:shadow-[0_10px_28px_rgba(0,0,0,0.10)]

              hover:bg-linear-to-r hover:from-amber-700 hover:to-amber-900
              hover:text-white

              transition-all duration-300 ease-out
              hover:scale-105 active:scale-95
              focus:outline-none focus:ring-2 focus:ring-amber-500/50
            "
          >
            {lang === "en" ? "View More" : "عرض المزيد"}
          </button>
        </Link>
      </div>

    </section>
  );
}
