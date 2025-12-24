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
import { useLanguage } from "@/app/LanguageContext";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { lang } = useLanguage();
  const t = (en, ar) => (lang === "en" ? en : ar);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
  const [placingOrder, setPlacingOrder] = useState(false);

  const [isFirstOrder, setIsFirstOrder] = useState(false);

  const governments = [
    "Cairo","Alexandria","Giza","Qalyubia","Dakahlia","Sharqia",
    "Gharbia","Beheira","Fayoum","Menoufia","Minya","Asyut",
    "Sohag","Qena","Luxor","Aswan","Red Sea","New Valley",
    "Beni Suef","Ismailia","Suez","Port Said","Damietta",
    "North Sinai","South Sinai","Matrouh",
  ];

  // Prefill user data
  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFirstName(data.firstName || "");
            setLastName(data.lastName || "");
            setPhone(data.phone || "");
            if (data.location) {
              const parts = data.location.split(" - ");
              setBuilding(parts[0] || "");
              setStreet(parts[1] || "");
              setCity(parts[2] || "");
              setGovernment(parts[3] || "");
            }
          }
        } catch (err) {
          console.error(t("Failed to fetch user:", "فشل في جلب بيانات المستخدم"), err);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const saveAddressToUser = async () => {
    if (!user) return;
    try {
      const location = `${building} - ${street} - ${city} - ${government}`;
      await updateDoc(doc(db, "users", user.uid), { location });
    } catch (err) {
      console.error(t("Update location failed:", "فشل تحديث العنوان"), err);
    }
  };

  // Free delivery threshold
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "Sale", "freeDelivery"), (snap) => {
      if (snap.exists()) setFreeDeliveryThreshold(snap.data().Price || 0);
    });
    return () => unsub();
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const qualifiesForFreeDelivery = cartTotal >= freeDeliveryThreshold;

  // Delivery fee
  useEffect(() => {
    const fetchDeliveryFee = async () => {
      if (!government) return;
      try {
        const feeRef = doc(db, "deliveryFees", government);
        const feeSnap = await getDoc(feeRef);
        setDeliveryFee(feeSnap.exists() ? feeSnap.data().fee || 0 : 60);
      } catch (err) {
        console.error(t("Error loading delivery fee:", "خطأ في تحميل رسوم التوصيل"), err);
      }
    };
    fetchDeliveryFee();
  }, [government]);

  const finalDeliveryFee = qualifiesForFreeDelivery ? 0 : deliveryFee;
  const total = Math.max(cartTotal - discount + finalDeliveryFee, 0);

  // Protected route
  useEffect(() => {
    if (!authLoading && !placingOrder && !user) router.push("/auth/signin");
  }, [user, authLoading, placingOrder, router]);

  // Check if first order
  useEffect(() => {
    if (!user) return;
    const checkFirstOrder = async () => {
      const q = query(collection(db, "orders"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      setIsFirstOrder(snap.empty); // true if no previous orders
    };
    checkFirstOrder();
  }, [user]);

  const userHasPreviousOrders = async () => {
    const q = query(collection(db, "orders"), where("userId", "==", user.uid));
    const snap = await getDocs(q);
    return !snap.empty;
  };

  // Handle Apply Promo
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return toast.error(t("Enter promo code", "أدخل رمز الخصم"));
    const code = promoCode.toUpperCase();

    try {
      // Special case: first order SAVE10
      if (code === "SAVE10") {
        if (!isFirstOrder) return toast.error(t("Promo valid for first order only", "الرمز صالح للطلب الأول فقط"));
        const discountValue = Math.min(cartTotal * 0.1, 100); // 10% discount, max 100 EGP
        setDiscount(discountValue);
        setPromoApplied(true);
        return toast.success(t(`Saved ${discountValue.toFixed(2)} EGP`, `تم حفظ ${discountValue.toFixed(2)} جنيه`));
      }

      // Regular promo code from Firestore
      const promoRef = doc(db, "promocodes", code);
      const promoSnap = await getDoc(promoRef);
      if (!promoSnap.exists()) return toast.error(t("Invalid promo code", "رمز خصم غير صالح"));

      const promo = promoSnap.data();
      const now = new Date();
      if (!promo.active) return toast.error(t("Promo disabled", "الرمز معطل"));
      if (promo.expiresAt.toDate() < now) return toast.error(t("Expired promo", "الرمز منتهي"));
      if (promo.firstOrderOnly && (await userHasPreviousOrders())) return toast.error(t("First order only", "للطلب الأول فقط"));
      if (promo.usedCount >= promo.usageLimit) return toast.error(t("Promo usage limit reached", "تم استنفاد حد استخدام الرمز"));

      let newDiscount = promo.discountType === "percentage" ? (cartTotal * promo.discountValue) / 100 : promo.discountValue;
      newDiscount = Math.min(newDiscount, promo.maxDiscount);

      setDiscount(newDiscount);
      setPromoApplied(true);
      await updateDoc(promoRef, { usedCount: promo.usedCount + 1 });
      toast.success(t(`Saved ${newDiscount.toFixed(2)} EGP`, `تم حفظ ${newDiscount.toFixed(2)} جنيه`));
    } catch {
      toast.error(t("Failed to apply promo", "فشل تطبيق الرمز"));
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setDiscount(0);
    setPromoApplied(false);
  };

  // Place order
  const handleOrder = async () => {
    if (!firstName || !lastName || !phone || !building || !street || !city || !government)
      return toast.error(t("Fill all required fields.", "يرجى ملء جميع الحقول المطلوبة"));
    if (paymentMethod === "InstaPay" && !instaRef)
      return toast.error(t("Enter InstaPay reference number.", "أدخل رقم المرجع الخاص بـ InstaPay"));

    setPlacingOrder(true);
    setLoading(true);

    try {
      const orderData = {
        userId: user.uid,
        items: cart,
        subtotal: cartTotal,
        discount,
        deliveryFee: finalDeliveryFee,
        total,
        paymentMethod,
        referenceNumber: paymentMethod === "InstaPay" ? instaRef : null,
        status: paymentMethod === "COD" ? "pending" : "waiting_for_payment",
        firstName,
        lastName,
        phone,
        address: `${building} - ${street} - ${city} - ${government}`,
        promoCode: promoApplied ? promoCode.toUpperCase() : null,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      await saveAddressToUser();
      router.replace(`/checkout/confirmation/${docRef.id}`);
      clearCart();
    } catch (err) {
      console.error(err);
      toast.error(t("Order failed", "فشل الطلب"));
    }

    setLoading(false);
    setPlacingOrder(false);
  };

  // Render
  if (authLoading || !user || cart.length === 0)
    return <div className="p-10 text-center text-amber-700 text-xl">{t("Loading...", "جار التحميل...")}</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      <button
        onClick={() => router.back()}
        className="
          flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-amber-700
          border border-amber-700 hover:bg-amber-50 transition-all duration-200
          shadow-sm
        "
      >
        ← {t("Back", "رجوع")}
      </button>

      <h1 className="text-3xl font-bold mb-6">{t("Checkout", "إتمام الطلب")}</h1>

      {/* Customer Info */}
      <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">{t("Customer Information", "معلومات العميل")}</h2>
        <div className="flex gap-4">
          <input type="text" placeholder={t("First Name *", "الاسم الأول *")} value={firstName} onChange={(e) => setFirstName(e.target.value)} className="flex-1 border rounded-lg p-3"/>
          <input type="text" placeholder={t("Last Name *", "الاسم الأخير *")} value={lastName} onChange={(e) => setLastName(e.target.value)} className="flex-1 border rounded-lg p-3"/>
        </div>
        <input type="text" placeholder={t("Phone Number *", "رقم الهاتف *")} value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded-lg p-3"/>
      </div>

      {/* Address */}
      <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">{t("Delivery Address", "عنوان التوصيل")}</h2>
        <input type="text" placeholder={t("Building Name / Number *", "اسم / رقم المبنى *")} value={building} onChange={(e) => setBuilding(e.target.value)} className="w-full border rounded-lg p-3"/>
        <input type="text" placeholder={t("Street Name *", "اسم الشارع *")} value={street} onChange={(e) => setStreet(e.target.value)} className="w-full border rounded-lg p-3"/>
        <input type="text" placeholder={t("City *", "المدينة *")} value={city} onChange={(e) => setCity(e.target.value)} className="w-full border rounded-lg p-3"/>
        <select value={government} onChange={(e) => setGovernment(e.target.value)} className="w-full border rounded-lg p-3">
          <option value="">{t("Select Government *", "اختر المحافظة *")}</option>
          {governments.map((gov) => <option key={gov} value={gov}>{gov}</option>)}
        </select>
      </div>

      {/* Order Summary */}
      <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">{t("Order Summary", "ملخص الطلب")}</h2>

        {/* Cart items */}
        <div className="space-y-2">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 rounded-lg hover:shadow-lg transition-transform transform hover:scale-105">
              <div className="flex items-center gap-4">
                {item.image && (
                  <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg"/>
                )}
                <span className="font-medium">{item.title} × {item.quantity}</span>
              </div>
              <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} EGP</span>
            </div>
          ))}
        </div>

        {/* Promo code */}
        <div className="flex gap-2 mt-4 items-center">
          <input
            type="text"
            placeholder={t("Promo code", "رمز الخصم")}
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="border p-3 rounded-lg flex-1 focus:ring-2 focus:ring-amber-500 transition-all"
            disabled={promoApplied}
          />
          {!promoApplied ? (
            <button
              onClick={handleApplyPromo}
              className="bg-linear-to-r from-amber-700 to-amber-900 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {t("Apply", "تطبيق")}
            </button>
          ) : (
            <button
              onClick={handleRemovePromo}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
            >
              {t("Remove", "إزالة")}
            </button>
          )}
        </div>

        {isFirstOrder && !promoApplied && (
          <p className="text-blue-700 text-sm mt-1">
            {t("First-time buyer? Use code SAVE10 to get 10% off (max 100 EGP)!", "هل هذا طلبك الأول؟ استخدم الرمز SAVE10 للحصول على خصم 10٪ (بحد أقصى 100 جنيه)!")}
          </p>
        )}

        {promoApplied && (
          <p className="text-green-700 font-medium mt-1">
            {t("Discount", "الخصم")}: {discount.toFixed(2)} EGP
          </p>
        )}

        {/* Totals */}
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 space-y-2">
          <div className="flex justify-between">
            <span>{t("Subtotal", "المجموع الفرعي")}:</span>
            <span>{cartTotal.toFixed(2)} EGP</span>
          </div>
          {promoApplied && (
            <div className="flex justify-between text-green-700">
              <span>{t("Discount", "الخصم")}:</span>
              <span>-{discount.toFixed(2)} EGP</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>{t("Delivery Fee", "رسوم التوصيل")}:</span>
            <span>{finalDeliveryFee.toFixed(2)} EGP {qualifiesForFreeDelivery && `(${t("Free Delivery!", "توصيل مجاني!")})`}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>{t("Total", "الإجمالي")}:</span>
            <span>{total.toFixed(2)} EGP</span>
          </div>
        </div>
      </div>

      {/* PAYMENT */}
      <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold">{t("Payment Method", "طريقة الدفع")}</h2>

        <div className="flex flex-col md:flex-row gap-4">
          <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:shadow-md transition">
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
              className="accent-amber-700"
            />
            {t("Cash on Delivery", "الدفع عند الاستلام")}
          </label>
          <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:shadow-md transition">
            <input
              type="radio"
              name="payment"
              value="InstaPay"
              checked={paymentMethod === "InstaPay"}
              onChange={() => setPaymentMethod("InstaPay")}
              className="accent-amber-700"
            />
            InstaPay
          </label>
        </div>

        {paymentMethod === "InstaPay" && (
          <div className="mt-4 p-4 bg-yellow-50 border rounded-xl space-y-3 relative">
            <p className="font-medium">
              {t("Please pay to:", "يرجى الدفع إلى:")} <br />
              Phone: +20 102 715 7089 <br />
              Bank Account: 123-456-789-1011
            </p>
            <input
              type="text"
              placeholder={t("Enter InstaPay Reference Number", "أدخل رقم المرجع الخاص بـ InstaPay")}
              value={instaRef}
              onChange={(e) => setInstaRef(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleOrder}
        disabled={loading}
        className="w-full bg-amber-700 hover:bg-amber-800 text-white py-4 rounded-xl font-bold text-lg transition mt-4"
      >
        {t(loading ? "Placing Order..." : "Place Order", loading ? "جارٍ إتمام الطلب..." : "إتمام الطلب")}
      </button>
    </div>
  );
}
