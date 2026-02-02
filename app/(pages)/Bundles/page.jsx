"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/app/LanguageContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function BundlesPage() {
  const { lang } = useLanguage();
  const router = useRouter();
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
      } catch (error) {
        console.error("Error fetching bundles:", error);
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

  return (
    <div className="min-h-screen bg-linear-to-b from-[#fdfaf7] to-[#fff9f2] pb-20">
      {/* Header */}
      <div className="w-full bg-[#fdfaf7] h-12 shadow-md py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <button
            onClick={() => router.back()}
            className="py-2 px-4 border text-amber-950 rounded-full hover:bg-amber-700 hover:text-white transition-all duration-300 shadow-sm"
          >
            ← {lang === "ar" ? "رجوع" : "Back"}
          </button>
        </div>
      </div>

      {/* Page Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-12"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900 mb-6">
          {lang === "ar" ? "الباقات الخاصة بنا" : "Our Bundles"}
        </h1>
        <p className="text-lg md:text-xl text-amber-700">
          {lang === "ar"
            ? "اختر الباقة المناسبة لك وتمتع بأفضل العروض"
            : "Choose the bundle that fits you and enjoy the best offers!"}
        </p>
      </motion.div>

      {/* Loading / Empty States */}
      {loading ? (
        <p className="text-center text-amber-900 font-semibold text-xl mt-20">
          {lang === "ar" ? "جارٍ التحميل..." : "Loading bundles..."}
        </p>
      ) : bundles.length === 0 ? (
        <p className="text-center text-amber-900 font-semibold text-xl mt-20">
          {lang === "ar" ? "قريباً..." : "Coming Soon..."}
        </p>
      ) : (
        <motion.div
          className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3 px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {bundles.map((bundle) => (
            <motion.div
              key={bundle.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-3xl shadow-lg p-6 border border-amber-100 flex flex-col justify-between transition-all duration-300"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-amber-900 mb-2">
                  {lang === "ar"
                    ? bundle.title_ar || bundle.title
                    : bundle.title}
                </h2>
                <p className="text-amber-700 mb-4">
                  {lang === "ar"
                    ? bundle.description_ar || bundle.description
                    : bundle.description}
                </p>
              </div>

              <div className="flex flex-col items-center mt-4">
                <span className="inline-block px-6 py-2 rounded-full bg-amber-100 text-amber-900 font-semibold text-lg mb-4">
                  {bundle.price} EGP
                </span>
                <Link href={`/Bundles/${bundle.id}`}>
                  <button className="px-8 py-2 bg-amber-700 text-white font-bold rounded-full hover:bg-amber-900 transition-all duration-300">
                    {lang === "ar" ? "عرض الباقة" : "View Bundle"}
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
