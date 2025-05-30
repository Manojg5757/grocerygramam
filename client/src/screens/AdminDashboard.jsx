import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { myColors } from "../Utils/MyColors";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();
  const auth = getAuth();
  const navigation = useNavigation();

  const fetchOrdersWithUserDetails = async () => {
    setLoading(true);
    try {
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      const ordersList = await Promise.all(
        ordersSnapshot.docs.map(async (docSnap) => {
          const orderData = docSnap.data();
          const userId = orderData.userId;

          const userDoc = await getDoc(doc(db, "users", userId));
          let userData = {};
          if (userDoc.exists()) {
            userData = userDoc.data();
          }

          return {
            id: docSnap.id,
            ...orderData,
            userDetails: userData,
          };
        })
      );
      setOrders(ordersList);
    } catch (error) {
      console.error("Error fetching orders with user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersWithUserDetails();
  }, []);

  const handleDelete = (orderId) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this order?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteDoc(doc(db, "orders", orderId));
            fetchOrdersWithUserDetails();
          } catch (error) {
            console.error("Error deleting order:", error);
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("userToken");
      navigation.replace("AdminLogin");
      console.log("✅ Admin logged out");
    } catch (error) {
      console.error("❌ Logout Error:", error);
      Alert.alert("Logout Failed", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={myColors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>📦 All Orders</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Orders List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.orderCard}>
            {/* Customer Info */}
            <Text style={styles.orderTitle}>👤 Customer Details</Text>
            <Text style={styles.orderText}>Username: {item.userDetails.username || "N/A"}</Text>
            <Text style={styles.orderText}>Phone: {item.userDetails.phone || "N/A"}</Text>
            <Text style={styles.orderText}>Address: {item.userDetails.address || "N/A"}</Text>
            <Text style={styles.orderText}>Landmark: {item.userDetails.landmark || "N/A"}</Text>

            {/* Pickup Badge */}
            <View style={styles.pickupBadge}>
              <Text style={styles.pickupText}>Pickup: {item.pickup || "N/A"}</Text>
            </View>

            {/* Order Info */}
            <Text style={[styles.orderTitle, { marginTop: 12 }]}>📝 Order Details</Text>
            <Text style={styles.orderText}>Total Amount: ₹{item.totalAmount}</Text>
            <Text style={styles.orderText}>Ordered Items:</Text>
            {item.orderedItems?.map((orderItem, index) => (
              <Text key={`${item.id}-${index}`} style={styles.itemText}>
                • {orderItem.name} x {orderItem.quantity}
              </Text>
            ))}

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>🗑️ Delete Order</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    color: myColors.primary,
  },
  logoutButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  logoutText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: myColors.primary,
    marginBottom: 6,
  },
  orderText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 12,
    marginBottom: 3,
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 16,
    alignSelf: "flex-start",
  },
  deleteText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  pickupBadge: {
    backgroundColor: "#ffeb3b",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  pickupText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#333",
  },
};

export default AdminDashboard;
