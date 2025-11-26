// scripts/uploadScarves.js
import { db } from "../lib/firebase.js";
import { collection, doc, setDoc } from "firebase/firestore";
import { allScarfs } from "../data/products.js";

async function uploadScarves() {
  const scarvesCollection = collection(db, "scarves");

  for (const scarf of allScarfs) {
    try {
      const docRef = doc(scarvesCollection, scarf.id.toString()); // use id as doc ID
      await setDoc(docRef, scarf);
      console.log(`✅ Uploaded: ${scarf.title} (ID: ${scarf.id})`);
    } catch (err) {
      console.error(`❌ Failed to upload: ${scarf.title} (ID: ${scarf.id})`, err);
    }
  }

  console.log("🎉 All scarves uploaded!");
}

uploadScarves();
