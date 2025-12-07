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

  if (cart.length === 0) {
    return (
      <div className={`p-10 text-center ${lang === "ar" ? "rtl" : "ltr"}`}>
        <h2 className="text-2xl font-bold mb-4">
          {lang === "ar" ? "سلة التسوق فارغة" : "Your cart is empty"}
        </h2>
        <Link href="/AllScarfs" className="text-amber-700 underline">
          {lang === "ar" ? "تصفح الأوشحة" : "Browse Scarves"}
        </Link>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto px-6 py-10 ${lang === "ar" ? "rtl text-right" : "ltr text-left"}`}>
      <h1 className="text-3xl font-bold mb-6">
        {lang === "ar" ? "سلة التسوق" : "Shopping Cart"}
      </h1>

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
            key={item.id}
            className="flex flex-col md:flex-row justify-between items-center border p-4 rounded-lg gap-4"
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="w-24 h-24 relative shrink-0">
                <Image src={item.imageCover} alt={item.title} fill className="object-cover rounded-lg" />
              </div>
              <div className="flex flex-col">
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="text-amber-700 font-medium">{item.price.toLocaleString()} EGP</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2 md:mt-0">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, Math.max(1, Number(e.target.value)))
                }
                className="w-16 border rounded p-1 text-center"
              />
              <button
                onClick={() => removeFromCart(item.id)}
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

        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="bg-amber-700 text-white px-6 py-3 rounded-full hover:bg-amber-800"
          >
            {lang === "ar" ? "مسح السلة" : "Clear Cart"}
          </button>

          <button
            onClick={() => router.push("/checkout")}
            disabled={cart.length === 0}
            className={`px-6 py-3 rounded-full text-white ${
              cart.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {lang === "ar" ? "الدفع" : "Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
