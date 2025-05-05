import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FlatList, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { fetchOrdersFromFirestore } from "../../Redux/OrderSlice";
import { myColors } from "../Utils/MyColors";
import { SafeAreaView } from "react-native-safe-area-context";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrdersFromFirestore());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color={myColors.primary} />
      </View>
    );
  }

  if (status === "failed") {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>📦 Your Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderDate}>
              📅 {new Date(item.orderDate).toLocaleDateString()}
            </Text>

            {item.orderedItems.map((orderedItem, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemName}>🛒 {orderedItem.name}</Text>
                <Text style={styles.itemDetails}>
                  Quantity: {orderedItem.quantity}
                </Text>
                <Text style={styles.itemDetails}>
                  Price: ₹{orderedItem.price}
                </Text>
              </View>
            ))}

            <View style={styles.divider} />

            <Text style={styles.totalAmount}>
              💰 Total: ₹{item.totalAmount}
            </Text>
            <Text style={styles.pickupText}>
              📍 Pickup: {item.pickup}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FAFAFA",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  headerText: {
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    color: myColors.primary,
    marginBottom: 24,
    letterSpacing: 0.8,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  orderDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
    marginBottom: 12,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#F6F6F6",
    borderRadius: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
    color: myColors.primary,
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: "#666",
  },
  divider: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: 14,
  },
  totalAmount: {
    fontWeight: "700",
    fontSize: 18,
    color: "#333",
    marginTop: 6,
  },
  pickupText: {
    fontSize: 15,
    color: "#666",
    marginTop: 6,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default Orders;
