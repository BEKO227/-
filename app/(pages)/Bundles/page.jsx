"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useLanguage } from "@/app/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";
import BundleScarfCard from "@/app/components/BundlesScarfCard";

export default function BundlesPage() {
  const { lang } = useLanguage();
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBundles = async () => {
      const querySnapshot = await getDocs(collection(db, "bundles"));
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBundles(fetched);
      setLoading(false);
    };
    fetchBundles();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (loading)
    return (
      <p className="text-center text-amber-800 mt-6">
        {lang === "ar" ? "جاري تحميل الباقات..." : "Loading bundles..."}
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1
        className={`
          text-4xl mb-10 text-center text-amber-900 font-bold
          ${lang === "ar" ? "draw-ar" : "draw-en"}
        `}
      >
        {lang === "ar" ? "جميع الباقات" : "All Bundles"}
      </h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {bundles.map(bundle => (
          <motion.div key={bundle.id} variants={cardVariants}>
            <Link href={`/Bundles/${bundle.id}`} className="group block">
              <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 p-4 cursor-pointer">
                
                <img
                  src={bundle.imageCover}
                  alt={bundle.title}
                  className="rounded-xl w-full h-48 object-cover group-hover:scale-[1.02] transition-transform"
                />

                <h3 className="text-xl font-semibold mt-4 text-amber-900">
                  {lang === "ar" ? bundle.title_ar || bundle.title : bundle.title}
                </h3>

                <p className="text-amber-700 mt-2 text-sm">
                  {bundle.description}
                </p>

                <p className="text-lg font-bold mt-3 text-amber-900">
                  {bundle.price} EGP
                </p>

                {/* Included scarves preview */}
                <div className="mt-4 grid grid-cols-2 gap-2 pointer-events-none">
                  {bundle.scarves?.slice(0, 4).map(scarfId => (
                    <BundleScarfCard key={scarfId} productId={scarfId} small />
                  ))}
                </div>

                <div className="mt-4 text-center text-sm font-semibold text-amber-700 group-hover:text-amber-900">
                  {lang === "ar" ? "عرض التفاصيل →" : "View Details →"}
                </div>

              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
