"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/app/LanguageContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function HomeBundles() {
  const { lang } = useLanguage();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bundles"));
        const bundlesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBundles(bundlesData);
      } catch (err) {
        console.error("Failed to fetch bundles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBundles();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // ✅ show only first 3 bundles
  const displayedBundles = bundles.slice(0, 3);

  return (
    <section className="py-16 px-4">
      <h2
        className={`text-4xl mb-12 text-center text-amber-900 font-bold ${
          lang === "ar" ? "draw-ar" : "draw-en"
        }`}
      >
        {lang === "ar" ? "الباقات" : "Bundles"}
      </h2>

      {loading ? (
        <p className="text-center text-amber-800 text-lg">Loading...</p>
      ) : bundles.length === 0 ? (
        <p className="text-center text-amber-700 text-lg">
          {lang === "ar" ? "قريباً..." : "Coming Soon..."}
        </p>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {displayedBundles.map((bundle) => (
              <motion.div
                key={bundle.id}
                variants={cardVariants}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                }}
                className="bg-white rounded-3xl shadow-lg p-6 flex flex-col justify-between border border-amber-100 transition-all duration-300"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-amber-900 mb-2">
                    {lang === "ar"
                      ? bundle.title_ar || bundle.title
                      : bundle.title}
                  </h3>
                  <p className="text-amber-700 text-sm md:text-base mb-4">
                    {lang === "ar"
                      ? bundle.description_ar || bundle.description
                      : bundle.description}
                  </p>
                </div>

                <div className="flex flex-col items-center mt-4">
                  <span className="px-5 py-2 rounded-full bg-amber-100 text-amber-900 font-semibold text-lg mb-3">
                    {bundle.price} EGP
                  </span>
                  <Link href={`/Bundles/${bundle.id}`}>
                    <button className="px-6 py-2 bg-amber-700 text-white font-bold rounded-full hover:bg-amber-900 transition-all duration-300">
                      {lang === "ar" ? "عرض الباقة" : "View Bundle"}
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ✅ View More Button */}
          <div className="mt-10 text-center">
        <Link href="/Bundles" className="inline-block">
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
        </>
      )}
    </section>
  );
}
