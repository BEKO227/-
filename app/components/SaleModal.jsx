"use client";

import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function SaleModal({ isOpen, onClose }) {
  const [data, setData] = useState({
    title: "Special Sale!",
    description: "",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Sale", "SalePopUp"),
      (snapshot) => {
        if (snapshot.exists()) {
          const d = snapshot.data();
          setData({
            title: d.title || "Special Sale!",
            description: d.description
          });
        }
      },
      () => {
        setData({
          title: "Special Sale!",
          description: "",
        });
      }
    );

    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 relative shadow-xl animate-slideDown">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-lg"
        >
          ✖
        </button>

        {/* Title from Firebase */}
        <h2 className="text-2xl font-bold text-amber-800 mb-4 text-center">
          🔥 {data.title}
        </h2>

        {/* Description from Firebase */}
        <p className="text-gray-700 mb-6 text-center">
          {data.description}
        </p>

        <div className="text-center">
          <button
            onClick={onClose}
            className="bg-amber-800 text-white py-2 px-6 rounded-lg hover:bg-amber-700 transition"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}
