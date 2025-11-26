"use client";

import React, { useEffect, useState } from "react";
import ProductCard from './../../components/ProductCard';
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AllScarfsPage() {
  const [scarves, setscarves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchscarves() {
      const querySnapshot = await getDocs(collection(db, "scarves"));
      const fetchedscarves = [];
      querySnapshot.forEach((doc) => {
        fetchedscarves.push({ id: doc.id, ...doc.data() });
      });
      setscarves(fetchedscarves);
      console.log("fetched scarves",fetchedscarves);
      setLoading(false);
    }

    fetchscarves();
  }, []);

  return (
    <>
      {/* Navbar */}
      <div className="w-full bg-[#fdfaf7] py-2 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <Link
            href="/"
            className="py-2 px-4 border text-amber-950 rounded-full hover:bg-amber-700 transition-colors"
          >
            🏚️
          </Link>

          <div className="text-2xl font-bold text-amber-700">قَمَرْ</div>
        </div>
      </div>

      {/* scarves Section */}
      <section className="py-16 px-6 bg-[#fdfaf7] min-h-screen">
        <h1 className="text-3xl font-bold text-amber-900 text-center mb-10">
          All Scarfs
        </h1>

        {loading ? (
          <p className="text-center text-amber-800 text-xl">Loading scarfs...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {scarves.map((product) => (
              <ProductCard key={product.id} product={product} small={true} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
