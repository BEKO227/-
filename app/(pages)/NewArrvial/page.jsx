"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { motion } from "framer-motion";

export default function NewArrivalPage() {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      const q = query(collection(db, "scarves"), where("isNewArrival", "==", true));
      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNewArrivals(products);
      setLoading(false);
    };

    fetchNewArrivals();
  }, []);

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <div className="w-full bg-[#fdfaf7] py-2 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <Link href="/" className="py-2 px-4 border text-amber-950 rounded-full hover:bg-amber-700 transition-colors">🏚️</Link>
          <div className="text-2xl font-bold text-amber-700"
          style={{
            fontFamily: "'Diwani Letter', sans-serif",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
          >
            قَمَرْ
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-amber-800 mb-8">New Arrivals</h1>

        {loading ? (
          <p className="text-amber-700 text-lg">Loading...</p>
        ) : newArrivals.length === 0 ? (
          <p className="text-amber-700 text-lg">No new arrivals at the moment.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {newArrivals.map((product) => (
              <motion.div key={product.id} variants={cardVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
