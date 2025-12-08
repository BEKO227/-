"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";
import { useAuth } from "../../AuthContext";
import { useLanguage } from '@/app/LanguageContext';

// -------------------------------
// Reusable Order Item
// -------------------------------
function OrderItem({ order, t }) {
  const [expanded, setExpanded] = useState(false);
  const timelineStages = ["pending", "waiting_for_payment", "processing", "shipped", "delivered"];
  const stageIndex = timelineStages.indexOf(order.status);

  return (
    <div className="border rounded-lg p-4 mb-3 shadow-sm bg-white">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex justify-between cursor-pointer"
      >
        <p className="font-semibold text-gray-800">
          {t("Order ID", "رقم الطلب")}: <span className="text-amber-700">{order.id}</span>
        </p>
        <button className="text-amber-700 font-semibold">{expanded ? t("Hide", "إخفاء") : t("Details", "التفاصيل")}</button>
      </div>

      {expanded && (
        <div className="mt-3 border-t pt-3 space-y-4">
          {/* Timeline */}
          <div>
            <h3 className="font-semibold mb-2">{t("Order Status", "حالة الطلب")}</h3>
            <div className="flex justify-between items-center">
              {timelineStages.map((stage, index) => (
                <div
                  key={stage}
                  className={`flex-1 text-center text-sm ${
                    index <= stageIndex ? "text-green-600 font-semibold" : "text-gray-400"
                  }`}
                >
                  ●
                  <p className="capitalize">{t(stage.replace(/_/g, " "), stage.replace(/_/g, " "))}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Info */}
          <p>
            <strong>{t("Status", "الحالة")}:</strong> {order.status}
          </p>
          <p>
            <strong>{t("Total", "الإجمالي")}:</strong> {order.total.toFixed(2)} EGP
          </p>
          <p>
            <strong>{t("Customer", "العميل")}:</strong> {order.firstName} {order.lastName}
          </p>
          <p>
            <strong>{t("Address", "العنوان")}:</strong> {order.address}
          </p>

          {/* Items */}
          <h3 className="font-semibold mt-3">{t("Items", "المنتجات")}:</h3>
          <div className="mt-2 space-y-1">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm text-gray-700">
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

// -------------------------------
// Main User Dashboard
// -------------------------------
export default function UserDashboard() {
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const t = (en, ar) => (lang === "en" ? en : ar);

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
      return toast.error(t("First name, last name, and phone are required.", "الاسم الأول، الاسم الأخير، والهاتف مطلوب"));
    }
    try {
      await updateDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        phone,
        location: address,
      });
      toast.success(t("Profile updated!", "تم تحديث الملف الشخصي!"));
    } catch (err) {
      toast.error(t("Failed to update profile.", "فشل تحديث الملف الشخصي"));
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
      const q = query(collection(db, "promocodes"), where("usersUsed", "array-contains", user.uid));
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

  if (authLoading) return <p className="p-10 text-center text-gray-600">{t("Loading...", "جار التحميل...")}</p>;
  if (!user) return <p className="p-10 text-center text-gray-600">{t("Please sign in to access your dashboard.", "يرجى تسجيل الدخول للوصول إلى حسابك")}</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">{t("My Account", "حسابي")}</h1>
      
      <div className="w-full h-px bg-linear-to-r from-transparent via-[#D4AF37] to-transparent my-12" />

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
            {tab === "profile" ? t("Profile", "الملف الشخصي") : tab === "orders" ? t("Orders", "الطلبات") : t("Promos", "الرموز")}
          </button>
        ))}
      </div>

      {/* PROFILE */}
      {activeTab === "profile" && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t("Profile Information", "معلومات الملف الشخصي")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder={t("First Name", "الاسم الأول")} value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border rounded-lg p-3" />
            <input type="text" placeholder={t("Last Name", "الاسم الأخير")} value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full border rounded-lg p-3" />
            <input type="text" placeholder={t("Phone", "الهاتف")} value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-lg p-3" />
            <input type="text" placeholder={t("Address", "العنوان")} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border rounded-lg p-3" />
          </div>

          <button onClick={handleProfileUpdate} className="mt-5 bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 transition">
            {t("Save Changes", "حفظ التغييرات")}
          </button>
        </div>
      )}

      {/* ORDERS */}
      {activeTab === "orders" && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t("Order History", "تاريخ الطلبات")}</h2>
          {orders.length === 0 ? <p className="text-gray-600">{t("You have no orders yet.", "لا يوجد لديك طلبات بعد")}</p> : orders.map((order) => <OrderItem key={order.id} order={order} t={t} />)}
        </div>
      )}

      {/* PROMOS */}
      {activeTab === "promos" && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">{t("Used Promo Codes", "الرموز المستخدمة")}</h2>
          {promoCodes.length === 0 ? (
            <p className="text-gray-600">{t("No promo codes used yet.", "لا توجد رموز مستخدمة بعد")}</p>
          ) : (
            promoCodes.map((promo) => (
              <div key={promo.id} className="border p-4 rounded-lg mb-3 shadow-sm bg-gray-50">
                <p>
                  <strong>{t("Code", "الرمز")}:</strong> {promo.code}
                </p>
                <p>
                  <strong>{t("Discount", "الخصم")}:</strong> {promo.discountType === "percentage" ? `${promo.discountValue}%` : `${promo.discountValue} EGP`}
                </p>
                <p>
                  <strong>{t("Expires", "ينتهي في")}:</strong> {promo.expiresAt.toDate().toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
