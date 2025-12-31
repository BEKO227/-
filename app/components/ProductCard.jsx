"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "../CartContext";
import { useAuth } from "../AuthContext";
import { useRouter } from "next/navigation";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useLanguage } from "@/app/LanguageContext";

export default function ProductCard({ product, small = false }) {
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { lang } = useLanguage();

  const [disabled, setDisabled] = useState(false);
  const [showColors, setShowColors] = useState(false); // 🔹 toggle color stocks

  const itemInCart = cart.find((i) => i.id === product.id);
  const getText = (en, ar) => (lang === "ar" ? ar || en : en);

  const totalStock = product.colors?.length
    ? product.colors.reduce((sum, c) => sum + (Number(c.stock) || 0), 0)
    : product.stock;

  useEffect(() => setDisabled(totalStock <= 0), [totalStock]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      router.push("/auth/signin");
      return;
    }
    addToCart(product);
    toast.success(
      lang === "en" ? "Product added to cart" : "تمت إضافة المنتج إلى السلة"
    );
  };

  const goToDetails = () => router.push(`/products/${product.id}`);

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images.filter(Boolean)
      : ["/placeholder.webp"];
  const coverImage = images[0];

  const badges = [];
  if (product.isNewArrival) badges.push(lang === "en" ? "New Arrival" : "أحدث");
  if (product.isTopSeller) badges.push(lang === "en" ? "Top Seller" : "الأكثر مبيعًا");
  if (product.isOnSale) badges.push(lang === "en" ? "On Sale" : "تخفيض");

  const badgeColors = {
    "New Arrival": "from-blue-400 to-blue-600",
    "أحدث": "from-blue-400 to-blue-600",
    "Top Seller": "from-emerald-400 to-emerald-600",
    "الأكثر مبيعًا": "from-emerald-400 to-emerald-600",
    "On Sale": "from-rose-500 to-red-600",
    "تخفيض": "from-rose-500 to-red-600",
  };

  return (
    <Card
      onClick={goToDetails}
      className={`group relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer max-w-60`}
    >
      <CardHeader className="p-0 relative">
        <div className="relative w-full h-44 overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/40 z-2" />
          <Image
            src={coverImage}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 240px"
          />
        </div>
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-3">
          {badges.map((badge) => (
            <span
              key={badge}
              className={`px-2 py-0.5 text-[10px] font-bold text-white rounded-full shadow-sm bg-linear-to-r ${badgeColors[badge]}`}
            >
              {badge}
            </span>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-3 flex flex-col justify-between h-full">
        <div>
          <CardTitle className="text-sm font-semibold text-amber-900 leading-snug line-clamp-2">
            {lang === "en" ? product.title : product.title_ar || product.title}
          </CardTitle>

          {product.brand && (
            <p className="text-[11px] mt-1 text-gray-500 line-clamp-1">
              {getText(product.brand, product.brand_ar)}
            </p>
          )}

          <p className="text-lg font-bold text-amber-700 mt-1">
            {product.price} <span className="text-[11px] text-gray-500">EGP</span>
          </p>

          <p className="mt-1">
            {totalStock > 0 ? (
              <span
                className="text-green-600 text-[12px] font-semibold cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColors(!showColors);
                }}
              >
                {lang === "en" ? "In Stock" : "متوفر"} 
              </span>
            ) : (
              <span className="text-red-600 text-[12px] font-semibold">
                {lang === "en" ? "Out of Stock" : "غير متوفر"}
              </span>
            )}
          </p>

          {showColors && product.colors?.length > 0 && (
            <div className="mt-2 bg-gray-50 p-2 rounded-md border border-gray-200">
              {product.colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px] mb-1">
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: c.hex }}
                  ></div>
                  <span>{c.name}</span>
                  <span className="ml-auto">
                    {c.stock} {lang === "en" ? "pcs" : "قطعة"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {!itemInCart ? (
          <button
            onClick={handleAddToCart}
            disabled={disabled}
            className={`mt-3 w-full py-2 rounded-full text-[13px] font-semibold text-white transition-all duration-300 ${
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
          <div
            className="mt-3 flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {itemInCart.quantity === 1 ? (
              <button
                onClick={() => removeFromCart(product.id)}
                className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
              >
                <Trash size={14} />
              </button>
            ) : (
              <button
                onClick={() =>
                  updateQuantity(product.id, itemInCart.quantity - 1)
                }
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-bold"
              >
                -
              </button>
            )}
            <span className="px-3 text-sm font-semibold">{itemInCart.quantity}</span>
            <button
              onClick={() =>
                updateQuantity(product.id, itemInCart.quantity + 1)
              }
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-bold"
            >
              +
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
