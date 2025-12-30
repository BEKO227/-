"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "./LanguageContext";

export default function Home() {
  const { lang } = useLanguage();

  return (
    <div
      className={`
        min-h-screen flex flex-col items-center justify-center
        bg-linear-to-b from-[#FAF7F2] to-[#F2E6D8]
        ${lang === "ar" ? "rtl font-cairo" : "ltr font-serif"}
      `}
    >
      {/* LOGO */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-6"
      >
        <Image
          src="/circle_logo.png"
          width={160}
          height={160}
          alt="Brand Logo"
          className="object-contain"
          priority
        />
      </motion.div>

      {/* HEADLINE */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-5xl md:text-6xl tracking-wide text-amber-900 font-bold mb-4"
      >
        {lang === "ar" ? "قريباً جداً" : "Coming Soon"}
      </motion.h1>

      {/* SUBLINE */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="text-lg md:text-xl text-amber-800 mb-10 text-center px-6 max-w-2xl leading-relaxed"
      >
        {lang === "ar"
          ? "تحضير لمجموعة جديدة من الأوشحة — فخامة، تفاصيل، وأناقة."
          : "A refined new scarves collection — elegance, detail, and sophistication."}
      </motion.p>

      {/* SEPARATOR */}
      <div className="w-64 h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent mb-10" />

      {/* FOLLOW CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <span className="text-sm text-gray-600">
          {lang === "ar"
            ? "تابعونا لمعرفة موعد الإطلاق"
            : "Follow us for launch updates"}
        </span>

        <a
          href="https://www.instagram.com/qamar_scarves/"
          target="_blank"
          className="
            px-8 py-2 rounded-full border border-[#D4AF37]
            text-[#A3742A] font-semibold
            hover:bg-[#D4AF37]/15 transition
            tracking-wide
          "
        >
          Instagram
        </a>
        <a
          href="https://www.tiktok.com/@qamar.scarves"
          target="_blank"
          className="
            px-8 py-2 rounded-full border border-[#D4AF37]
            text-[#A3742A] font-semibold
            hover:bg-[#D4AF37]/15 transition
            tracking-wide
          "
        >
          Tiktok
        </a>
      </motion.div>

      {/* FOOT DECOR LINE */}
      <div className="absolute bottom-12 w-72 h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent" />
    </div>
  );
}
