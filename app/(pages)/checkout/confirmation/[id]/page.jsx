"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuth } from "../../../../AuthContext";
import { useLanguage } from "@/app/LanguageContext";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const t = (en, ar) => (lang === "en" ? en : ar);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- AUTH GUARD ---------------- */
  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/auth/signin");
  }, [user, authLoading, router]);

  /* ---------------- FETCH ORDER ---------------- */
  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !id) return;

      try {
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          toast.error(t("Order not found", "Order not found"));
          return;
        }

        const orderData = { id: docSnap.id, ...docSnap.data() };

        if (orderData.userId !== user.uid) {
          toast.error(
            t(
              "You are not authorized to view this order.",
              "Not authorized"
            )
          );
          router.replace("/");
          return;
        }

        setOrder(orderData);
      } catch (err) {
        console.error(err);
        toast.error(t("Failed to fetch order", "Failed to fetch order"));
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, router, t]);

  /* ---------------- PDF EXPORT ---------------- */
  const handleDownloadPDF = async () => {
    const element = document.getElementById("order-pdf");
    if (!element) return;
  
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        // This is the "Scrubber": it runs on a hidden copy of your page
        onclone: (clonedDoc) => {
          const items = clonedDoc.querySelectorAll("*");
          items.forEach((el) => {
            const style = window.getComputedStyle(el);
            // If any element has a 'lab' color, force it to a safe hex/rgb
            if (style.color.includes("lab") || style.backgroundColor.includes("lab")) {
              el.style.color = "#111827"; // Force dark gray
              el.style.backgroundColor = "transparent"; 
            }
            
            // Fix for Tailwind's modern ring/shadow colors which often use lab/oklch
            el.style.boxShadow = "none";
            el.style.borderColor = "#e5e7eb"; 
          });
        },
      });
  
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`order-${order.id}.pdf`);
      toast.success(t("PDF downloaded!", "تم تحميل الملف"));
  
    } catch (error) {
      console.error("Critical PDF Error:", error);
      // If it STILL fails, it's a Turbopack compiler issue with the library itself
      toast.error("Build error: Turbopack is blocking CSS parsing.");
    }
  };
  
  if (authLoading || loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!order) {
    return (
      <div className="p-10 text-center text-red-600">
        Order not found
      </div>
    );
  }

  const fullName =
    `${order.firstName || ""} ${order.lastName || ""}`.trim() ||
    "Customer";

  return (
    <>
      {/* -------- PDF CONTENT -------- */}
      <div
        id="order-pdf"
        className="max-w-4xl mx-auto px-6 py-10 space-y-6 bg-white"
        style={{ backgroundColor: "#ffffff" }} // Inline hex for extra safety
      >
        <h1 className="text-3xl font-bold text-[#b45309]"> {/* Replaced amber-700 hex */}
          Order Confirmation
        </h1>

        <p className="text-[#1f2937]">
          Thank you for your purchase,{" "}
          <span className="font-semibold">{fullName}</span>
        </p>

        <p className="text-[#1f2937]">
          Order ID: <span className="font-semibold">{order.id}</span>
        </p>

        {/* ITEMS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {order.items?.map((item, index) => {
            const selectedColorName =
              typeof item.selectedColor === "string"
                ? item.selectedColor
                : item.selectedColor?.name;

            const selectedColorObj =
              item.colors?.find(
                (c) =>
                  c.name.toLowerCase() ===
                  selectedColorName?.toLowerCase()
              ) || item.selectedColor;

            return (
              <div
                key={`${item.id}-${selectedColorObj?.name || index}`}
                className="flex gap-4 p-4 border border-[#e5e7eb] rounded-xl"
              >
                <div className="relative w-[90px] h-[90px]">
                  <Image
                    src={
                      selectedColorObj?.image ||
                      item.images?.[0] ||
                      "/placeholder.png"
                    }
                    alt={item.title}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="font-bold text-[#111827]">{item.title}</h2>

                  {selectedColorObj?.name && (
                    <div className="flex items-center gap-2 text-sm text-[#4b5563]">
                      <span>Color:</span>
                      <span className="capitalize">
                        {selectedColorObj.name}
                      </span>
                      {selectedColorObj.hex && (
                        <span
                          className="w-4 h-4 rounded-full border border-[#d1d5db]"
                          style={{
                            // Ensure we only use hex here
                            backgroundColor: selectedColorObj.hex.startsWith('#') 
                               ? selectedColorObj.hex 
                               : '#cccccc', 
                          }}
                        />
                      )}
                    </div>
                  )}

                  <p className="text-[#4b5563]">Quantity: {item.quantity}</p>
                  <p className="text-[#111827] font-medium">
                    Price:{" "}
                    {(item.price * item.quantity).toFixed(2)} EGP
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* SUMMARY */}
        <div className="p-6 bg-[#f9fafb] rounded-xl space-y-2 border border-[#f3f4f6]">
          <p className="flex justify-between text-[#374151]">
            <span>Subtotal</span>
            <span>{order.subtotal.toFixed(2)} EGP</span>
          </p>

          <p className="flex justify-between text-[#374151]">
            <span>Delivery</span>
            <span>{order.deliveryFee.toFixed(2)} EGP</span>
          </p>

          <p className="flex justify-between font-bold text-[#111827] pt-2 border-t border-[#e5e7eb]">
            <span>Total</span>
            <span>{order.total.toFixed(2)} EGP</span>
          </p>
        </div>
      </div>

      {/* -------- ACTION BUTTONS (IGNORED BY PDF) -------- */}
      <div
        className="max-w-4xl mx-auto px-6 pb-10 flex flex-col md:flex-row gap-3 mt-8"
        data-html2canvas-ignore="true"
      >
        <button
          onClick={handleDownloadPDF}
          className="py-2 px-6 rounded-full text-sm font-semibold text-white bg-[#1f2937] hover:bg-[#111827] transition-colors"
        >
          Download PDF
        </button>

        <button
          onClick={() => router.push("/")}
          className="py-2 px-6 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#78350f] to-[#451a03] hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </button>
      </div>
    </>
  );
}