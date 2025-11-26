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

  // Load user's cart from Firestore
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
          setCart([]);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  // Update Firestore cart
  const updateFirestore = async (newCart) => {
    if (!user) return;
    try {
      const cartRef = doc(db, "carts", user.uid);
      await setDoc(cartRef, { items: newCart });
    } catch (err) {
      console.error("Error updating cart in Firestore:", err);
    }
  };

  // Add to cart
  const addToCart = async (product) => {
    if (!product || product.stock <= 0) return;

    const existingIndex = cart.findIndex((item) => item.id === product.id);
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

    // Decrease stock in Firestore
    const productRef = doc(db, "scarves", product.id.toString());
    try {
      await updateDoc(productRef, {
        stock: product.stock - 1,
      });
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  // Remove from cart
  const removeFromCart = async (id) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    const newCart = cart.filter((i) => i.id !== id);
    setCart(newCart);
    updateFirestore(newCart);

    // Restore stock in Firestore
    const productRef = doc(db, "scarves", id.toString());
    try {
      await updateDoc(productRef, {
        stock: item.stock + item.quantity,
      });
    } catch (err) {
      console.error("Error restoring stock:", err);
    }
  };

  // Update quantity
  const updateQuantity = async (id, newQuantity) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
  
    // Load REAL stock from Firestore
    const productRef = doc(db, "scarves", id.toString());
    const productSnap = await getDoc(productRef);
  
    if (!productSnap.exists()) return;
    const realStock = productSnap.data().stock;
  
    const currentQty = item.quantity;
    const change = newQuantity - currentQty; // +1, -1, etc.
  
    // Check stock
    if (change > 0 && realStock < change) {
      toast.error("Not enough stock available!");
      return;
    }
  
    // Update cart locally
    const updatedCart = cart.map((i) =>
      i.id === id ? { ...i, quantity: newQuantity } : i
    );
    setCart(updatedCart);
    updateFirestore(updatedCart);
  
    // Update Firestore stock
    try {
      await updateDoc(productRef, {
        stock: realStock - change, // safe and correct stock update
      });
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };
  
  const clearCart = async () => {
    // Restore stock for all items
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
