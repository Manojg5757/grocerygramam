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
  Platform
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { checkAndFetchProducts } from "../../Redux/ProductSlice"; // ✅ updated import
import { addToCart } from "../../Redux/CartSlice";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { myColors } from "../Utils/MyColors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const Products = () => {
  const { t,i18n } = useTranslation();
  const lang = i18n.language;
  console.log("lang",lang)
  const route = useRoute();
  const nav = useNavigation();
  const dispatch = useDispatch();
  const { data: products, loading } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);

  const key = `name_${lang}`;

  // ✅ Use the new checkAndFetchProducts thunk on mount
  useEffect(() => {
    dispatch(checkAndFetchProducts());
  }, [dispatch]);

  // ✅ Set category if passed via route
  useEffect(() => {
    if (route.params?.categoryId) {
      setSelectedCategory(route.params.categoryId);
      setSelectedCategoryName(route.params.name);
    } else {
      setSelectedCategory(null);
      setSelectedCategoryName(null);
    }
  }, [route.params]);

  // ✅ Filter products by category
  let filteredProducts = selectedCategory
    ? products.filter((item) => item.categoryId === selectedCategory)
    : products;

  // ✅ Apply search filter
  if (searchTerm.trim() !== "") {
    filteredProducts = filteredProducts.filter((item) =>
      item.name_en.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  const handleAddToCart = (product) => {
    if (!cartItems.some((item) => item.id === product.id)) {
      dispatch(addToCart(product));
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
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
              marginVertical: 20,
              color: myColors.primary,
            }}
          >
            {t("All Products")}
          </Text>

          {/* 🔍 Search Bar */}
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 10,
              paddingVertical: 8,
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <FontAwesome name="search" size={20} color="black" />
            <TextInput
              placeholder={t("Search products...")}
              value={searchTerm}
              onChangeText={(text) => setSearchTerm(text)}
              style={{
                flex: 1,
                marginHorizontal: 10,
                fontSize: 16,
              }}
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm("")}>
                <MaterialIcons name="highlight-remove" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>

          {/* ✅ Selected category info */}
          {selectedCategory && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginTop: 10,
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                {selectedCategoryName}
              </Text>
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <MaterialIcons name="highlight-remove" size={24} color="black" />
              </TouchableOpacity>
            </View>
          )}

          {/* ✅ Product list */}
          {filteredProducts.length > 0 ? (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              numColumns={2}
              keyboardShouldPersistTaps="handled"
              columnWrapperStyle={{ justifyContent: "space-between" }}
              renderItem={({ item }) => {
                const isInCart = cartItems.some(
                  (cartItem) => cartItem.id === item.id
                );
                return (
                  <TouchableOpacity
                    onPress={() =>
                      nav.navigate("ProductDetails", { productId: item.id })
                    }
                    style={{
                      width: "48%",
                      backgroundColor: "#fff",
                      borderRadius: 10,
                      padding: 10,
                      marginVertical: 10,
                      elevation: 2,
                    }}
                  >
                    <Image
                      source={{ uri: item.icon }}
                      style={{
                        width: "100%",
                        height: 150,
                        borderRadius: 10,
                        alignSelf: "center",
                      }}
                    />
                    <View style={{ height: 50 }}>
                      <Text
                        style={{ fontSize: 16, fontWeight: "bold", marginTop: 5 }}
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
                        gap: 10,
                      }}
                    >
                      <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                        ₹{item.offer_price}
                      </Text>
                      <Text
                        style={{
                          textDecorationLine: "line-through",
                          color: "gray",
                        }}
                      >
                        ₹{item.mrp}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        marginTop: 8,
                        backgroundColor: isInCart ? "#ccc" : "#28a745",
                        paddingVertical: 6,
                        paddingHorizontal: 15,
                        borderRadius: 5,
                        width: "100%",
                        alignSelf: "center",
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
              No products found.
            </Text>
          )}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Products;
