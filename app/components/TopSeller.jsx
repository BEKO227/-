"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { allScarfs } from "../data/products";

const topSellers = allScarfs.filter((item) => item.tag === "Top Seller").slice(0, 3);

export default function TopSellers() {
  return (
    <section className="py-20 bg-[#fdfaf7] relative overflow-hidden">
      <motion.h2
        className="text-4xl font-bold text-center text-brown-800 mb-16 tracking-wide uppercase"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Top Sellers
      </motion.h2>

      {/* Collage Layout for Desktop */}
      <div className="relative w-full max-w-6xl mx-auto h-[600px] hidden md:block">
        {topSellers.map((item, i) => {
          const MotionLink = motion(Link);
          return (
            <MotionLink
              key={i}
              href={`/products/${item.id}`}
              className={`absolute rounded-2xl overflow-hidden shadow-lg group transition-all duration-500 ${
                i === 0
                  ? "top-0 left-0 w-[40%] h-[60%] rotate-2"
                  : i === 1
                  ? "top-10 right-0 w-[45%] h-[70%] rotate-2"
                  : "bottom-0 left-[25%] w-[35%] h-[50%]"
              }`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            >
              <img
                src={item.imageCover}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end justify-center">
                <p className="text-white text-lg font-semibold mb-4 tracking-wide">
                  {item.title}
                </p>
              </div>
            </MotionLink>
          );
        })}
      </div>

      {/* Stacked Layout for Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 md:hidden pb-24">
        {topSellers.map((item, i) => {
          const MotionLink = motion(Link);
          return (
            <MotionLink
              key={i}
              href={`/products/${item.id}`}
              className="rounded-2xl overflow-hidden shadow-md group relative"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <img
                src={item.imageCover}
                alt={item.title}
                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-end justify-center">
                <p className="text-white text-base font-medium mb-4">{item.title}</p>
              </div>
            </MotionLink>
          );
        })}
      </div>

      {/* View More Button */}
      <div className="mt-6 md:mt-20 text-center">
        <Link href="/topsellers">
          <button className="px-6 py-3 rounded-full bg-brown-700 border border-amber-950 text-beige-50 font-semibold hover:bg-coffee-700 transition-colors duration-300 cursor-pointer hover:scale-105">
            View More
          </button>
        </Link>
      </div>
    </section>
  );
}
