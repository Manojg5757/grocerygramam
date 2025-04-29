import {
    View,
    Text,
    Image,
    Pressable,
    Share,
    TouchableOpacity,
    ScrollView,
  } from "react-native";
  import React from "react";
  import { useNavigation, useRoute } from "@react-navigation/native";
  import Ionicons from "@expo/vector-icons/Ionicons";
  import FontAwesome from "@expo/vector-icons/FontAwesome";
  import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
  import { myColors } from "../Utils/MyColors.js";
  import { useDispatch, useSelector } from "react-redux";
  import { addToCart } from "../../Redux/CartSlice.js"; 
  import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
  
  const ProductDetails = () => {
    const insets = useSafeAreaInsets();
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const{t,i18n} = useTranslation();
    const lang = i18n.language
    const route = useRoute();
    const nav = useNavigation();
    const { productId } = route.params;
    const products = useSelector((state) => state.products.data);
    const product = products.find((product) => product.id === productId);
  
    const isInCart = cartItems.some((item) => item.id === product?.id);

    const key = `name_${lang}`
  
    const handleAddToCart = () => {
      if (!isInCart) {
        dispatch(addToCart(product));
      }
    };
  
    if (!product) {
      return (
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20, fontWeight: "600" }}>Product not found</Text>
          </SafeAreaView>
        </SafeAreaProvider>
      );
    }
  
    const onShare = async () => {
      try {
        await Share.share({
          message: `Check out this product: ${product.name_en}\n${product.icon}`,
        });
      } catch (error) {
        console.error(error.message);
      }
    };
  
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
          <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
            {/* Product Image */}
            <Image
              source={{ uri: product.icon }}
              style={{
                height: 350,
                width: "100%",
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
              }}
            />
  
            {/* Back & Share Buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 15,
                position: "absolute",
                width: "100%",
                top: 40,
              }}
            >
              <Pressable
                onPress={() => nav.goBack()}
                style={{
                  backgroundColor: "white",
                  borderRadius: 30,
                  padding: 5,
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
              >
                <Ionicons name="chevron-back" size={28} color="black" />
              </Pressable>
  
              <Pressable
                onPress={onShare}
                style={{
                  backgroundColor: "white",
                  borderRadius: 30,
                  padding: 5,
                  elevation: 3,
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                }}
              >
                <FontAwesome name="share" size={26} color="black" />
              </Pressable>
            </View>
  
            {/* Product Details */}
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 26, color: "black", fontWeight: "700" }}>
                {t(product[key])}
              </Text>
              <Text style={{ marginTop: 6, fontSize: 16, color: "grey" }}>
                {product.net_weight} {product.volume_type}
              </Text>
  
              {/* Price */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 12,
                  padding: 10,
                  backgroundColor: "#f7f7f7",
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 30, fontWeight: "bold", color: myColors.primary }}>
                  ₹{product.offer_price}
                </Text>
              </View>
  
              {/* Description */}
              <Text style={{ marginTop: 20, fontSize: 16, lineHeight: 24, color: "#333" }}>
                {product.description_en}
              </Text>
            </View>
          </ScrollView>
  
          {/* Bottom Button */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              backgroundColor: "white",
              paddingTop: 10,
              paddingBottom: insets.bottom + 15,
              paddingHorizontal: 20,
              borderTopWidth: 1,
              borderColor: "#eee",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: isInCart ? "#bbb" : myColors.primary,
                height: 60,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={handleAddToCart}
              disabled={isInCart}
            >
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "white" }}>
                {isInCart ? "Already in Cart" : "Add to Basket"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  };
  
  export default ProductDetails;
  