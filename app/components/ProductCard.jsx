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

  const itemInCart = cart.find((i) => i.id === product.id);
  const getText = (en, ar) => (lang === "ar" ? ar || en : en);

  useEffect(() => {
    setDisabled(product.stock <= 0);
  }, [product.stock]);

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

  const goToDetails = () => {
    router.push(`/products/${product.id}`);
  };

  /* ✅ SAFE IMAGE LOGIC */
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
    "New Arrival": "bg-blue-500",
    "أحدث": "bg-blue-500",
    "Top Seller": "bg-green-500",
    "الأكثر مبيعًا": "bg-green-500",
    "On Sale": "bg-red-500",
    "تخفيض": "bg-red-500",
  };

  return (
    <Card
      onClick={goToDetails}
      className="shadow-md rounded-2xl overflow-hidden w-full max-w-[320px] mx-auto cursor-pointer hover:shadow-xl transition relative"
    >
      <CardHeader className="p-0 relative">
        <div className="relative w-full h-64">
          {coverImage && (
            <Image
              src={coverImage}
              alt={product.title}
              fill
              className="object-cover rounded-t-2xl"
              sizes="(max-width: 768px) 100vw, 320px"
            />
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {badges.map((badge) => (
            <span
              key={badge}
              className={`text-white text-xs font-bold px-2 py-1 rounded-full ${badgeColors[badge]}`}
            >
              {badge}
            </span>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Title */}
        <CardTitle className="text-lg font-medium text-amber-800">
          {lang === "en" ? product.title : product.title_ar || product.title}
        </CardTitle>

        {/* Brand */}
        {product.brand && (
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {getText(product.brand, product.brand_ar)}
          </p>
        )}

        {/* Category */}
        {product.category && (
          <span className="inline-block mt-3 mb-2 px-4 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800">
            {getText(product.category, product.categoryAr)}
          </span>
        )}

        {/* Price */}
        <p className="text-amber-700 font-semibold mt-1">
          {product.price} EGP
        </p>

        {/* Stock */}
        <p className="mt-2 text-gray-600">
          {product.stock > 0 ? (
            <span className="text-green-600 font-bold">
              {lang === "en" ? "In Stock" : "متوفر"}
            </span>
          ) : (
            <span className="text-red-600 font-bold">
              {lang === "en" ? "Out of Stock" : "غير متوفر"}
            </span>
          )}
        </p>

        {/* Cart Actions */}
        {!itemInCart ? (
          <button
            onClick={handleAddToCart}
            disabled={disabled}
            className={`mt-3 w-full py-2 rounded-full font-semibold text-white ${
              disabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-amber-700 hover:bg-amber-800"
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
            className="mt-4 flex items-center justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {itemInCart.quantity === 1 ? (
              <button
                onClick={() => removeFromCart(product.id)}
                className="p-2 bg-red-500 text-white rounded-full"
              >
                <Trash size={18} />
              </button>
            ) : (
              <button
                onClick={() =>
                  updateQuantity(product.id, itemInCart.quantity - 1)
                }
                className="px-4 py-2 bg-gray-200 rounded-full text-lg font-bold"
              >
                -
              </button>
            )}

            <span className="px-4 text-lg font-semibold">
              {itemInCart.quantity}
            </span>

            <button
              onClick={() =>
                updateQuantity(product.id, itemInCart.quantity + 1)
              }
              className="px-4 py-2 bg-gray-200 rounded-full text-lg font-bold"
            >
              +
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
