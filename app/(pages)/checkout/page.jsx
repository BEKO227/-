"use client";

import { useState, useEffect } from "react";
import { useCart } from "../../CartContext";
import { useAuth } from "../../AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot
} from "firebase/firestore";
import toast from "react-hot-toast";


export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [instaRef, setInstaRef] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(0);

  // Listen to free delivery threshold from Firestore
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "Sale", "freeDelivery"), (snap) => {
      if (snap.exists()) {
        setFreeDeliveryThreshold(snap.data().Price || 0);
      }
    });
    return () => unsub();
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const qualifiesForFreeDelivery = cartTotal >= freeDeliveryThreshold;
  const deliveryFee = qualifiesForFreeDelivery ? 0 : 50; // 50 EGP if not qualified
  const total = Math.max(cartTotal - discount + deliveryFee, 0);

  // -----------------------------
  // Check if user has previous orders
  // -----------------------------
  const userHasPreviousOrders = async () => {
    const q = query(collection(db, "orders"), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    return !snap.empty;
  };

  // -----------------------------
  // Protected routing
  // -----------------------------
  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/auth/signin");
      else if (cart.length === 0) router.push("/AllScarfs");
    }
  }, [user, authLoading, cart.length, router]);

  // -----------------------------
  // Apply promo code
  // -----------------------------
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return toast.error("Enter a promo code.");

    const code = promoCode.toUpperCase();

    try {
      const promoRef = doc(db, "promocodes", code);
      const promoSnap = await getDoc(promoRef);

      if (!promoSnap.exists()) return toast.error("Invalid promo code");
      const promo = promoSnap.data();
      const now = new Date();

      if (!promo.active) return toast.error("Promo code disabled");
      if (promo.expiresAt.toDate() < now) return toast.error("Promo code expired");
      if (promo.firstOrderOnly && await userHasPreviousOrders())
        return toast.error("Valid only for the first order");
      if (promo.usedCount >= promo.usageLimit) return toast.error("Promo code fully used");

      let newDiscount = 0;
      if (promo.discountType === "percentage") newDiscount = (cartTotal * promo.discountValue) / 100;
      else if (promo.discountType === "fixed") newDiscount = promo.discountValue;
      newDiscount = Math.min(newDiscount, promo.maxDiscount);

      setDiscount(newDiscount);
      setPromoApplied(true);

      toast.success(`Promo applied! Saved ${newDiscount.toFixed(2)} EGP`);

      await updateDoc(promoRef, { usedCount: promo.usedCount + 1 });
    } catch (err) {
      console.error("Promo error:", err);
      toast.error("Failed to apply promo code");
    }
  };

  // -----------------------------
  // Remove promo code
  // -----------------------------
  const handleRemovePromo = () => {
    setPromoCode("");
    setPromoApplied(false);
    setDiscount(0);
    toast.success("Promo code removed");
  };

  // -----------------------------
  // Place order
  // -----------------------------
  const handleOrder = async () => {
    if (!user) return;

    if (!fullName.trim() || !phone.trim() || (paymentMethod === "COD" && !address.trim())) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (paymentMethod === "InstaPay" && !instaRef.trim()) {
      toast.error("Please provide your InstaPay reference number.");
      return;
    }

    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cart,
        subtotal: cartTotal,
        discount,
        deliveryFee,
        total,
        paymentMethod,
        referenceNumber: paymentMethod === "InstaPay" ? instaRef : null,
        status: paymentMethod === "COD" ? "pending" : "waiting_for_payment",
        fullName,
        phone,
        address: paymentMethod === "COD" ? address : null,
        promoCode: promoApplied ? promoCode.toUpperCase() : null,
        createdAt: serverTimestamp(),
      });

      clearCart();
      router.push(`/checkout/confirmation/${docRef.id}`);
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Failed to place order");
    }

    setLoading(false);
  };

  // -----------------------------
  // Render
  // -----------------------------
  if (authLoading || !user || cart.length === 0) {
    return (
      <div className="p-10 text-center text-amber-700 text-xl">
        Checking authentication or cart...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      
       <button
        onClick={() => router.back()}
        className="mb-4 text-amber-700 font-semibold hover:underline"
          >
            ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Customer Info */}
      <div className="mb-6 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Customer Information</h2>
        <input type="text" placeholder="Full Name *" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border rounded p-2 mb-2" />
        <input type="text" placeholder="Phone Number *" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded p-2 mb-2" />
        {paymentMethod === "COD" && (
          <textarea placeholder="Address *" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded p-2 mb-2" />
        )}
      </div>

      {/* Order Summary */}
      <div className="mb-6 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>

        {cart.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>{item.title} x {item.quantity}</span>
            <span>{(item.price * item.quantity).toFixed(2)} EGP</span>
          </div>
        ))}

        {/* Promo Code Section */}
        <div className="mt-4 flex gap-2 items-center">
          <input type="text" placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="border p-2 rounded flex-1" disabled={promoApplied} />
          {!promoApplied ? (
            <button onClick={handleApplyPromo} className="bg-amber-700 text-white px-4 py-2 rounded">Apply</button>
          ) : (
            <button onClick={handleRemovePromo} className="bg-red-600 text-white px-4 py-2 rounded">Remove</button>
          )}
        </div>

        {promoApplied && (
          <p className="text-green-700 mt-1">Promo applied! Discount: {discount.toFixed(2)} EGP</p>
        )}

        {/* Delivery Fee */}
        <p className="mt-2">Delivery Fee: {deliveryFee.toFixed(2)} EGP {qualifiesForFreeDelivery && "(Free Delivery!)"}</p>

        <div className="flex justify-between font-semibold mt-2">
          <span>Total:</span>
          <span>{total.toFixed(2)} EGP</span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Payment Method</h2>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
            Cash on Delivery
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="payment" value="InstaPay" checked={paymentMethod === "InstaPay"} onChange={() => setPaymentMethod("InstaPay")} />
            InstaPay
          </label>
        </div>
        {paymentMethod === "InstaPay" && (
          <div className="mt-4 p-4 bg-yellow-50 border rounded-lg">
            <p className="mb-2">Please pay to:<br />Phone: +20 102 715 7089<br />Bank Account: 123-456-789-1011</p>
            <p className="mb-2">
              Steps:<br />1. Include your username in the transaction notes.<br />2. Complete the payment.<br />3. Send the screenshot on WhatsApp.<br />4. Enter your reference number below.
            </p>
            <input type="text" placeholder="Reference Number *" value={instaRef} onChange={(e) => setInstaRef(e.target.value)} className="w-full border rounded p-2" />
          </div>
        )}
      </div>

      <button onClick={handleOrder} disabled={loading} className="bg-amber-700 text-white px-6 py-3 rounded-full hover:bg-amber-800 disabled:bg-gray-400">
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
