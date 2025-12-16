"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCart } from "../../CartContext";
import { useAuth } from "../../AuthContext";
import { useRouter } from "next/navigation";
import { db } from "../../../lib/firebase";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useLanguage } from "@/app/LanguageContext";

export default function ProductDetails({ id }) {
  const [scarf, setScarf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { lang } = useLanguage();

  const itemInCart = scarf
    ? cart.find((i) => String(i.id) === String(scarf.id))
    : undefined;

  const fetchScarf = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "scarves", id.toString());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setScarf({ id: docSnap.id, ...docSnap.data() });
        setActiveImage(0);
      } else {
        setScarf(null);
      }
    } catch (error) {
      console.error("Error fetching scarf:", error);
      setScarf(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScarf();
  }, [id]);

  const handleAddToCart = async (e) => {
    e?.stopPropagation();
    if (!user) return router.push("/auth/signin");
    if (!scarf) return;
    if (scarf.stock <= 0)
      return toast.error(lang === "en" ? "Out of stock" : "نفذ المخزون");

    try {
      const docRef = doc(db, "scarves", String(scarf.id));
      await updateDoc(docRef, { stock: scarf.stock - 1 });
      addToCart(scarf);
      toast.success(
        lang === "en"
          ? "Product added successfully!"
          : "تمت إضافة المنتج بنجاح!"
      );
      await fetchScarf();
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        lang === "en" ? "Something went wrong!" : "حدث خطأ ما!"
      );
    }
  };

  const submitRating = async () => {
    if (!user) return router.push("/auth/signin");
    if (userRating < 1 || userRating > 5) return;

    setRatingSubmitting(true);
    try {
      const docRef = doc(db, "scarves", scarf.id);
      const newAvg =
        (scarf.ratingsAverage * scarf.ratingsQuantity + userRating) /
        (scarf.ratingsQuantity + 1);

      await updateDoc(docRef, {
        ratingsAverage: newAvg,
        ratingsQuantity: (scarf.ratingsQuantity || 0) + 1,
      });

      setUserRating(0);
      await fetchScarf();
    } catch (err) {
      console.error(err);
    }
    setRatingSubmitting(false);
  };

  if (loading)
    return (
      <div className="p-10 text-center text-xl text-amber-700">
        {lang === "en" ? "Loading product..." : "جاري تحميل المنتج..."}
      </div>
    );

  if (!scarf)
    return (
      <div className="p-10 text-center text-xl font-bold text-red-600">
        {lang === "en" ? "Product Not Found" : "المنتج غير موجود"}
      </div>
    );

  const images = scarf.images?.length
    ? scarf.images
    : scarf.imageCover
    ? [scarf.imageCover]
    : [];

  const disabled = scarf.stock <= 0;

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
            style={{ fontFamily: "'Diwani Letter', sans-serif" }}
          >
            قَمَرْ
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-6 md:px-20 py-10 flex flex-col md:flex-row gap-12">
        {/* Images */}
        <div className="flex-1">
          <div className="relative">
            <Image
              src={images[activeImage]}
              alt={scarf.title}
              width={450}
              height={450}
              className="rounded-xl shadow-lg object-cover"
            />

            <div className="absolute top-3 left-3 flex flex-col gap-1">
              {scarf.isNewArrival && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {lang === "en" ? "New Arrival" : "وصول جديد"}
                </span>
              )}
              {scarf.isTopSeller && (
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {lang === "en" ? "Top Seller" : "الأكثر مبيعًا"}
                </span>
              )}
              {scarf.isOnSale && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {lang === "en" ? "On Sale" : "خصم"}
                </span>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 mt-4 justify-center">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`border rounded-lg p-1 ${
                    activeImage === index
                      ? "border-amber-700"
                      : "border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl font-bold text-amber-800 mb-4">
            {lang === "en" ? scarf.title : scarf.titleAr || scarf.title}
          </h1>

          <p className="text-gray-700 leading-relaxed mb-4">
            {lang === "en"
              ? scarf.description
              : scarf.descriptionAr || scarf.description}
          </p>

          <p className="text-2xl font-semibold text-amber-700 mb-2">
            {scarf.price} EGP
          </p>

          <p className="text-lg text-gray-700 mb-2">
            ⭐ {(scarf.ratingsAverage || 0).toFixed(1)} (
            {scarf.ratingsQuantity || 0}{" "}
            {lang === "en" ? "reviews" : "تقييم"})
          </p>

          <div className="mb-4">
            {scarf.stock > 0 ? (
              <span className="text-green-600 font-bold">
                {lang === "en" ? "In Stock" : "متوفر"}
              </span>
            ) : (
              <span className="text-red-600 font-bold">
                {lang === "en" ? "Out of Stock" : "نفذ المخزون"}
              </span>
            )}
          </div>

          {!itemInCart ? (
            <button
              onClick={handleAddToCart}
              disabled={disabled}
              className={`w-full py-3 rounded-full font-semibold text-white ${
                disabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-amber-700 hover:bg-amber-800"
              }`}
            >
              {disabled
                ? lang === "en"
                  ? "Out of Stock"
                  : "نفذ المخزون"
                : lang === "en"
                ? "Add to Cart"
                : "أضف إلى السلة"}
            </button>
          ) : (
            <div className="mt-3 flex items-center justify-between">
              {itemInCart.quantity === 1 ? (
                <button
                  onClick={() => removeFromCart(scarf.id)}
                  className="p-2 bg-red-500 text-white rounded-full"
                >
                  <Trash size={18} />
                </button>
              ) : (
                <button
                  onClick={() =>
                    updateQuantity(scarf.id, itemInCart.quantity - 1)
                  }
                  className="px-4 py-2 bg-gray-200 rounded-full font-bold"
                >
                  -
                </button>
              )}
              <span className="px-4 text-lg font-semibold">
                {itemInCart.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(scarf.id, itemInCart.quantity + 1)
                }
                className="px-4 py-2 bg-gray-200 rounded-full font-bold"
              >
                +
              </button>
            </div>
          )}

          {scarf.styleVideo && (
            <Link
              href={`/products/${scarf.id}/style`}
              className="mt-4 bg-amber-800 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-700 text-center"
            >
              {lang === "en" ? "How to Style" : "كيفية التنسيق"}
            </Link>
          )}

          {/* Rating */}
          <div className="mt-8 p-4 border rounded-xl bg-white shadow-sm">
            <h3 className="text-xl font-bold text-amber-800 mb-2">
              {lang === "en" ? "Rate This Product" : "قيم هذا المنتج"}
            </h3>
            <div className="flex gap-2 text-3xl cursor-pointer mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setUserRating(star)}
                  className={
                    star <= userRating
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <button
              onClick={submitRating}
              disabled={ratingSubmitting || userRating === 0}
              className="px-6 py-2 bg-amber-700 text-white rounded-full hover:bg-amber-800 disabled:bg-gray-400"
            >
              {ratingSubmitting
                ? lang === "en"
                  ? "Submitting..."
                  : "جاري الإرسال..."
                : lang === "en"
                ? "Submit Rating"
                : "إرسال التقييم"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
