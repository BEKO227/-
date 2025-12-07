"use client";

import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/app/LanguageContext";

export default function SaleBar() {
  const [text, setText] = useState("Loading...");
  const { lang } = useLanguage();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Sale", "SaleBar"),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          // Use lang-specific field if available
          const displayText =
            lang === "ar"
              ? data.description_ar || data.description || "تخفيض — تخفيض — تخفيض"
              : data.description || "SALE — SALE — SALE";
          setText(displayText);
        } else {
          setText(lang === "ar" ? "تخفيض — تخفيض — تخفيض" : "SALE — SALE — SALE");
        }
      },
      () => {
        setText(lang === "ar" ? "تخفيض — تخفيض — تخفيض" : "SALE — SALE — SALE");
      }
    );

    return () => unsubscribe();
  }, [lang]);

  return (
    <div className="bg-amber-100 text-amber-800 overflow-hidden">
      <div className="whitespace-nowrap animate-marquee py-1 font-bold text-center">
        {text}
      </div>

      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 15s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}
