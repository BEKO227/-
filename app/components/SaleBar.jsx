// components/SaleBar.jsx
"use client";
import React from "react";

export default function SaleBar() {
  return (
    <div className="bg-amber-100 text-amber-800 overflow-hidden">
      <div className="whitespace-nowrap animate-marquee py-1 font-bold text-center">
        SALE — SALE — SALE — SALE — SALE — SALE — SALE — SALE
      </div>
      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 15s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
