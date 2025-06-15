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

const StockClearance = () => {
  const { data: products, loading } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart);
  const [clearanceProduct, setClearanceProduct] = useState([]);
  const dispatch = useDispatch();

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={["#FFEB3B", "#FF9800"]} style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image source={StockBanner} style={styles.banner} />

          <Text style={styles.title}>🔥 Stock Clearance Sale! 🔥</Text>
          <Text style={styles.description}>
            Grab your favorite items at discounted prices before they're gone!
          </Text>

          {clearanceProduct.length > 0 ? (
            clearanceProduct.map((item, index) => {
              const isInCart = cartItems.some((ci) => ci.id === item.id);
              return (
                <View key={index} style={styles.productCard}>
                  <Image source={{uri:item.icon}} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.name_en}</Text>
                    <Text style={styles.productWeight}>
                      {item.net_weight}
                      {item.volume_type}
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
                        {isInCart ? "Already Added" : "Add to Cart"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <Text style={styles.noProductText}>No clearance products available.</Text>
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
});
