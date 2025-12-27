"use client";

import React from "react";
import { useLanguage } from "@/app/LanguageContext";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function BundlesPage() {
  const { lang } = useLanguage();
  const router = useRouter();

  return (
    <>
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-b from-[#fdfaf7] to-[#fff9f2] px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900 mb-6">
          {lang === "ar" ? "الباقات قادمة قريبًا" : "Bundles Coming Soon"}
        </h1>

        <p className="text-lg md:text-xl text-amber-700 mb-8">
          {lang === "ar"
            ? "نحن نعمل على إعداد الباقات المميزة لك قريبًا!"
            : "We are preparing exclusive bundles for you soon!"}
        </p>

        <div className="text-amber-900 font-semibold text-lg">
          {lang === "ar"
            ? "ابقوا متابعين لمزيد من التحديثات!"
            : "Stay tuned for updates!"}
        </div>
      </motion.div>
    </div>
    </>

  );
}
