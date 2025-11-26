"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { useRouter } from "next/navigation";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnap = await getDocs(q);
        const userOrders = querySnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(userOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (authLoading || loading) {
    return <div className="p-10 text-center text-amber-700">Loading your orders...</div>;
  }

  if (!orders.length) {
    return (
      <div className="p-10 text-center text-amber-700">
        You have no orders yet.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-amber-800">My Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="mb-6 border p-4 rounded-lg shadow-sm">
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          {order.paymentMethod === "InstaPay" && (
            <p><strong>Reference Number:</strong> {order.referenceNumber}</p>
          )}
          <p className="font-semibold mt-2">Items:</p>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between ml-4 mb-1">
              <span>{item.title} x {item.quantity}</span>
              <span>{(item.price * item.quantity).toFixed(2)} EGP</span>
            </div>
          ))}
          <p className="mt-2 font-bold">Total: {order.total.toFixed(2)} EGP</p>
          <p className="mt-1 text-sm text-gray-500">Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
}
