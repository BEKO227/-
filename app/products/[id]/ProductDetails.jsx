"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
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
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { lang } = useLanguage();

  const getText = (en, ar) => (lang === "ar" ? ar || en : en);

  const itemInCart = scarf
    ? cart.find((i) => String(i.id) === String(scarf.id))
    : undefined;

  const fetchScarf = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "scarves", id.toString());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setScarf(data);

        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
          setActiveImage(data.colors[0].image);
        } else if (data.images && data.images.length > 0) {
          setActiveImage(0);
        }
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
            className="py-2 px-4 border text-amber-950 rounded-full hover:bg-amber-700"
          >
            🏚️
          </Link>
          <div className="text-2xl font-bold text-amber-700">قَمَرْ</div>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-6 md:px-20 py-10 flex flex-col md:flex-row gap-12">
        {/* Images */}
        <div className="flex-1">
          <div
            className="relative cursor-zoom-in"
            onClick={() => setIsImageOpen(true)}
          >
            <Image
              src={images[activeImage]}
              alt={getText(scarf.title, scarf.titleAr)}
              width={450}
              height={450}
              className="rounded-xl shadow-lg object-cover"
            />
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
                    alt="thumbnail"
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
          {/* Title */}
          <h1 className="text-4xl font-bold text-amber-800 mb-4">
            {getText(scarf.title, scarf.titleAr)}
          </h1>

          {/* Category */}
          {scarf.category && (
            <span className="inline-block mb-3 px-4 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800">
              {getText(scarf.category, scarf.categoryAr)}
            </span>
          )}

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-4">
            {getText(scarf.description, scarf.descriptionAr)}
          </p>

          {/* Color Selector */}
          {scarf.colors && scarf.colors.length > 0 && (
            <div className="flex gap-3 mt-4 mb-4">
              {scarf.colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedColor(color);
                    setActiveImage(color.image);
                  }}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor?.name === color.name
                      ? "border-amber-700"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          )}

          {/* Price */}
          <p className="text-2xl font-semibold text-amber-700 mt-2 mb-2">
            {scarf.price} EGP
          </p>

          {/* Rating */}
          <p className="text-lg text-gray-700 mb-2">
            ⭐ {(scarf.ratingsAverage || 0).toFixed(1)} (
            {scarf.ratingsQuantity || 0}{" "}
            {lang === "en" ? "reviews" : "تقييم"})
          </p>

          {/* Stock */}
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

          {/* Cart Actions */}
          {!itemInCart ? (
            <button
              onClick={() => addToCart(scarf)}
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
        </div>
      </div>

      {/* Image Modal */}
      {isImageOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setIsImageOpen(false)}
        >
          <Image
            src={images[activeImage]}
            alt="Full Image"
            width={900}
            height={900}
            className="rounded-xl object-contain max-h-[90vh]"
          />
        </div>
      )}
    </>
  );
}
