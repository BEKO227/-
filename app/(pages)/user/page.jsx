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

// -------------------------------
// Reusable Order Item
// -------------------------------
function OrderItem({ order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-4 mb-3 shadow-sm bg-white">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex justify-between cursor-pointer"
      >
        <p className="font-semibold text-gray-800">
          Order ID: <span className="text-amber-700">{order.id}</span>
        </p>
        <button className="text-amber-700 font-semibold">
          {expanded ? "Hide" : "Details"}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 border-t pt-3">
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total:</strong> {order.total.toFixed(2)} EGP
          </p>
          <p>
            <strong>Customer:</strong> {order.firstName} {order.lastName}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>

          <h3 className="font-semibold mt-3">Items:</h3>
          <div className="mt-2 space-y-1">
            {order.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between text-sm text-gray-700"
              >
                <span>{item.title}</span>
                <span>
                  {item.quantity} × {item.price} EGP
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const fetchUserData = async () => {
    if (!user) return;
    try {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPhone(data.phone || "");
        setAddress(data.location || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileUpdate = async () => {
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      return toast.error("First name, last name, and phone are required.");
    }

    try {
      await updateDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        phone,
        location: address,
      });
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  const [orders, setOrders] = useState([]);
  const fetchOrders = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "orders"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
  };

  const [promoCodes, setPromoCodes] = useState([]);
  const fetchPromoCodes = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "promocodes"),
        where("usersUsed", "array-contains", user.uid)
      );
      const snap = await getDocs(q);
      setPromoCodes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchOrders();
      fetchPromoCodes();
    }
  }, [user]);

  if (authLoading)
    return <p className="p-10 text-center text-gray-600">Loading...</p>;

  if (!user)
    return (
      <p className="p-10 text-center text-gray-600">
        Please sign in to access your dashboard.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">My Account</h1>

      {/* Tabs */}
      <div className="flex gap-6 border-b pb-2 mb-8">
        {["profile", "orders", "promos"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 capitalize text-lg font-medium transition ${
              activeTab === tab
                ? "text-amber-700 border-b-2 border-amber-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ---------------- PROFILE ---------------- */}
      {activeTab === "profile" && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
            <input
              type="text"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

          <button
            onClick={handleProfileUpdate}
            className="mt-5 bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* ---------------- ORDERS ---------------- */}
      {activeTab === "orders" && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Order History</h2>

          {orders.length === 0 ? (
            <p className="text-gray-600">You have no orders yet.</p>
          ) : (
            orders.map((order) => <OrderItem key={order.id} order={order} />)
          )}
        </div>
      )}

      {/* ---------------- PROMOS ---------------- */}
      {activeTab === "promos" && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Used Promo Codes</h2>

          {promoCodes.length === 0 ? (
            <p className="text-gray-600">No promo codes used yet.</p>
          ) : (
            promoCodes.map((promo) => (
              <div
                key={promo.id}
                className="border p-4 rounded-lg mb-3 shadow-sm bg-gray-50"
              >
                <p>
                  <strong>Code:</strong> {promo.code}
                </p>
                <p>
                  <strong>Discount:</strong>{" "}
                  {promo.discountType === "percentage"
                    ? `${promo.discountValue}%`
                    : `${promo.discountValue} EGP`}
                </p>
                <p>
                  <strong>Expires:</strong>{" "}
                  {promo.expiresAt.toDate().toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
