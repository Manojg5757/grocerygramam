import essentials from './assets/categories/essentials.png'
import masala from './assets/categories/masala.png'
import flour from './assets/categories/flours.png'
import oil from './assets/categories/oil.png'
import snacks from './assets/categories/snacks.png'
import softdrinks from './assets/categories/softdrinks.png'
import dryfruits from './assets/categories/dryfruits.png'
import house from './assets/categories/house.png'
import personalcare from './assets/categories/personalcare.png'
import stationary from './assets/categories/stationary.png'
import sanitary from './assets/categories/sanitary.png'

export const category = [
  {
    "categoryId": "Cat-01",
    "name_en": "Essentials",
    "name_ta": "அத்தியாவசிய பொருட்கள்",
    "icon": essentials,
    "color": "#a938b6"
  },
  {
    "categoryId": "Cat-02",
    "name_en": "Masala & Spices",
    "name_ta": "மசாலா வகைகள்",
    "icon": masala,
    "color": "#815e3b"
  },
  {
    "categoryId": "Cat-03",
    "name_en": "Flours & Grains",
    "name_ta": "மாவு வகைகள்",
    "icon": flour,
    "color": "#cf5157"
  },
  {
    "categoryId": "Cat-04",
    "name_en": "Oils & Ghee",
    "name_ta": "ஆயில் & நெய்",
    "icon": oil,
    "color": "#004e78"
  },
  {
    "categoryId": "Cat-05",
    "name_en": "Snacks",
    "name_ta": "தின்பண்டங்கள்",
    "icon": snacks,
    "color": "#af08ac"
  },
  {
    "categoryId": "Cat-07",
    "name_en": "Soft Drinks",
    "name_ta": "ஜூஸ் & தேனீர்",
    "icon": softdrinks,
    "color": "#92d15d"
  },
  {
    "categoryId": "Cat-08",
    "name_en": "Dry Fruits & Nuts",
    "name_ta": "உலர் பழங்கள் ",
    "icon": dryfruits,
    "color": "#f2ae7c"
  },
  {
    "categoryId": "Cat-09",
    "name_en": "Cleaning & HouseHold Items",
    "name_ta": "வீடு சுத்தம் செய்யும் பொருட்கள்",
    "icon": house,
    "color": "#486a58"
  },
  {
    "categoryId": "Cat-10",
    "name_en": "Personal Care",
    "name_ta": "பர்சனல் கேர்",
    "icon": personalcare,
    "color": "#0f0ab8"
  },
  // {
  //   "categoryId": "Cat-11",
  //   "name_en": "Vegtables",
  //   "name_ta": "காய்கறிகள்",
  //   "icon": "https://drive.google.com/uc?export=view&id=1FzGZ_997XG_nWzglg-851C5A-YcuTKVC",
  //   "color": "#4a16b9"
  // },
  {
    "categoryId": "Cat-11",
    "name_en": "Stationary",
    "name_ta": "ஸ்டேஷனரி",
    "icon": stationary,
    "color": "#2a7fe8"
  },
  {
    "categoryId": "Cat-12",
    "name_en": "Sanitary Pads",
    "name_ta": "சானிட்டரி பேட்ஸ்",
    "icon": sanitary,
    "color": "#c5358a"
  }
]

export const catering = [
  {
    id:1,
    itemName:"Meals",
    itemNameTamil:"முழு சாப்பாடு",
    minOrder:20,
    type:"meal",
    icon:"https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fmeals.png?alt=media&token=cec4bc79-9ce1-47c0-86e1-4dcf7c21dce6",
    price:80
  },
  {
    id:2,
    itemName:"Tiffen",
    itemNameTamil:"டிப்பன்",
    minOrder:20,
    type:"tiffen",
    icon:"https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Ftiffen.png?alt=media&token=7f529ed4-d9d5-461f-a340-d46d8769049e",
    price:120
  },
  {
    id:3,
    itemName:"Ulundha Vadai",
    itemNameTamil:"உளுந்த வடை",
    minOrder:25,
    type:"piece",
    icon:"https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Ftiffen.png?alt=media&token=7f529ed4-d9d5-461f-a340-d46d8769049e",
    price:8
  },
  {
    id:4,
    itemName:"Paruppu Vadai",
    itemNameTamil:"பருப்பு வடை",
    minOrder:25,
    type:"piece",
    icon:"https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fparuppuvadai.png?alt=media&token=112e85a9-c92d-41d4-8c1b-57cddbb9e3ee",
    price:8
  },
  {
    id:4,
    itemName:"Parotta",
    itemNameTamil:"பரோட்டா",
    minOrder:10,
    type:"piece",
    icon:"https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fparotta.png?alt=media&token=f08bfa66-d9eb-482c-96c9-5f35e4d070de",
    price:12
  },
]

