"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { useLanguage } from "@/app/LanguageContext";
import ProductCard from "@/app/components/ProductCard";
import { useCart } from "@/app/CartContext";

export default function BundleDetailsPage() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const router = useRouter();
  const { addToCart } = useCart();

  const [bundle, setBundle] = useState(null);
  const [scarves, setScarves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColors, setSelectedColors] = useState({});

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        const bundleRef = doc(db, "bundles", id);
        const bundleSnap = await getDoc(bundleRef);
        if (!bundleSnap.exists()) return;

        const bundleData = bundleSnap.data();
        setBundle(bundleData);

        const scarfPromises = (bundleData.scarves || []).map(async (scarfId) => {
          const scarfRef = doc(db, "scarves", scarfId);
          const scarfSnap = await getDoc(scarfRef);
          return scarfSnap.exists()
            ? { id: scarfSnap.id, ...scarfSnap.data() }
            : null;
        });

        const scarfResults = await Promise.all(scarfPromises);
        setScarves(scarfResults.filter(Boolean));
      } catch (error) {
        console.error("Failed to load bundle:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, [id]);

  const handleColorChange = (scarfId, color) => {
    setSelectedColors((prev) => ({
      ...prev,
      [scarfId]: color,
    }));
  };

  const handleAddBundleToCart = async () => {
    const missingColor = scarves.find(
      (s) => s.colors?.length > 0 && !selectedColors[s.id]
    );

    if (missingColor) {
      alert(
        lang === "ar"
          ? "يرجى اختيار لون لكل منتج في الباقة"
          : "Please select a color for each product in the bundle"
      );
      return;
    }

    const outOfStock = scarves.find((s) => s.stock <= 0);
    if (outOfStock) {
      alert(
        lang === "ar"
          ? "بعض المنتجات في هذه الباقة غير متوفرة حالياً"
          : "Some items in this bundle are out of stock"
      );
      return;
    }

    try {
      for (const scarf of scarves) {
        const chosenColor = selectedColors[scarf.id];

        addToCart({
          id: scarf.id,
          title: scarf.title,
          price: scarf.price,
          image: scarf.imageCover,
          quantity: 1,
          color: chosenColor,
        });

        const scarfRef = doc(db, "scarves", scarf.id);
        await updateDoc(scarfRef, {
          stock: increment(-1),
        });
      }

      alert(
        lang === "ar"
          ? "تمت إضافة جميع منتجات الباقة إلى سلة التسوق!"
          : "All bundle items have been added to the cart!"
      );
    } catch (error) {
      console.error("Bundle add failed:", error);
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-amber-800">
        {lang === "ar" ? "جاري تحميل الباقة..." : "Loading bundle..."}
      </p>
    );
  }

  if (!bundle) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Back Button */}
      <div className="w-full bg-[#fdfaf7] py-3 shadow-md mb-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <button
            onClick={() => router.back()}
            className="py-2 px-4 border text-amber-950 rounded-full hover:bg-amber-700 transition-colors"
          >
            ← {lang === "ar" ? "رجوع" : "Back"}
          </button>
        </div>
      </div>

      {/* Bundle Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-lg p-10 mb-16 border border-amber-100"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            {lang === "ar" ? bundle.title_ar || bundle.title : bundle.title}
          </h1>

          <p className="text-amber-700 text-lg mb-6">
            {lang === "ar"
              ? bundle.description_ar || bundle.description
              : bundle.description}
          </p>

          <div className="inline-block px-6 py-3 rounded-full bg-amber-100 text-amber-900 font-semibold text-lg mb-6">
            {bundle.price} EGP
          </div>

            {/* <button
              onClick={handleAddBundleToCart}
              className="px-10 py-3 bg-amber-700 text-white font-bold rounded-full hover:bg-amber-900 transition-colors"
            >
              {lang === "ar" ? "أضف الباقة إلى السلة" : "Add Bundle to Cart"}
            </button> */}
        </div>
      </motion.div>

      {/* Products */}
      <h2 className="text-3xl font-bold text-amber-900 mb-10 text-center">
        {lang === "ar" ? "المحتويات" : "Included Products"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {scarves.map((product, index) => (
          <div
            key={`${product.id}-${index}`} // ✅ FIXED
            className="bg-white rounded-2xl p-4 border border-amber-100 shadow hover:shadow-lg"
          >
            <ProductCard product={product} />

            {product.colors?.length > 0 && (
              <>
                <div className="mt-3 flex justify-center flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={`${product.id}-${color.hex}`} // ✅ FIXED
                      onClick={() => handleColorChange(product.id, color)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        selectedColors[product.id]?.hex === color.hex
                          ? "border-amber-900 scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>

                {!selectedColors[product.id] && (
                  <p className="text-xs text-red-600 text-center mt-2">
                    {lang === "ar"
                      ? "يرجى اختيار لون"
                      : "Please select a color"}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
