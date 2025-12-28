"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../AuthContext";
import { useCart } from "../../CartContext";
import Link from "next/link";
import Image from "next/image";
import useFreeDelivery from "../../hooks/useFreeDelivery";
import { useLanguage } from "../../LanguageContext";

export default function ProtectedCartPage() {
  const { user, loading } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const freeDeliveryLimit = useFreeDelivery();
  const { lang } = useLanguage(); // "en" or "ar"

  useEffect(() => {
    if (!loading && !user) router.push("/auth/signin");
  }, [user, loading, router]);

  if (loading || !user)
    return (
      <div className="p-10 text-center text-amber-700">
        {lang === "ar" ? "جارٍ التحميل..." : "Loading..."}
      </div>
    );

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const qualifies = freeDeliveryLimit !== null && cartTotal >= freeDeliveryLimit;
  const deliveryFee = qualifies ? 0 : 50;
  const finalTotal = cartTotal + deliveryFee;

  // -----------------------------
  // Empty Cart
  // -----------------------------
  if (cart.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center min-h-[60vh] text-center px-4 ${
          lang === "ar" ? "rtl" : "ltr"
        }`}
      >
        <Image
          src="/empty_cart.png" // optional empty cart icon
          alt="Empty Cart"
          width={120}
          height={120}
          className="mb-6"
        />
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-amber-900">
          {lang === "ar" ? "سلة التسوق فارغة" : "Your cart is empty"}
        </h2>
        <p className="mb-6 text-gray-600">
          {lang === "ar"
            ? "يبدو أنك لم تضف أي منتجات بعد."
            : "It looks like you haven't added any products yet."}
        </p>
        <Link
          href="/AllScarfs"
          className={`
            inline-block px-6 py-3 rounded-full text-[13px] font-semibold text-white
            bg-linear-to-r from-amber-700 to-amber-900 hover:opacity-90 shadow transition-all duration-300
          `}
        >
          {lang === "ar" ? "تصفح الأوشحة" : "Browse Scarves"}
        </Link>
      </div>
    );
  }

  // -----------------------------
  // Filled Cart
  // -----------------------------
  return (
    <div className={`max-w-6xl mx-auto px-6 py-10 ${lang === "ar" ? "rtl text-right" : "ltr text-left"}`}>
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
      <h1
        className={`
          text-4xl mb-6 text-center text-amber-900 font-bold
          ${lang === "ar" ? "draw-ar" : "draw-en"}
        `}
      >
        {lang === "ar" ? "سلة التسوق" : "Shopping Cart"}
      </h1>
      <div className="w-full h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent my-12" />

      {/* Free Delivery Banner */}
      {freeDeliveryLimit !== null && (
        <div
          className={`p-4 rounded-lg mb-6 text-center font-medium ${
            qualifies ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"
          }`}
        >
          {qualifies ? (
            <p>{lang === "ar" ? "🎉 لقد حصلت على توصيل مجاني!" : "🎉 You unlocked FREE DELIVERY!"}</p>
          ) : (
            <p>
              {lang === "ar"
                ? `🛵 توصيل مجاني للطلبات أعلى من ${freeDeliveryLimit.toLocaleString()} EGP`
                : `🛵 Free delivery on orders above ${freeDeliveryLimit.toLocaleString()} EGP`}
              <br />
              {lang === "ar"
                ? `أضف ${ (freeDeliveryLimit - cartTotal).toFixed(2) } EGP لتتأهل.`
                : `Add ${ (freeDeliveryLimit - cartTotal).toFixed(2) } EGP more to qualify.`}
            </p>
          )}
        </div>
      )}

      {/* Cart Items */}
      <div className="flex flex-col gap-6">
      {cart.map((item) => (
  <div
    key={item.uniqueId}
    className="flex flex-col md:flex-row justify-between items-center border p-4 rounded-lg gap-4"
  >
    <div className="flex items-center gap-4 w-full md:w-auto">
      <div className="w-24 h-24 relative shrink-0">
        <Image
          src={item.selectedColor?.image || item.images?.[0] || item.imageCover}
          alt={item.title}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      <div className="flex flex-col">
        <h2 className="font-semibold text-lg">{item.title}</h2>

        {/* Show selected color */}
        {item.selectedColor && (
          <div className="flex items-center gap-2 text-sm">
            <span>{lang === "ar" ? "اللون:" : "Color:"}</span>
            <div
              className="w-4 h-4 rounded-full border"
              style={{ backgroundColor: item.selectedColor.hex }}
            />
            <span>{item.selectedColor.name}</span>
          </div>
        )}

        <p className="text-amber-700 font-medium">
          {item.price.toLocaleString()} EGP
        </p>
      </div>
    </div>

    <div className="flex items-center gap-3 mt-2 md:mt-0">
      <input
        type="number"
        min="1"
        value={item.quantity}
        onChange={(e) =>
          updateQuantity(
            item.uniqueId,
            Math.max(1, Number(e.target.value))
          )
        }
        className="w-16 border rounded p-1 text-center"
      />

      <button
        onClick={() => removeFromCart(item.uniqueId)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        {lang === "ar" ? "إزالة" : "Remove"}
      </button>
    </div>
  </div>
))}

      </div>

      {/* Totals & Checkout */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xl font-semibold">
          <p>{lang === "ar" ? "المجموع الفرعي" : "Subtotal"}: {cartTotal.toLocaleString()} EGP</p>
          <p>{lang === "ar" ? "التوصيل" : "Delivery"}: {deliveryFee.toLocaleString()} EGP</p>
          <p className="mt-1 font-bold">{lang === "ar" ? "الإجمالي" : "Total"}: {finalTotal.toLocaleString()} EGP</p>
        </div>

        <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
          {/* Clear Cart */}
          <button
            onClick={clearCart}
            className={`
              w-full md:w-auto py-2 px-6 rounded-full text-[13px] font-semibold text-white
              transition-all duration-300
              bg-linear-to-r from-amber-700 to-amber-900 hover:opacity-90 shadow
            `}
          >
            {lang === "ar" ? "مسح السلة" : "Clear Cart"}
          </button>

          {/* Checkout */}
          <button
            onClick={() => router.push("/checkout")}
            disabled={cart.length === 0}
            className={`
              w-full md:w-auto py-2 px-6 rounded-full text-[13px] font-semibold text-white
              transition-all duration-300
              ${
                cart.length === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-linear-to-r from-green-600 to-green-800 hover:opacity-90 shadow"
              }
            `}
          >
            {lang === "ar" ? "الدفع" : "Checkout"}
          </button>
        </div>

      </div>
    </div>
  );
}
