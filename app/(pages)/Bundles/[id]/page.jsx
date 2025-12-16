"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/LanguageContext";
import ProductCard from "@/app/components/ProductCard";

export default function BundleDetailsPage() {
  const { id } = useParams();
  const { lang } = useLanguage();

  const [bundle, setBundle] = useState(null);
  const [scarves, setScarves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        const bundleRef = doc(db, "bundles", id);
        const bundleSnap = await getDoc(bundleRef);

        if (!bundleSnap.exists()) return;

        const bundleData = bundleSnap.data();
        setBundle(bundleData);

        // Fetch scarves inside bundle
        const scarfPromises = bundleData.scarves.map(async (scarfId) => {
          const scarfRef = doc(db, "scarves", scarfId);
          const scarfSnap = await getDoc(scarfRef);
          return scarfSnap.exists()
            ? { id: scarfSnap.id, ...scarfSnap.data() }
            : null;
        });

        const scarfResults = await Promise.all(scarfPromises);
        setScarves(scarfResults.filter(Boolean));
      } catch (err) {
        console.error("Failed to load bundle:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, [id]);

  if (loading)
    return (
      <p className="text-center mt-20 text-amber-800">
        {lang === "ar" ? "جاري تحميل الباقة..." : "Loading bundle..."}
      </p>
    );

  if (!bundle) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-10 items-center mb-16"
      >
        <img
          src={bundle.imageCover}
          alt={bundle.title}
          className="rounded-3xl shadow-lg w-full object-cover"
        />

        <div>
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            {bundle.title}
          </h1>

          <p className="text-amber-700 text-lg mb-6">
            {bundle.description}
          </p>

          <div className="flex items-center gap-4">
            <span className="text-3xl font-extrabold text-amber-900">
              {bundle.price} EGP
            </span>
            <span className="px-4 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold">
              {lang === "ar" ? "عرض خاص" : "Special Bundle"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="w-full h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent my-14" />

      {/* Included Scarves */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-amber-900 mb-10 text-center">
          {lang === "ar" ? "المحتويات" : "Included Scarves"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {scarves.map((product) => (
              <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
