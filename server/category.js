const admin = require("firebase-admin");
const db = require("./firebase");

const category = [
  {
    "categoryId": "Cat-01",
    "name_en": "Essentials",
    "name_ta": "அத்தியாவசிய பொருட்கள்",
    "icon": "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/categories%2Fessentials.png?alt=media&token=9a66f8aa-229f-48b7-b5ba-fd4132d2c832",
    "color": "#a938b6"
  },
  {
    "categoryId": "Cat-02",
    "name_en": "Masala & Spices",
    "name_ta": "மசாலா வகைகள்",
    "icon": "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/categories%2Fmasala.png?alt=media&token=3d75f4d5-5238-4c98-9431-323403806af4",
    "color": "#815e3b"
  },
  {
    "categoryId": "Cat-03",
    "name_en": "Flours & Grains",
    "name_ta": "மாவு வகைகள்",
    "icon": "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/categories%2Fflours.png?alt=media&token=68946d6c-5a7f-4890-98bd-d88ab1885c6a",
    "color": "#cf5157"
  },
  {
    "categoryId": "Cat-04",
    "name_en": "Oils & Ghee",
    "name_ta": "ஆயில் & நெய்",
    "icon": "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/categories%2Foil.png?alt=media&token=3ac7c9da-3d4e-4c24-8013-ef82915b6c63",
    "color": "#004e78"
  },
  {
    "categoryId": "Cat-05",
    "name_en": "Snacks",
    "name_ta": "தின்பண்டங்கள்",
    "icon": "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/categories%2Fsnacks.png?alt=media&token=27f6a75c-21b1-438a-9faf-f1b925d7b031",
    "color": "#af08ac"
  },
  {
    "categoryId": "Cat-07",
    "name_en": "Soft Drinks",
    "name_ta": "ஜூஸ் & தேனீர்",
    "icon": "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/categories%2Fsoftdrinks.png?alt=media&token=ad17d451-afa4-4adb-99ac-9fbb81ff3f69",
    "color": "#92d15d"
  },
  {
    "categoryId": "Cat-08",
    "name_en": "Dry Fruits & Nuts",
    "name_ta": "உலர் பழங்கள் ",
    "icon": "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/categories%2Fdryfruits.png?alt=media&token=2c2d56fc-ac96-440b-86b1-4823a9038359",
    "color": "#f2ae7c"
  },
  {
    "categoryId": "Cat-09",
    "name_en": "Cleaning & HouseHold Items",
    "name_ta": "வீடு சுத்தம் செய்யும் பொருட்கள்",
    "icon": "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/categories%2Fhouse.png?alt=media&token=419fe8c9-173a-4824-b589-e36b912610a5",
    "color": "#486a58"
  },
  {
    "categoryId": "Cat-10",
    "name_en": "Personal Care",
    "name_ta": "பர்சனல் கேர்",
    "icon": "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/categories%2Fpersonalcare.png?alt=media&token=b0eac435-8875-4e0e-91ae-312ceff336f2",
    "color": "#0f0ab8"
  },
  {
    "categoryId": "Cat-11",
    "name_en": "Stationary",
    "name_ta": "ஸ்டேஷனரி",
    "icon": "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/categories%2Fstationary.png?alt=media&token=d4e8d9c2-985e-42e9-942b-54871bf56f44",
    "color": "#2a7fe8"
  },
  {
    "categoryId": "Cat-12",
    "name_en": "Sanitary Pads",
    "name_ta": "சானிட்டரி பேட்ஸ்",
    "icon": "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/categories%2Fsanitary.png?alt=media&token=6a7cecf2-350b-4eb3-9b18-d55dad7a65ce",
    "color": "#c5358a"
  }
]


const categories = async (category) => {
  const batch = db.batch();
  const collectionRef = db.collection("categories");

  try {
    category.forEach((item) => {
      const docRef = collectionRef.doc(item.categoryId);
      batch.set(docRef, item);
    });

    await batch.commit();

    console.log("🔥categories bulk upload successful!");
    const metaRef = db.collection("categoryMeta").doc("lastUpdated");
    await metaRef.set({ lastUpdated: new Date() });
    console.log("🔁 Category meta lastUpdated doc updated!");

  } catch (error) {
    console.error("❌ Error uploading categories:", error);
  }
};

categories(category);