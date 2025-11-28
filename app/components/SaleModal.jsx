"use client";

import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "../AuthContext";
export default function SaleModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [shouldShow, setShouldShow] = useState(false);

  const [data, setData] = useState({
    title: "Special Sale!",
    description: "",
  });

  // --------------------------
  // FIRESTORE REALTIME DATA
  // --------------------------
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Sale", "SalePopUp"),
      (snapshot) => {
        if (snapshot.exists()) {
          const d = snapshot.data();
          setData({
            title: d.title || "Special Sale!",
            description: d.description || "",
          });
        }
      },
      () => {}
    );

    return () => unsubscribe();
  }, []);

  // --------------------------
  // SHOW LOGIC (logged-in vs guest)
  // --------------------------
  useEffect(() => {
    if (user) {
      // Logged in → show ONLY once after login
      const hasSeen = localStorage.getItem(`sale_seen_${user.uid}`);
      if (!hasSeen) {
        setShouldShow(true);
        localStorage.setItem(`sale_seen_${user.uid}`, "true");
      }
    } else {
      // Guest user → show EVERY time
      setShouldShow(true);
    }
  }, [user]);

  if (!isOpen || !shouldShow) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 relative shadow-xl animate-slideDown">

        {/* Close Button */}
        <button
          onClick={() => {
            setShouldShow(false);
            onClose();
          }}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-lg"
        >
          ✖
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-amber-800 mb-4 text-center">
          🔥 {data.title}
        </h2>

        {/* Dynamic description (overridden by logic below) */}
        <p className="text-gray-700 mb-6 text-center">
          {user
            ? "Use promo code SAVE10 for an extra discount on your orders!"
            : "Sign up now to get your discount promo code!"}
        </p>

        <div className="text-center">
          <button
            onClick={() => {
              setShouldShow(false);
              onClose();
            }}
            className="bg-amber-800 text-white py-2 px-6 rounded-lg hover:bg-amber-700 transition"
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}
