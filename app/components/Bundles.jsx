"use client";

import React from "react";
import { useLanguage } from "@/app/LanguageContext";

export default function HomeBundles() {
  const { lang } = useLanguage();

  return (
    <section className="py-16 px-4 text-center">
      <h2 className={`text-4xl mb-6 text-center text-amber-900 font-bold ${lang === "ar" ? "draw-ar" : "draw-en"}`}>
        {lang === "ar" ? "الباقات" : "Bundles"}
      </h2>

      {/* Coming Soon UI */}
      <div className="flex flex-col items-center justify-center py-20 bg-[#fdfaf7] rounded-xl shadow-md">
        <p className="text-2xl font-semibold text-amber-900 mb-4">
          {lang === "ar" ? "قريباً..." : "Coming Soon..."}
        </p>
        <p className="text-amber-700 text-base max-w-md">
          {lang === "ar"
            ? "جميع الباقات الرائعة ستكون متاحة قريباً. ترقبوا الجديد!"
            : "All amazing bundles will be available soon. Stay tuned!"}
        </p>
      </div>

      {/* 
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" animate="visible">
        {bundles.map(bundle => (
          <motion.div key={bundle.id} variants={cardVariants} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow">
            <Link href={`/Bundles/${bundle.id}`}>
              <img src={bundle.imageCover} alt={bundle.title} className="rounded-t-xl w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-amber-800">{lang === "ar" ? bundle.title_ar || bundle.title : bundle.title}</h3>
                <p className="text-amber-700 mt-2">{bundle.description}</p>
                <p className="text-lg font-bold mt-3 text-amber-900">{bundle.price} EGP</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 text-center">
        <Link href="/Bundles">
          <button className="px-6 py-3 rounded-full border border-amber-900 text-amber-900 font-semibold hover:bg-amber-700 hover:text-white transition-colors duration-300 cursor-pointer hover:scale-105">
            {lang === "en" ? "View More" : "عرض المزيد"}
          </button>
        </Link>
      </div>
      */}
    </section>
  );
}
