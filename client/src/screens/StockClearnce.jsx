import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import StockBanner from "../../assets/stockclearance.jpg";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { checkAndFetchProducts } from "../../Redux/ProductSlice";
import { addToCart } from "../../Redux/CartSlice";
import { myColors } from "../Utils/MyColors";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const StockClearance = () => {
  const { data: products, loading } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart);
  const [clearanceProduct, setClearanceProduct] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  useEffect(() => {
    dispatch(checkAndFetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      const filteredProducts = products.filter(
        (item) => item.stock_clearance === true
      );
      setClearanceProduct(filteredProducts);
    }
  }, [products]);

  const handleAddToCart = (product) => {
    if (!cartItems.some((item) => item.id === product.id)) {
      dispatch(addToCart(product));
    }
  };

  // Helper function to get product name based on current language
  const getProductName = (item) => {
    return i18n.language === "ta" && item.name_ta ? item.name_ta : item.name_en;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#FFEB3B", "#FF9800"]} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel={t("Go back")}
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("Stock Clearance")}</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image source={StockBanner} style={styles.banner} />

          <Text style={styles.title}>🔥 {t("Stock Clearance Sale!")} 🔥</Text>
          <Text style={styles.description}>
            {t(
              "Grab your favorite items at discounted prices before they're gone!"
            )}
          </Text>

          {clearanceProduct.length > 0 ? (
            clearanceProduct.map((item, index) => {
              const isInCart = cartItems.some((ci) => ci.id === item.id);
              const discountPercent = item.mrp && item.offer_price
                ? Math.round(((item.mrp - item.offer_price) / item.mrp) * 100)
                : 0;

              return (
                <View key={index} style={styles.productCard}>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>
                      {discountPercent}% {t("OFF")}
                    </Text>
                  </View>
                  <Image source={{ uri: item.icon }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{getProductName(item)}</Text>
                    <Text style={styles.productWeight}>
                      {item.net_weight} {t(item.volume_type)}
                    </Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.offerPrice}>₹{item.offer_price}</Text>
                      <Text style={styles.mrp}>₹{item.mrp}</Text>
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.addButton,
                        { backgroundColor: isInCart ? "#ccc" : myColors.primary },
                      ]}
                      onPress={() => handleAddToCart(item)}
                      disabled={isInCart}
                    >
                      <Text style={styles.addButtonText}>
                        {isInCart ? t("Already Added") : t("Add to Cart")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.noProductText}>
              {t("No clearance products available.")}
            </Text>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default StockClearance;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 16,
    color: "#000",
    flex: 1,
  },
  banner: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginVertical: 15,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginBottom: 12,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    elevation: 3,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  productWeight: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  offerPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  mrp: {
    textDecorationLine: "line-through",
    color: "#777",
    marginLeft: 8,
    fontSize: 14,
  },
  addButton: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  noProductText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
    marginTop: 20,
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
