"use client";

import React, { useState } from "react";
import Image from "next/image";
import { allScarfs } from "../data/products"; // use your product data
import { motion } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function TopSellers() {
  const topScarfs = allScarfs.slice(0, 5); // first 5 products
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? topScarfs.length - 1 : prev - 1
    );
  };

  const next = () => {
    setCurrentIndex((prev) =>
      prev === topScarfs.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="py-16 px-6 bg-beige-50">
      <h2 className="text-3xl font-semibold text-amber-900 text-center mb-10">
        Styling
      </h2>

      <div className="flex flex-col items-center">
        {/* Main Image */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-xl shadow-lg overflow-hidden">
          <Image
            src={topScarfs[currentIndex].imageCover}
            alt={topScarfs[currentIndex].title}
            fill
            className="object-cover rounded-xl"
          />
          <div className="absolute top-3 left-3 bg-yellow-400 text-white font-bold px-2 py-1 rounded text-xs">
            {topScarfs[currentIndex].tag || "Featured"}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-between w-32 mt-4">
          <button
            onClick={prev}
            className="bg-amber-700 text-beige-50 p-2 rounded-full hover:bg-coffee-700 transition"
          >
            <FaArrowLeft />
          </button>
          <button
            onClick={next}
            className="bg-amber-700 text-beige-50 p-2 rounded-full hover:bg-coffee-700 transition"
          >
            <FaArrowRight />
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex mt-6 gap-4 overflow-x-auto px-4">
          {topScarfs.map((scarf, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg cursor-pointer overflow-hidden shadow-md transition-transform ${
                currentIndex === idx ? "scale-110 shadow-xl" : ""
              }`}
            >
              <Image
                src={scarf.imageCover}
                alt={scarf.title}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
