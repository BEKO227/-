"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "../../../../AuthContext";
import { useLanguage } from '@/app/LanguageContext';

export default function ConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const t = (en, ar) => (lang === "en" ? en : ar);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect to signin if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/signin");
    }
  }, [user, authLoading, router]);

  // Fetch order
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
            toast.error(t("You are not authorized to view this order.", "ليس لديك إذن لعرض هذا الطلب"));
            router.push("/");
            return;
          }

          setOrder(orderData);
        } else {
          toast.error(t("Order not found", "الطلب غير موجود"));
          setOrder(null);
        }
      } catch (err) {
        console.error("Fetch order error:", err);
        toast.error(t("Failed to fetch order", "فشل في جلب الطلب"));
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    if (id && user) fetchOrder();
  }, [id, user, router, t]);

  if (authLoading || loading)
    return <div className="p-10 text-center">{t("Loading...", "جار التحميل...")}</div>;
  if (!order)
    return <div className="p-10 text-center text-red-600">{t("Order not found", "الطلب غير موجود")}</div>;

  // Safe display of full name
  const fullName = `${order.firstName || ""} ${order.lastName || ""}`.trim() || t("Customer", "العميل");

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-amber-700 mb-6">✅ {t("Order Confirmation", "تأكيد الطلب")}</h1>
      <p className="text-lg mb-2">
        {t("Thank you for your purchase,", "شكراً لشرائك،")} {fullName}!
      </p>
      <p className="mb-4">
        {t("Order ID:", "رقم الطلب:")} <span className="font-semibold">{order.id}</span>
      </p>

      {/* Order Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {order.items?.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg shadow-sm">
            <Image src={item.imageCover} alt={item.title} width={80} height={80} className="rounded-lg" />
            <div>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <p>{t("Quantity:", "الكمية:")} {item.quantity}</p>
              <p>{t("Price:", "السعر:")} {(item.price * item.quantity).toFixed(2)} EGP</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="text-lg font-semibold mb-6">
        <p>{t("Subtotal:", "المجموع الفرعي:")} {order.subtotal.toFixed(2)} EGP</p>
        {order.discount > 0 && <p>{t("Discount:", "الخصم:")} {order.discount.toFixed(2)} EGP</p>}
        <p>{t("Delivery Fee:", "رسوم التوصيل:")} {order.deliveryFee.toFixed(2)} EGP</p>
        <p>{t("Total:", "الإجمالي:")} {order.total.toFixed(2)} EGP</p>
        <p>{t("Payment Method:", "طريقة الدفع:")} {order.paymentMethod}</p>
        {order.paymentMethod === "InstaPay" && (
          <p>{t("Reference Number:", "رقم المرجع:")} {order.referenceNumber}</p>
        )}
      </div>

      <button
        onClick={() => router.push("/")}
        className="mt-4 px-6 py-3 bg-amber-700 text-white rounded-full hover:bg-amber-800"
      >
        {t("Continue Shopping", "مواصلة التسوق")}
      </button>
    </div>
  );
}
