"use client";

import React from "react";
import { allScarfs } from "../../data/products"; // adjust path if needed
import ProductCard from "../../components/ProductCard";
import Link from "next/link";

export default function NewArrivalPage() {
  // Filter only new arrival products
  const newArrivals = allScarfs.filter((product) => product.isNewArrival);

  return (
    <>
        <div className="w-full bg-[#fdfaf7] py-2 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
        {/* Left: Home Button */}
        <Link   
          href="/"
          className="py-2 px-4 bg-brown-800 border text-amber-950 rounded-full hover:bg-brown-700 transition-colors"
        >
          🏚️
        </Link>

        {/* Right: Text */}
        <div className="text-2xl font-bold text-brown-700">قَمَرْ</div>
      </div>
    </div>
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-brown-800 mb-8">New Arrivals</h1>

      {newArrivals.length === 0 ? (
        <p className="text-brown-700 text-lg">No new arrivals at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
    </>
  );
}
