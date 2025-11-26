"use client";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function useFreeDelivery() {
  const [threshold, setThreshold] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "Sale", "freeDelivery"),
      (snap) => {
        if (snap.exists()) {
          setThreshold(snap.data().Price || 0);
        } else {
          setThreshold(0);
        }
      }
    );

    return () => unsub();
  }, []);

  return threshold;
}
