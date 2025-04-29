import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FlatList, View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { fetchOrdersFromFirestore } from "../../Redux/OrderSlice"; // Import the action
import { myColors } from "../Utils/MyColors";
import { SafeAreaView } from "react-native-safe-area-context";

const Orders = () => {
  const dispatch = useDispatch();

  // Fetch orders from Redux store
  const { orders, status, error } = useSelector((state) => state.orders);

  // Fetch orders when the component mounts
  useEffect(() => {
    dispatch(fetchOrdersFromFirestore());
  }, [dispatch]);

  // If loading, show a loading indicator
  if (status === "loading") {
    return (
      <View style={styles.centeredView}>
        <ActivityIndicator size="large" color={myColors.primary} />
      </View>
    );
  }

  // If there is an error, show an error message
  if (status === "failed") {
    return (
      <View style={styles.centeredView}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Render the orders
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>Your Orders</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderDate}>
              Order Date: {new Date(item.orderDate).toLocaleDateString()}
            </Text>

            {/* Loop through the ordered items */}
            {item.orderedItems.map((orderedItem, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemName}>{orderedItem.name}</Text>
                <Text style={styles.itemDetails}>
                  Quantity: {orderedItem.quantity}
                </Text>
                <Text style={styles.itemDetails}>
                  Price: ₹{orderedItem.price}
                </Text>
              </View>
            ))}
            <Text style={styles.totalAmount}>
              Total Amount: ₹{item.totalAmount}
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
    backgroundColor: "#f9f9f9",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: myColors.primary,
    marginBottom: 20,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  orderDate: {
    fontSize: 16,
    fontWeight: "bold",
    color: myColors.primary,
  },
  itemContainer: {
    marginVertical: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  itemDetails: {
    fontSize: 14,
    color: "#666",
  },
  totalAmount: {
    fontWeight: "bold",
    fontSize: 16,
    color: myColors.primary,
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
});

export default Orders;
