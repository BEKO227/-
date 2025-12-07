"use client";

import React, { useEffect, useState } from "react";
import ProductCard from './../../components/ProductCard';
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/LanguageContext";

export default function AllScarfsPage() {
  const { lang } = useLanguage();
  const [scarves, setScarves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScarves() {
      const querySnapshot = await getDocs(collection(db, "scarves"));
      const fetchedScarves = [];
      querySnapshot.forEach((doc) => {
        fetchedScarves.push({ id: doc.id, ...doc.data() });
      });
      setScarves(fetchedScarves);
      setLoading(false);
    }
    fetchScarves();
  }, []);

  // Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

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
          <div
            className="text-2xl font-bold text-amber-700"
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

      {/* Scarves Section */}
      <section className="py-16 px-6 bg-[#fdfaf7] min-h-screen">
        <h1 className="text-3xl font-bold text-amber-900 text-center mb-10">
          {lang === "ar" ? "جميع الأوشحة" : "All Scarfs"}
        </h1>

        {loading ? (
          <p className="text-center text-amber-800 text-xl">
            {lang === "ar" ? "جاري تحميل الأوشحة..." : "Loading scarfs..."}
          </p>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {scarves.map((product) => (
              <motion.div key={product.id} variants={cardVariants}>
                <ProductCard product={product} small={true} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </>
  );
}
