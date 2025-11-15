"use client";

import React from "react";
import ProductCard from './../../components/ProductCard';
import { allScarfs } from './../../data/products';
import Link from "next/link";


export default function AllScarfsPage() {
  return (
    <>
      <div className="w-full bg-[#fdfaf7] py-2 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          {/* Left: Home Button */}
          <Link
            href="/"
            className="py-2 px-4 border text-amber-950 rounded-full hover:bg-amber-700 transition-colors"
          >
            🏚️
          </Link>

          {/* Right: Text */}
          <div className="text-2xl font-bold text-amber-700">قَمَرْ</div>
          </div>
      </div>
    <section className="py-16 px-6 bg-beige-50 min-h-screen">
      <h1 className="text-3xl font-bold text-amber-900 text-center mb-10">
        All Scarfs
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {allScarfs.map((product) => (
          <ProductCard key={product.id} product={product} small={true} />
        ))}
      </div>
    </section>
    </>
  );
}
