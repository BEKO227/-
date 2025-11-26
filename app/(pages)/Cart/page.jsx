"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../AuthContext";
import { useCart } from "../../CartContext";
import Link from "next/link";
import Image from "next/image";
import useFreeDelivery from "../../hooks/useFreeDelivery";

export default function ProtectedCartPage() {
  const { user, loading } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const freeDeliveryLimit = useFreeDelivery();

  useEffect(() => {
    if (!loading && !user) router.push("/auth/signin");
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-10 text-center text-amber-700">Loading...</div>;

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const qualifies = freeDeliveryLimit !== null && cartTotal >= freeDeliveryLimit;

  const deliveryFee = qualifies ? 0 : 50; // 50 EGP unless free delivery
  const finalTotal = cartTotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link href="/AllScarfs" className="text-amber-700 underline">Browse Scarves</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {/* Free Delivery Banner */}
      {freeDeliveryLimit !== null && (
        <div
          className={`p-4 rounded-lg mb-6 text-center font-medium ${
            qualifies ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"
          }`}
        >
          {qualifies ? (
            <p>🎉 You unlocked <b>FREE DELIVERY</b>!</p>
          ) : (
            <p>
              🛵 Free delivery on orders above <b>{freeDeliveryLimit} EGP</b><br />
              Add <b>{(freeDeliveryLimit - cartTotal).toFixed(2)} EGP</b> more to qualify.
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
                <p className="text-amber-700 font-medium">{item.price} EGP</p>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2 md:mt-0">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                className="w-16 border rounded p-1 text-center"
              />
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Totals & Checkout */}
      <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xl font-semibold">
          <p>Subtotal: {cartTotal.toFixed(2)} EGP</p>
          <p>Delivery: {deliveryFee.toFixed(2)} EGP</p>
          <p className="mt-1 font-bold">Total: {finalTotal.toFixed(2)} EGP</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={clearCart}
            className="bg-amber-700 text-white px-6 py-3 rounded-full hover:bg-amber-800"
          >
            Clear Cart
          </button>

          <button
            onClick={() => router.push("/checkout")}
            className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
