"use client";

import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";

const categories = [
  { key: "kuwaiti", en: "Kuwaiti", ar: "كويتي" },
  { key: "dirty-linen", en: "Dirty Linen", ar: "كتان متسخ" },
  { key: "plain", en: "Plain", ar: "سادة" },
  { key: "chiffon", en: "Chiffon", ar: "شيفون" },
  { key: "cotton", en: "Cotton", ar: "قطن" },
  { key: "lycra-cotton", en: "Lycra Cotton", ar: "قطن ليكرا" },
  { key: "printed-modal", en: "Printed Modal", ar: "مودال مطبوع" },
  { key: "modal", en: "Modal", ar: "مودال" },
  { key: "bandana-packet", en: "Bandana Packet", ar: "بنادانا" },
  { key: "bandana", en: "Bandana", ar: "بنادانا" },
];

export default function HomeCategories() {
  const { lang } = useLanguage();

  return (
    <section className="mb-20 px-4">
      <h2
                className={`
                  text-4xl mb-6 text-center text-amber-900 font-bold
                  ${lang === "ar" ? "draw-ar" : "draw-en"}
                `}>
        {lang === "ar" ? "التصنيفات" : "Categories"}
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((cat, index) => (
          <motion.div
            key={cat.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="
              group relative cursor-pointer
              rounded-2xl border border-[#E6C86E]/40
              bg-white
              shadow-md
              hover:shadow-xl
              transition-all duration-300
            "
          >
            {/* Gold glow on hover */}
            <div className="
              absolute inset-0 rounded-2xl
              opacity-0 group-hover:opacity-100
              bg-linear-to-br from-[#D4AF37]/20 to-transparent
              transition-opacity duration-300
            " />

            <div className="relative z-10 flex items-center justify-center h-28">
              <span className="
                text-lg font-semibold text-brown-900
                group-hover:text-[#B08A2E]
                transition-colors duration-300
              ">
                {lang === "ar" ? cat.ar : cat.en}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
