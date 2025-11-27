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
  onSnapshot,
} from "firebase/firestore";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [building, setBuilding] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [government, setGovernment] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [instaRef, setInstaRef] = useState("");
  const [loading, setLoading] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);

  const governments = [
    "Cairo", "Alexandria", "Giza", "Qalyubia", "Dakahlia", "Sharqia",
    "Gharbia", "Beheira", "Fayoum", "Menoufia", "Minya", "Asyut",
    "Sohag", "Qena", "Luxor", "Aswan", "Red Sea", "New Valley",
    "Beni Suef", "Ismailia", "Suez", "Port Said", "Damietta",
    "North Sinai", "South Sinai", "Matrouh",
  ];

  // ------------------------------------------------
  // 1) Prefill user data
  // ------------------------------------------------
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setFullName(data.name || "");
            setPhone(data.phone || "");

            if (data.location) {
              const parts = data.location.split(" - ");
              setBuilding(parts[0] || "");
              setStreet(parts[1] || "");
              setCity(parts[2] || "");
            }
          }
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      };

      fetchUserData();
    }
  }, [user]);

  // ------------------------------------------------
  // 2) Auto-save address
  // ------------------------------------------------
  const saveAddressToUser = async () => {
    if (!user) return;

    try {
      const location = `${building} - ${street} - ${city} - ${government}`;
      await updateDoc(doc(db, "users", user.uid), { location });
    } catch (err) {
      console.error("Update location failed:", err);
    }
  };

  // ------------------------------------------------
  // 3) Free delivery threshold
  // ------------------------------------------------
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "Sale", "freeDelivery"), (snap) => {
      if (snap.exists()) setFreeDeliveryThreshold(snap.data().Price || 0);
    });

    return () => unsub();
  }, []);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const qualifiesForFreeDelivery = cartTotal >= freeDeliveryThreshold;

  // ------------------------------------------------
  // ⭐ 4) Delivery fee based on government (NEW)
  // ------------------------------------------------
  useEffect(() => {
    const fetchDeliveryFee = async () => {
      if (!government) return;

      try {
        const feeRef = doc(db, "deliveryFees", government);
        const feeSnap = await getDoc(feeRef);

        if (feeSnap.exists()) {
          setDeliveryFee(feeSnap.data().fee || 0);
        } else {
          setDeliveryFee(60); // fallback default
        }
      } catch (err) {
        console.error("Error loading delivery fee:", err);
      }
    };

    fetchDeliveryFee();
  }, [government]);

  const finalDeliveryFee = qualifiesForFreeDelivery ? 0 : deliveryFee;
  const total = Math.max(cartTotal - discount + finalDeliveryFee, 0);

  // ------------------------------------------------
  // Protected route
  // ------------------------------------------------
  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push("/auth/signin");
      else if (cart.length === 0) router.push("/AllScarfs");
    }
  }, [user, authLoading, cart.length, router]);

  // ------------------------------------------------
  // Promo code
  // ------------------------------------------------
  const userHasPreviousOrders = async () => {
    const q = query(collection(db, "orders"), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    return !snap.empty;
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return toast.error("Enter promo code");

    const code = promoCode.toUpperCase();

    try {
      const promoRef = doc(db, "promocodes", code);
      const promoSnap = await getDoc(promoRef);
      if (!promoSnap.exists()) return toast.error("Invalid promo code");

      const promo = promoSnap.data();
      const now = new Date();

      if (!promo.active) return toast.error("Promo disabled");
      if (promo.expiresAt.toDate() < now) return toast.error("Expired promo");
      if (promo.firstOrderOnly && (await userHasPreviousOrders()))
        return toast.error("First order only");
      if (promo.usedCount >= promo.usageLimit)
        return toast.error("Promo usage limit reached");

      let newDiscount = 0;

      if (promo.discountType === "percentage")
        newDiscount = (cartTotal * promo.discountValue) / 100;
      else if (promo.discountType === "fixed")
        newDiscount = promo.discountValue;

      newDiscount = Math.min(newDiscount, promo.maxDiscount);

      setDiscount(newDiscount);
      setPromoApplied(true);

      await updateDoc(promoRef, { usedCount: promo.usedCount + 1 });

      toast.success(`Saved ${newDiscount.toFixed(2)} EGP`);
    } catch (err) {
      toast.error("Failed to apply promo");
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setDiscount(0);
    setPromoApplied(false);
  };

  // ------------------------------------------------
  // Place order
  // ------------------------------------------------
  const handleOrder = async () => {
    if (!fullName || !phone || !building || !street || !city || !government) {
      return toast.error("Fill all required fields.");
    }
    if (paymentMethod === "InstaPay" && !instaRef) {
      return toast.error("Enter InstaPay reference number.");
    }
  
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cart,
        subtotal: cartTotal,
        discount,
        deliveryFee: finalDeliveryFee,
        total,
        paymentMethod,
        referenceNumber: paymentMethod === "InstaPay" ? instaRef : null,
        status: paymentMethod === "COD" ? "pending" : "waiting_for_payment",
        fullName,
        phone,
        address: `${building} - ${street} - ${city} - ${government}`,
        promoCode: promoApplied ? promoCode.toUpperCase() : null,
        createdAt: serverTimestamp(),
      });
  
      await saveAddressToUser();
      clearCart();
  
      console.log("Order placed:", docRef.id);
      // Delay to ensure cart clears
      setTimeout(() => {
        router.replace(`/checkout/confirmation/${docRef.id}`);
      }, 50);
    } catch (err) {
      console.error(err);
      toast.error("Order failed");
    }
    setLoading(false);
  };
  

  // ------------------------------------------------
  // Render
  // ------------------------------------------------
  if (authLoading || !user || cart.length === 0)
    return (
      <div className="p-10 text-center text-amber-700 text-xl">
        Loading...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button
        onClick={() => router.back()}
        className="mb-4 text-amber-700 font-semibold hover:underline"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* CUSTOMER INFO */}
      <div className="mb-6 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Customer Information</h2>

        <input
          type="text"
          placeholder="Full Name *"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border rounded p-2 mb-2"
        />

        <input
          type="text"
          placeholder="Phone Number *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded p-2 mb-2"
        />
      </div>

      {/* ADDRESS */}
      <div className="mb-6 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Delivery Address</h2>

        <input
          type="text"
          placeholder="Building Name / Number *"
          value={building}
          onChange={(e) => setBuilding(e.target.value)}
          className="w-full border rounded p-2 mb-2"
        />

        <input
          type="text"
          placeholder="Street Name *"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
          className="w-full border rounded p-2 mb-2"
        />

        <input
          type="text"
          placeholder="City *"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border rounded p-2 mb-2"
        />

        <select
          value={government}
          onChange={(e) => setGovernment(e.target.value)}
          className="w-full border rounded p-2 mb-2"
        >
          <option value="">Select Government *</option>
          {governments.map((gov) => (
            <option key={gov} value={gov}>
              {gov}
            </option>
          ))}
        </select>
      </div>

      {/* ORDER SUMMARY */}
      <div className="mb-6 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Order Summary</h2>

        {cart.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.title} × {item.quantity}
            </span>
            <span>
              {(item.price * item.quantity).toFixed(2)} EGP
            </span>
          </div>
        ))}

        <div className="mt-4 flex gap-2 items-center">
          <input
            type="text"
            placeholder="Promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="border p-2 rounded flex-1"
            disabled={promoApplied}
          />

          {!promoApplied ? (
            <button
              onClick={handleApplyPromo}
              className="bg-amber-700 text-white px-4 py-2 rounded"
            >
              Apply
            </button>
          ) : (
            <button
              onClick={handleRemovePromo}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Remove
            </button>
          )}
        </div>

        {promoApplied && (
          <p className="text-green-700 mt-1">
            Discount: {discount.toFixed(2)} EGP
          </p>
        )}

        <p className="mt-2">
          Delivery Fee: {finalDeliveryFee.toFixed(2)} EGP{" "}
          {qualifiesForFreeDelivery && "(Free Delivery!)"}
        </p>

        <div className="flex justify-between font-semibold mt-2">
          <span>Total:</span>
          <span>{total.toFixed(2)} EGP</span>
        </div>
      </div>

      {/* PAYMENT */}
      <div className="mb-6 border p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Payment Method</h2>

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="InstaPay"
              checked={paymentMethod === "InstaPay"}
              onChange={() => setPaymentMethod("InstaPay")}
            />
            InstaPay
          </label>
        </div>

        {paymentMethod === "InstaPay" && (
          <div className="mt-4 p-4 bg-yellow-50 border rounded-lg">
            <p className="mb-2">
              Please pay to:<br />
              Phone: +20 102 715 7089<br />
              Bank Account: 123-456-789-1011
            </p>

            <p className="mb-2">
              Steps:<br />
              1. Include your username in the transaction notes.<br />
              2. Complete the payment.<br />
              3. Send screenshot on WhatsApp.<br />
              4. Enter the reference number.
            </p>

            <input
              type="text"
              placeholder="Reference Number *"
              value={instaRef}
              onChange={(e) => setInstaRef(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleOrder}
        disabled={loading}
        className="bg-amber-700 text-white px-6 py-3 rounded-full hover:bg-amber-800 disabled:bg-gray-400"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}
