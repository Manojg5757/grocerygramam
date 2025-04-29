import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";


const HomeBanner = () => {
  const nav = useNavigation();
  const {t,i18n} = useTranslation()
  const lang = i18n.language
  const handlePress = () => {
    nav.navigate("Catering");
  };
const icon_en =  "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fcateringbannerone.png?alt=media&token=5a377d40-6f85-4a24-90be-d4c12c17ff4f"
const icon_ta = "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2FhomebannerTamil.png?alt=media&token=52cebd0e-6f6c-4d9e-95f8-41cce4f85b7d"

  return (
    <View>
      <TouchableOpacity onPress={handlePress}>
        <Image
          source={{uri:lang === "ta" ? icon_ta : icon_en}}
          style={{ height: 200, width: "100%", borderRadius: 20,resizeMode:'cover' }}
        />
        
        
      </TouchableOpacity>

     
    </View>
  );
};

export default HomeBanner;
