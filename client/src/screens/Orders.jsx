import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FlatList, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { fetchOrdersFromFirestore } from "../../Redux/OrderSlice";
import { myColors } from "../Utils/MyColors";
import { SafeAreaView } from "react-native-safe-area-context";

const statusColors = {
  processing: "#2196F3",       // Blue
  "ready for pickup": "#FF9800", // Orange
  "out for delivery": "#FFC107", // Amber
  delivered: "#4CAF50",         // Green
  cancelled: "#F44336",         // Red
};


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

  const renderStatusBadge = (statusText) => {
    const color = statusColors[statusText.toLowerCase()] || "#777"; // Default gray
    return (
      <View style={[styles.statusBadge, { backgroundColor: color }]}>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
    );
  };

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
            {renderStatusBadge(item.status)}
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
    backgroundColor: "#F9FBFD", // Very light blueish
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FBFD",
  },
  headerText: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "bold",
    color: myColors.primary,
    marginBottom: 24,
    letterSpacing: 1,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 22,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#E9EDF1",
  },
  orderDate: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 14,
  },
  itemContainer: {
    marginBottom: 12,
    padding: 14,
    backgroundColor: "#F4F6F9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E1E5EA",
  },
  itemName: {
    fontSize: 17,
    fontWeight: "600",
    color: myColors.primary,
    marginBottom: 6,
  },
  itemDetails: {
    fontSize: 15,
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#DDD",
    marginVertical: 18,
  },
  totalAmount: {
    fontWeight: "700",
    fontSize: 20,
    color: "#111827",
  },
  pickupText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 8,
  },
  statusBadge: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  statusText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
    textTransform: "capitalize",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});

export default Orders;
