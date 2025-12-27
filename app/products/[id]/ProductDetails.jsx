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

  // Fetch product
  const fetchScarf = async () => {
    try {
      setLoading(true);
      const docRef = doc(db, "scarves", id.toString());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        setScarf(data);

        if (data.colors?.length > 0) {
          setSelectedColor(data.colors[0]);
          setActiveImage(0);
        } else if (data.images?.length > 0) {
          setActiveImage(0);
        }
      } else {
        setScarf(null);
      }
    } catch (err) {
      console.error(err);
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

  // ⭐ Main image priority
  const mainImage =
    selectedColor?.image ||
    images[activeImage] ||
    images[0];

  // --- CART LOGIC ---
  const requireLogin = () => {
    toast.error(lang === "en" ? "Please log in first" : "يرجى تسجيل الدخول أولاً");
    router.push("/auth/signin");
  };

  const handleAddToCart = () => {
    if (!user) return requireLogin();

    addToCart({
      ...scarf,
      selectedColor: selectedColor || null,
    });
  };

  const handleUpdateQuantity = (quantity) => {
    if (!user) return requireLogin();
    updateQuantity(scarf.id, quantity);
  };

  const handleRemoveFromCart = () => {
    if (!user) return requireLogin();
    removeFromCart(scarf.id);
  };

  return (
    <>
      {/* Navbar */}
      <div className="w-full bg-[#fdfaf7] py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <button
            onClick={() => router.back()}
            className="py-2 px-4 border text-amber-950 rounded-full hover:bg-amber-700 transition-colors duration-300"
          >
            ← {lang === "ar" ? "رجوع" : "Back"}
          </button>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-20 py-10 flex flex-col md:flex-row gap-12">
        {/* Images */}
        <div className="flex-1">
          <div
            className="relative cursor-zoom-in rounded-2xl overflow-hidden shadow-lg"
            onClick={() => setIsImageOpen(true)}
          >
            <Image
              src={mainImage}
              alt={getText(scarf.title, scarf.titleAr)}
              width={500}
              height={500}
              className="rounded-2xl object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 justify-center">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveImage(index);
                    setSelectedColor(null);
                  }}
                  className={`border rounded-lg p-1 transition ${
                    activeImage === index && !selectedColor
                      ? "border-amber-700 shadow-lg"
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
 <div className="flex-1 flex flex-col justify-center gap-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          {/* Title */}
          <h1 className="text-4xl font-bold text-amber-800 mb-2">
            {getText(scarf.title, scarf.titleAr)}
          </h1>

          {/* Category */}
          {scarf.category && (
            <span
              className="
                inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold
                bg-linear-to-r from-amber-400 via-amber-300 to-amber-500
                text-white shadow-lg border border-amber-300
                uppercase tracking-wide
                transition-transform duration-300 hover:scale-105
              "
            >
              {getText(scarf.category, scarf.categoryAr)}
            </span>
          )}

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-4">
            {getText(scarf.description, scarf.descriptionAr)}
          </p>
                    {/* Colors */}
                    {scarf.colors?.length > 0 && (
            <div>
              <p className="mb-2 text-sm text-gray-600">
                {lang === "en" ? "Choose color:" : "اختر اللون:"}
              </p>

              <div className="flex gap-3 mt-2 mb-4">
                {scarf.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedColor(color);
                      setActiveImage(index);
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition ${
                      selectedColor?.name === color.name
                        ? "border-amber-700 shadow-md"
                        : "border-gray-300"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Product Disclaimer */}
          <div className="mt-4 p-4 rounded-2xl bg-linear-to-r from-amber-50 to-amber-100 shadow-md border border-amber-200">
            <div className="flex items-start gap-3">
              <span className="text-amber-700 font-bold text-lg">⚠️</span>
              <div className="text-gray-700 text-sm space-y-2 leading-relaxed">
                <p>
                  {lang === "en"
                    ? "Please note that product colors may appear slightly different due to lighting, screen resolution, and photography."
                    : "يرجى ملاحظة أن ألوان المنتج قد تبدو مختلفة قليلاً بسبب الإضاءة ودقة الشاشة والتصوير."}
                </p>
                <p>
                  {lang === "en"
                    ? "Minor variations in texture or shade are normal and do not affect the quality or authenticity of the product."
                    : "الاختلافات الطفيفة في الملمس أو اللون طبيعية ولا تؤثر على جودة أو أصالة المنتج."}
                </p>
                <p className="font-semibold">
                  {lang === "en"
                    ? "All items are original La Voile products, carefully selected to meet high quality standards."
                    : "جميع المنتجات أصلية من La Voile، تم اختيارها بعناية لتلبية معايير الجودة العالية."}
                </p>
              </div>
            </div>
          </div>

          {/* Price */}
          <p className="text-2xl font-semibold text-amber-700">
            {scarf.price} EGP
          </p>

          {/* Rating */}
          <p className="text-lg text-gray-700">
            ⭐ {(scarf.ratingsAverage || 0).toFixed(1)} (
            {scarf.ratingsQuantity || 0}{" "}
            {lang === "en" ? "reviews" : "تقييم"})
          </p>

          {/* Stock */}
          <div className="mb-4">
            {scarf.stock > 0 ? (
              <span className="text-green-600 font-bold px-3 py-1 rounded-full bg-green-50 border border-green-200">
                {lang === "en" ? "In Stock" : "متوفر"}
              </span>
            ) : (
              <span className="text-red-600 font-bold px-3 py-1 rounded-full bg-red-50 border border-red-200">
                {lang === "en" ? "Out of Stock" : "نفذ المخزون"}
              </span>
            )}
          </div>

          {/* Cart Actions */}
          {!itemInCart ? (
            <button
              onClick={handleAddToCart}
              disabled={disabled}
              className={`mt-3 w-full py-2 rounded-full text-[16px] font-semibold text-white transition-all duration-300 ${
                disabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-linear-to-r from-amber-700 to-amber-900 hover:opacity-90 shadow"
              }`}
            >
              {disabled
                ? lang === "en"
                  ? "Out of Stock"
                  : "غير متوفر"
                : lang === "en"
                ? "Add to Cart"
                : "أضف إلى السلة"}
            </button>
          ) : (
            <div className="mt-3 flex items-center justify-between">
              {itemInCart.quantity === 1 ? (
                <button
                  onClick={handleRemoveFromCart}
                  className="p-2 bg-red-500 text-white rounded-full shadow-lg transition"
                >
                  <Trash size={18} />
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleUpdateQuantity(itemInCart.quantity - 1)
                  }
                  className="px-4 py-2 bg-gray-200 rounded-full font-bold shadow-sm transition"
                >
                  -
                </button>
              )}

              <span className="px-4 text-lg font-semibold">
                {itemInCart.quantity}
              </span>

              <button
                onClick={() =>
                  handleUpdateQuantity(itemInCart.quantity + 1)
                }
                className="px-4 py-2 bg-gray-200 rounded-full font-bold shadow-sm transition"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen image viewer */}
      {isImageOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setIsImageOpen(false)}
        >
          <Image
            src={mainImage}
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
