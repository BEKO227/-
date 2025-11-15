"use client";

import React from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { allScarfs } from "../data/products";

export default function AllScarfsSection() {
  // Take only the first 4 products
  const topScarfs = allScarfs.slice(0, 4);

  return (
    <section id="all-scarfs" className="py-16 px-6 bg-beige-50">
      <h2 className="text-3xl font-semibold text-amber-900 text-center mb-10">
        All Scarfs
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
  {topScarfs.map((scarf, index) => (
    <ProductCard key={`${scarf.id}-${index}`} product={scarf} small={true} />
  ))}
</div>


      {/* View More Button */}
      <div className="mt-10 text-center">
        <Link href="/AllScarfs">
          <button className="px-6 py-3 rounded-full border border-amber-900 text-amber-900 font-semibold hover:bg-coffee-700 transition-colors duration-300 cursor-pointer hover:scale-105">
            View More
          </button>
        </Link>
      </div>
    </section>
  );
}
