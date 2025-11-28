// Load Firebase Admin SDK
const admin = require("firebase-admin");
const serviceAccount = require("E:/work/Scarfs/amar/qamar-scarves-firebase-adminsdk-fbsvc-9575e856f3.json"); // <-- replace with your path

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Delivery fees data
const deliveryFees = {
  "Cairo": 60,
  "Giza": 60,
  "Atf": 65,
  "New Cities": 70,
  "Qalyubia": 85,
  "Gharbia": 85,
  "Monufia": 85,
  "Alexandria": 85,
  "Dakahlia": 85,
  "Beheira": 85,
  "Sharqia": 85,
  "Ismailia": 85,
  "Damietta": 85,
  "Port Said": 85,
  "Suez": 85,
  "Kafr El-Sheikh": 85,
  "Fayoum": 95,
  "Beni Suef": 95,
  "Minya": 95,
  "Assiut": 95,
  "Sohag": 95,
  "Qena": 95,
  "Luxor": 95,
  "Aswan": 95,
  "North Coast": 130,
  "Red Sea": 130,
  "Marsa Matrouh": 130,
  "El-Ghardaqa": 130,
  "New Valley": 130,
  "Sharm El-Sheikh": 130
};

// Upload function
async function uploadFees() {
  try {
    const batch = db.batch();

    for (const [gov, fee] of Object.entries(deliveryFees)) {
      const docRef = db.collection("deliveryFees").doc(gov);
      batch.set(docRef, { fee });
    }

    await batch.commit();
    console.log("All delivery fees uploaded successfully!");
  } catch (error) {
    console.error("Error uploading delivery fees:", error);
  }
}

// Run the upload
uploadFees();
