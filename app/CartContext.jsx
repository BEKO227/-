"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const cartRef = doc(db, "carts", user.uid);
        const cartSnap = await getDoc(cartRef);

        if (cartSnap.exists()) {
          setCart(cartSnap.data().items || []);
        } else {
          await setDoc(cartRef, { items: [] });
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const updateFirestore = async (newCart) => {
    if (!user) return;
    try {
      const cartRef = doc(db, "carts", user.uid);
      await setDoc(cartRef, { items: newCart });
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  // ⭐ ADD TO CART (supports color)
  const addToCart = async (product) => {
    if (!product || product.stock <= 0) return;

    const uniqueId = product.uniqueId; // productId-colorName or productId

    const existingIndex = cart.findIndex(
      (item) => item.uniqueId === uniqueId
    );

    let newCart;

    if (existingIndex !== -1) {
      const item = cart[existingIndex];

      if (item.quantity >= product.stock) {
        toast.error("Out of stock!");
        return;
      }

      newCart = [...cart];
      newCart[existingIndex].quantity += 1;
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(newCart);
    updateFirestore(newCart);

    const productRef = doc(db, "scarves", product.id.toString());
    try {
      await updateDoc(productRef, {
        stock: product.stock - 1,
      });
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  // ⭐ REMOVE ITEM (by uniqueId)
  const removeFromCart = async (uniqueId) => {
    const item = cart.find((i) => i.uniqueId === uniqueId);
    if (!item) return;

    const newCart = cart.filter((i) => i.uniqueId !== uniqueId);

    setCart(newCart);
    updateFirestore(newCart);

    const productRef = doc(db, "scarves", item.id.toString());
    try {
      await updateDoc(productRef, {
        stock: item.stock + item.quantity,
      });
    } catch (err) {
      console.error("Error restoring stock:", err);
    }
  };

  // ⭐ UPDATE QUANTITY (by uniqueId)
  const updateQuantity = async (uniqueId, newQuantity) => {
    const item = cart.find((i) => i.uniqueId === uniqueId);
    if (!item) return;

    const productRef = doc(db, "scarves", item.id.toString());
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) return;

    const realStock = productSnap.data().stock;
    const change = newQuantity - item.quantity;

    if (change > 0 && realStock < change) {
      toast.error("Not enough stock available!");
      return;
    }

    const updatedCart = cart.map((i) =>
      i.uniqueId === uniqueId ? { ...i, quantity: newQuantity } : i
    );

    setCart(updatedCart);
    updateFirestore(updatedCart);

    try {
      await updateDoc(productRef, {
        stock: realStock - change,
      });
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  const clearCart = async () => {
    for (const item of cart) {
      const productRef = doc(db, "scarves", item.id.toString());

      try {
        await updateDoc(productRef, {
          stock: item.stock + item.quantity,
        });
      } catch (err) {
        console.error("Error restoring stock:", err);
      }
    }

    setCart([]);
    updateFirestore([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
