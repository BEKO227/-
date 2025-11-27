"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../AuthContext";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import toast from "react-hot-toast";

// --- OrderItem component must be outside UserDashboard ---
function OrderItem({ order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border p-2 rounded mb-2">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <p><strong>Order ID:</strong> {order.id}</p>
        <button className="text-amber-700 font-semibold">
          {expanded ? "Hide Details" : "View Details"}
        </button>
      </div>

      {expanded && (
        <div className="mt-2 border-t pt-2">
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> {order.total.toFixed(2)} EGP</p>
          <h3 className="font-semibold mt-2">Items:</h3>
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex justify-between mb-1">
              <span>{item.title}</span>
              <span>{item.quantity} x {item.price} EGP</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  // -----------------------------
  // Profile info
  // -----------------------------
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const fetchUserData = async () => {
    if (!user) return;
    try {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFullName(data.name || "");
        setPhone(data.phone || "");
        setAddress(data.location || "");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  const handleProfileUpdate = async () => {
    if (!fullName.trim() || !phone.trim()) {
      return toast.error("Name and phone are required.");
    }
    try {
      await updateDoc(doc(db, "users", user.uid), {
        name: fullName,
        phone,
        location: address,
      });
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  // -----------------------------
  // Orders
  // -----------------------------
  const [orders, setOrders] = useState([]);
  const fetchOrders = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "orders"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      const fetchedOrders = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(fetchedOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  // -----------------------------
  // Promo Codes
  // -----------------------------
  const [promoCodes, setPromoCodes] = useState([]);
  const fetchPromoCodes = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "promocodes"),
        where("usersUsed", "array-contains", user.uid)
      );
      const snap = await getDocs(q);
      const fetchedPromos = snap.docs.map((doc) => doc.data());
      setPromoCodes(fetchedPromos);
    } catch (err) {
      console.error("Error fetching promo codes:", err);
    }
  };

  // -----------------------------
  // Load data when user is ready
  // -----------------------------
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchOrders();
      fetchPromoCodes();
    }
  }, [user]);

  if (authLoading) return <p className="p-10 text-center">Loading...</p>;
  if (!user) return <p className="p-10 text-center">Please sign in.</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          className={`py-2 px-4 ${activeTab === "profile" ? "border-b-2 border-amber-700 font-semibold" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "orders" ? "border-b-2 border-amber-700 font-semibold" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "promos" ? "border-b-2 border-amber-700 font-semibold" : ""}`}
          onClick={() => setActiveTab("promos")}
        >
          Promo Codes
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Profile Info</h2>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border rounded p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded p-2 mb-2"
          />
          <button
            onClick={handleProfileUpdate}
            className="bg-amber-700 text-white px-6 py-2 rounded hover:bg-amber-800"
          >
            Update Profile
          </button>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
          {orders.length === 0 && <p>No orders yet.</p>}

          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      )}

      {activeTab === "promos" && (
        <div className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your Promo Codes</h2>
          {promoCodes.length === 0 && <p>No promo codes yet.</p>}
          {promoCodes.map((promo, idx) => (
            <div key={idx} className="border p-2 rounded mb-2">
              <p><strong>Code:</strong> {promo.code}</p>
              <p><strong>Discount:</strong> {promo.discountType === "percentage" ? `${promo.discountValue}%` : `${promo.discountValue} EGP`}</p>
              <p><strong>Expires:</strong> {promo.expiresAt.toDate().toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
