"use client";
import { useEffect } from "react";

export default function SaleModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 relative shadow-xl animate-slideDown">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-lg"
        >
          ✖
        </button>

        {/* Content */}
        <h2 className="text-2xl font-bold text-amber-800 mb-4 text-center">🔥 Special Sale!</h2>
        <p className="text-gray-700 mb-6 text-center">
          Enjoy 30% off on all scarves this week! Grab your favorite now.
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
