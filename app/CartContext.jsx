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

  // --------------------------------------------------
  // ⭐ ADD TO CART (COLOR-AWARE)
  // --------------------------------------------------
  const addToCart = async (product) => {
    if (!product) return;

    const uniqueId = product.uniqueId;

    // must select color if colors exist
    if (product.colors?.length > 0 && !product.selectedColor) {
      toast.error("Please select a color first");
      return;
    }

    const existingIndex = cart.findIndex(
      (item) => item.uniqueId === uniqueId
    );

    let newCart;

    const colors = [...(product.colors || [])];

    // find color index
    let colorIndex = -1;

    if (product.selectedColor) {
      colorIndex = colors.findIndex(
        (c) => c.name === product.selectedColor.name
      );
    }

    // product WITH colors
    if (colorIndex !== -1) {
      const colorStock = Number(colors[colorIndex].stock || 0);

      if (colorStock <= 0) {
        toast.error("This color is out of stock");
        return;
      }

      if (existingIndex !== -1) {
        const cartItem = cart[existingIndex];

        if (cartItem.quantity >= colorStock) {
          toast.error("No more pieces available for this color");
          return;
        }

        newCart = [...cart];
        newCart[existingIndex].quantity += 1;
      } else {
        newCart = [...cart, { ...product, quantity: 1 }];
      }

      // decrease this color stock
      colors[colorIndex].stock = colorStock - 1;
    }

    // product WITHOUT colors
    else {
      if (product.stock <= 0) {
        toast.error("Out of stock");
        return;
      }

      if (existingIndex !== -1) {
        newCart = [...cart];
        newCart[existingIndex].quantity += 1;
      } else {
        newCart = [...cart, { ...product, quantity: 1 }];
      }
    }

    setCart(newCart);
    updateFirestore(newCart);

    // Recalculate total
    const totalStock = colors.length
      ? colors.reduce((sum, c) => sum + (Number(c.stock) || 0), 0)
      : (product.stock || 0) - 1;

    const productRef = doc(db, "scarves", product.id.toString());

    try {
      await updateDoc(productRef, {
        colors,
        stock: totalStock,
      });
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  // --------------------------------------------------
  // ⭐ REMOVE FROM CART (RESTORE STOCK)
  // --------------------------------------------------
  const removeFromCart = async (uniqueId) => {
    const item = cart.find((i) => i.uniqueId === uniqueId);
    if (!item) return;

    const productRef = doc(db, "scarves", item.id.toString());
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) return;

    const productData = productSnap.data();
    let colors = [...(productData.colors || [])];

    // restore per-color
    if (item.selectedColor) {
      const index = colors.findIndex(
        (c) => c.name === item.selectedColor.name
      );
      if (index !== -1) {
        colors[index].stock =
          Number(colors[index].stock || 0) + item.quantity;
      }
    }

    const totalStock = colors.length
      ? colors.reduce((sum, c) => sum + (Number(c.stock) || 0), 0)
      : (productData.stock || 0) + item.quantity;

    try {
      await updateDoc(productRef, {
        colors,
        stock: totalStock,
      });
    } catch (err) {
      console.error("Error restoring stock:", err);
    }

    const newCart = cart.filter((i) => i.uniqueId !== uniqueId);
    setCart(newCart);
    updateFirestore(newCart);
  };

  // --------------------------------------------------
  // ⭐ UPDATE QUANTITY
  // --------------------------------------------------
  const updateQuantity = async (uniqueId, newQuantity) => {
    const item = cart.find((i) => i.uniqueId === uniqueId);
    if (!item) return;

    if (newQuantity < 1) return removeFromCart(uniqueId);

    const productRef = doc(db, "scarves", item.id.toString());
    const snap = await getDoc(productRef);
    if (!snap.exists()) return;

    const data = snap.data();
    let colors = [...(data.colors || [])];

    let colorIndex = -1;
    if (item.selectedColor) {
      colorIndex = colors.findIndex(
        (c) => c.name === item.selectedColor.name
      );
    }

    let change = newQuantity - item.quantity;

    // with color stock
    if (colorIndex !== -1) {
      const colorStock = Number(colors[colorIndex].stock || 0);

      if (change > 0 && colorStock < change) {
        toast.error("Not enough stock for this color");
        return;
      }

      colors[colorIndex].stock = colorStock - change;
    }

    const totalStock = colors.length
      ? colors.reduce((sum, c) => sum + (Number(c.stock) || 0), 0)
      : (data.stock || 0) - change;

    try {
      await updateDoc(productRef, {
        colors,
        stock: totalStock,
      });
    } catch (err) {
      console.error("Error updating stock:", err);
    }

    const updatedCart = cart.map((i) =>
      i.uniqueId === uniqueId ? { ...i, quantity: newQuantity } : i
    );

    setCart(updatedCart);
    updateFirestore(updatedCart);
  };

  const clearCart = async () => {
    for (const item of cart) {
      await removeFromCart(item.uniqueId);
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
