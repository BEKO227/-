"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { db } from '@/lib/firebase';
import { collection, getDocs } from "firebase/firestore";


export default function AllScarfsSection() {
  const [scarfs, setScarfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScarfs() {
      const querySnapshot = await getDocs(collection(db, "scarves"));
      const scarves = [];
      querySnapshot.forEach((doc) => {
        scarves.push({ id: doc.id, ...doc.data() });
      });
      setScarfs(scarves);
      setLoading(false);
    }

    fetchScarfs();
  }, []);

  // Take only the first 4 scarves for preview
  const topScarfs = scarfs.slice(0, 4);

  if (loading) {
    return (
      <section className="py-16 px-6 bg-[#fdfaf7] text-center">
        <p className="text-xl text-amber-900 font-semibold">Loading scarfs...</p>
      </section>
    );
  }

  return (
    <section id="all-scarfs" className="py-16 px-6 bg-[#fdfaf7]">
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
          <button className="px-6 py-3 rounded-full border border-amber-900 text-amber-900 font-semibold hover:bg-amber-700 hover:text-white transition-colors duration-300 cursor-pointer hover:scale-105">
            View More
          </button>
        </Link>
      </div>
    </section>
  );
}
