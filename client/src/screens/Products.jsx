// Products.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { checkAndFetchProducts } from "../../Redux/ProductSlice";
import { addToCart } from "../../Redux/CartSlice";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { myColors } from "../Utils/MyColors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";

const { width: screenWidth } = Dimensions.get("window");

export default function Products() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const route = useRoute();
  const nav = useNavigation();
  const dispatch = useDispatch();
  const { data: products, loading } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);

  // calculate tile width for 2‑column grid
  const H_PAD = 10 * 2;
  const MARGIN_H = 10;
  const NUM_COL = 2;
  const tileWidth = (screenWidth - H_PAD - MARGIN_H * NUM_COL) / NUM_COL;

  useEffect(() => {
    dispatch(checkAndFetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (route.params?.categoryId) {
      setSelectedCategory(route.params.categoryId);
      setSelectedCategoryName(route.params.name);
    } else {
      setSelectedCategory(null);
      setSelectedCategoryName(null);
    }
  }, [route.params]);

  let filtered = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory)
    : products;

  if (searchTerm.trim() !== "") {
    filtered = filtered.filter((p) =>
      p.name_en.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  function handleAddToCart(product) {
    if (!cartItems.some((item) => item.id === product.id)) {
      dispatch(addToCart(product));
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={myColors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1, padding: 10 }}>
          <Text
            style={{
              marginTop: 20,
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 20,
              color: myColors.primary,
            }}
          >
            {t("All Products")}
          </Text>

          {/* Search Bar */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 8,
              marginBottom: 10,
            }}
          >
            <FontAwesome name="search" size={20} color="black" />
            <TextInput
              placeholder={t("Search products...")}
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={{ flex: 1, marginHorizontal: 10, fontSize: 16 }}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm("")}>
                <MaterialIcons
                  name="highlight-remove"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Selected Category */}
          {selectedCategory && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                {selectedCategoryName}
              </Text>
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <MaterialIcons
                  name="highlight-remove"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Product Grid */}
          {filtered.length > 0 ? (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id.toString()}
              numColumns={NUM_COL}
              keyboardShouldPersistTaps="handled"
              columnWrapperStyle={{ justifyContent: "space-between" }}
              renderItem={({ item }) => {
                const isInCart = cartItems.some((ci) => ci.id === item.id);
                return (
                  <TouchableOpacity
                    onPress={() =>
                      nav.navigate("ProductDetails", { productId: item.id })
                    }
                    style={{
                      width: tileWidth,
                      backgroundColor: "#fff",
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: 10,
                      ...(Platform.OS === "ios"
                        ? {
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowRadius: 6,
                            shadowOffset: { width: 0, height: 2 },
                          }
                        : { elevation: 3 }),
                    }}
                  >
                    <FastImage
                      source={{
                        uri: item.icon,
                        priority: FastImage.priority.normal,
                        cache: FastImage.cacheControl.immutable, // or 'web' if you're handling cache headers from Firebase
                      }}
                      style={{
                        width: "100%",
                        aspectRatio: 1,
                        borderRadius: 8,
                      }}
                      resizeMode={FastImage.resizeMode.cover}
                    />

                    <View style={{ height: 50 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          marginTop: 5,
                        }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item[`name_${lang}`]}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: "gray", marginTop: 3 }}>
                      {item.net_weight}
                      {item.volume_type}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 4,
                      }}
                    >
                      <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                        ₹{item.offer_price}
                      </Text>
                      <Text
                        style={{
                          textDecorationLine: "line-through",
                          color: "gray",
                          marginLeft: 8,
                        }}
                      >
                        ₹{item.mrp}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        marginTop: 8,
                        backgroundColor: isInCart ? "#ccc" : myColors.primary,
                        paddingVertical: 8,
                        borderRadius: 5,
                      }}
                      onPress={() => handleAddToCart(item)}
                      disabled={isInCart}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 14,
                          textAlign: "center",
                        }}
                      >
                        {isInCart ? t("Already Added") : t("Add to Cart")}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16 }}>
              {t("No products found.")}
            </Text>
          )}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
