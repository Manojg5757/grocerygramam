const admin = require("firebase-admin");
const db = require("./firebase");

const banners = [
  {
    id: "1",
    uri_ta:
      "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2FhomebannerTamil.png?alt=media&token=52cebd0e-6f6c-4d9e-95f8-41cce4f85b7d",
    uri_en:
      "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fcateringbannerone.png?alt=media&token=5a377d40-6f85-4a24-90be-d4c12c17ff4f",
    screen: "Catering",
  },
  {
    id: "2",
    uri: "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fhomebanner.png?alt=media&token=21bd03a9-f4cc-43fc-aab3-443230f71430",
    screen: "Inspiration",
  },
  {
    id: "3",
    uri: "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fkrpumps.png?alt=media&token=da3ba6e8-e806-4844-8441-c02a420ab5c5",
    screen: "CustomScreen",
    title: "KR Pumps & Motors",
    offer: "20% off on all 1HP motors",
    desc: "Specialized in agricultural and borewell pump sets, electric motors, and professional repair services. Trusted by farmers and industries since 1990 in Coimbatore.",
    contact: "9688265022",
    location: "Coimbatore",
    buttonlabel: "Call Now",
    actionType: "call",
    actionValue: "+919688265022",
    offerValidTill: "31 July 2025",
    services: [
      "Agricultural Pumps",
      "Borewell Pumps",
      "Motor Repairs",
      "On-site Service",
    ],
    tags: ["Pumps", "Motors", "Agricultural Equipment", "Borewell"],
    openHours: "9 AM to 7 PM",
    closedOn: "Sunday",
  },
];

const bulkUploadBanners = async (banners) => {
  const batch = db.batch();
  const collectionRef = db.collection("homeBannerSlider");

  try {
    banners.forEach((item) => {
      const docRef = collectionRef.doc(item.id);
      batch.set(docRef, item);
    });

    await batch.commit();

    console.log("🔥 Banner bulk upload successful!");
  } catch (error) {
    console.error("❌ Error uploading banners:", error);
  }
};

bulkUploadBanners(banners);
