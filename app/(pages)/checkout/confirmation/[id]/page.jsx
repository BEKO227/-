"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "../../../../AuthContext";

export default function ConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect if not logged in
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const orderData = { id: docSnap.id, ...docSnap.data() };

          // Check ownership
          if (orderData.userId !== user.uid) {
            toast.error("You are not authorized to view this order.");
            router.push("/");
            return;
          }

          setOrder(orderData);
        } else {
          toast.error("Order not found");
          setOrder(null);
        }
      } catch (err) {
        console.error("Fetch order error:", err);
        toast.error("Failed to fetch order");
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (id && user) fetchOrder();
  }, [id, user, router]);

  if (authLoading || loading) return <div className="p-10 text-center">Loading...</div>;
  if (!order) return <div className="p-10 text-center text-red-600">Order not found</div>;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-amber-700 mb-6">✅ Order Confirmation</h1>
      <p className="text-lg mb-2">Thank you for your purchase, {order.fullName}!</p>
      <p className="mb-4">Order ID: <span className="font-semibold">{order.id}</span></p>

      {/* Order Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {order.items?.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg shadow-sm">
            <Image src={item.imageCover} alt={item.title} width={80} height={80} className="rounded-lg" />
            <div>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {(item.price * item.quantity).toFixed(2)} EGP</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="text-lg font-semibold mb-6">
        <p>Subtotal: {order.subtotal.toFixed(2)} EGP</p>
        {order.discount > 0 && <p>Discount: {order.discount.toFixed(2)} EGP</p>}
        <p>Delivery Fee: {order.deliveryFee.toFixed(2)} EGP</p>
        <p>Total: {order.total.toFixed(2)} EGP</p>
        <p>Payment Method: {order.paymentMethod}</p>
        {order.paymentMethod === "InstaPay" && <p>Reference Number: {order.referenceNumber}</p>}
      </div>

      <button
        onClick={() => router.push("/")}
        className="mt-4 px-6 py-3 bg-amber-700 text-white rounded-full hover:bg-amber-800"
      >
        Continue Shopping
      </button>
    </div>
  );
}
