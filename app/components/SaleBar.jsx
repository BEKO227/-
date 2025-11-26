"use client";

import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
export default function SaleBar() {
  const [text, setText] = useState("Loading...");

  useEffect(() => {
    // Listen in real-time to Firestore
    const unsubscribe = onSnapshot(
      doc(db, "Sale", "SaleBar"),
      (snapshot) => {
        if (snapshot.exists()) {
          setText(snapshot.data().description || "SALE — SALE — SALE");
        } else {
          setText("SALE — SALE — SALE");
        }
      },
      () => setText("SALE — SALE — SALE")
    );

    return () => unsubscribe();
  }, []);

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
