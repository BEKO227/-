"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch user info from Firestore
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              firstName: userData.firstName,
              lastName: userData.lastName,
              age: userData.age,
              phone: userData.phone,
              gender: userData.gender,
              location: userData.location,
              avgSpent: userData.avgSpent,
              productsBoughtCount: userData.productsBoughtCount,
            });
          } else {
            // fallback if Firestore doc doesn't exist
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              firstName: currentUser.displayName || currentUser.email.split("@")[0],
              lastName: "",
            });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out successfully");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
