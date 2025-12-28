"use client";

import Link from "next/link";
import { useLanguage } from "../LanguageContext";
import { motion } from "framer-motion";

const categories = [
  { key: "all", en: "All", ar: "الكل" },
  { key: "cotton", en: "Cotton", ar: "قطن" },
  { key: "bandana", en: "Bandana", ar: "بنادانا" },
  { key: "chiffon", en: "Chiffon", ar: "شيفون" },
  { key: "silk", en: "Silk", ar: "حرير" },
  { key: "kuwaiti", en: "Kuwaiti", ar: "كويتي" },
  { key: "thiland", en: "Thailand", ar: "تايلاندي" },
];

export default function HomeCategories() {
  const { lang } = useLanguage();

  return (
    <section className="mb-20 px-4">
      <h2
        className={`
          text-4xl mb-6 text-center text-amber-900 font-bold
          ${lang === "ar" ? "draw-ar" : "draw-en"}
        `}
      >
        {lang === "ar" ? "التصنيفات" : "Categories"}
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((cat, index) => (
          <Link
            key={cat.key}
            href={`/category/${cat.key}`}
            className="block"
          >
            <motion.div
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
              {/* Gold glow */}
              <div
                className="
                  absolute inset-0 rounded-2xl
                  opacity-0 group-hover:opacity-100
                  bg-linear-to-br from-[#D4AF37]/20 to-transparent
                  transition-opacity duration-300
                "
              />

              <div className="relative z-10 flex items-center justify-center h-28">
                <span
                  className="
                    text-lg font-semibold text-amber-900
                    group-hover:text-[#B08A2E]
                    transition-colors duration-300
                  "
                >
                  {lang === "ar" ? cat.ar : cat.en}
                </span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </section>
  );
}
