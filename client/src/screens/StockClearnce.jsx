import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import StockBanner from "../../assets/stockclearance.jpg"; // assuming you have a banner image
import { SafeAreaView } from "react-native-safe-area-context";

const StockClearance = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Image source={StockBanner} style={styles.banner} />

        <Text style={styles.title}>Stock Clearance Sale!</Text>
        <Text style={styles.description}>
          Grab your favorite products at unbeatable prices. Limited stock
          available — hurry before it's gone!
        </Text>

        {/* Example Product Placeholder */}
        <View style={styles.productCard}>
          <Text style={styles.productName}>Sample Product</Text>
          <Text style={styles.productPrice}>₹199</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  banner: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginTop:20
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: "#333",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: 20,
    color: "#555",
  },
  productCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  productPrice: {
    fontSize: 16,
    color: "#444",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#E53935",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default StockClearance;
