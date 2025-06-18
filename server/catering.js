// server/catering.js
const admin = require("firebase-admin");
const db = require("./firebase");

const catering = [
  {
    id: 1,
    itemName: "Meals",
    itemNameTamil: "முழு சாப்பாடு",
    minOrder: 20,
    type: "meal",
    icon: "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fmeals.png?alt=media&token=cec4bc79-9ce1-47c0-86e1-4dcf7c21dce6",
    price: 80,
    description: "Traditional South Indian meal with rice, sambar, rasam, etc.",
    descriptionTamil: "பாரம்பரிய தென்னிந்திய உணவு சாதம், சாம்பார், ரசம் போன்றவை",
    menu: [
      "Rice", "Sambar", "Rasam", "Poriyal", "Kootu", "Appalam", "Pickle", "Buttermilk"
    ],
    menuTamil: [
      "சாதம்", "சாம்பார்", "ரசம்", "பொரியல்", "கூட்டு", "அப்பளம்", "ஊறுகாய்", "மோர்"
    ],
    availableFor: ["lunch", "dinner"],
    preparationTime: "2 hours",
    dietaryInfo: ["vegetarian"],
    serves: "1 person",
    packaging: "Eco-friendly packaging"
  },
  {
    id: 2,
    itemName: "Tiffen",
    itemNameTamil: "டிப்பன்",
    minOrder: 20,
    type: "tiffen",
    icon: "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Ftiffen.png?alt=media&token=7f529ed4-d9d5-461f-a340-d46d8769049e",
    price: 120,
    description: "South Indian breakfast combo with idli, vada, pongal and more",
    descriptionTamil: "தென்னிந்திய காலை உணவு - இட்லி, வடை, பொங்கல் மற்றும் பலவற்றுடன்",
    menu: [
      "Idli (2)", "Vada (1)", "Pongal", "Sambar", "Chutney"
    ],
    menuTamil: [
      "இட்லி (2)", "வடை (1)", "பொங்கல்", "சாம்பார்", "சட்னி"
    ],
    availableFor: ["breakfast"],
    preparationTime: "1 hour",
    dietaryInfo: ["vegetarian"],
    serves: "1 person",
    packaging: "Eco-friendly packaging"
  },
  {
    id: 3,
    itemName: "Ulundha Vadai",
    itemNameTamil: "உளுந்த வடை",
    minOrder: 25,
    type: "piece",
    icon: "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Ftiffen.png?alt=media&token=7f529ed4-d9d5-461f-a340-d46d8769049e",
    price: 8,
    description: "Crispy South Indian lentil fritters made with urad dal",
    descriptionTamil: "உளுந்து மாவினால் செய்யப்படும் கிரிஸ்பியான வடை",
    ingredients: ["Urad Dal", "Onions", "Green Chilies", "Curry Leaves"],
    ingredientsTamil: ["உளுந்து", "வெங்காயம்", "பச்சை மிளகாய்", "கறிவேப்பிலை"],
    dietaryInfo: ["vegetarian"],
    servingTemp: "Best served hot",
    accompaniments: "Sambar and chutney available on request"
  },
  {
    id: 4,
    itemName: "Paruppu Vadai",
    itemNameTamil: "பருப்பு வடை",
    minOrder: 25,
    type: "piece",
    icon: "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fparuppuvadai.png?alt=media&token=112e85a9-c92d-41d4-8c1b-57cddbb9e3ee",
    price: 8,
    description: "Crispy lentil fritters made with chana dal",
    descriptionTamil: "கடலை பருப்பினால் செய்யப்படும் கிரிஸ்பியான வடை",
    ingredients: ["Chana Dal", "Onions", "Green Chilies", "Ginger"],
    ingredientsTamil: ["கடலை பருப்பு", "வெங்காயம்", "பச்சை மிளகாய்", "இஞ்சி"],
    dietaryInfo: ["vegetarian"],
    servingTemp: "Best served hot",
    accompaniments: "Sambar and chutney available on request"
  },
  {
    id: 5,
    itemName: "Parotta",
    itemNameTamil: "பரோட்டா",
    minOrder: 10,
    type: "piece",
    icon: "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fparotta.png?alt=media&token=f08bfa66-d9eb-482c-96c9-5f35e4d070de",
    price: 12,
    description: "Flaky, layered flatbread made with refined flour",
    descriptionTamil: "மைதா மாவினால் செய்யப்படும் லேயர் ரொட்டி",
    ingredients: ["Maida", "Oil", "Salt"],
    ingredientsTamil: ["மைதா", "எண்ணெய்", "உப்பு"],
    dietaryInfo: ["vegetarian"],
    servingTemp: "Best served hot",
    accompaniments: "Salna or kuruma available on request",
    preparationTime: "Made fresh on order"
  }
];

const bulkUploadCatering = async (catering) => {
  const batch = db.batch();
  const collectionRef = db.collection("catering");

  try {
    catering.forEach((item) => {
      const docRef = collectionRef.doc(item.id.toString());
      batch.set(docRef, item);
    });

    await batch.commit();
    console.log("🔥 Catering bulk upload successful!");

    // Update meta data lastUpdated timestamp
    const metaRef = db.collection("cateringMeta").doc("lastUpdated");
    await metaRef.set({ lastUpdated: new Date() });
    console.log("🔁 Catering meta lastUpdated doc updated!");
  } catch (error) {
    console.error("❌ Error uploading catering:", error);
  }
};

bulkUploadCatering(catering);

module.exports = catering;
