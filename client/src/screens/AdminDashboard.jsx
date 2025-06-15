import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
  FlatList as RNFlatList,
} from "react-native";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAuth, signOut } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { myColors } from "../Utils/MyColors";

const statusOptions = [
  "processing",
  "ready for pickup",
  "out for delivery",
  "delivered",
  "cancelled"
];

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStatusDropdown, setShowStatusDropdown] = useState(null); // stores order id currently selecting status
console.log("admin dash",orders)
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setShowStatusDropdown(null);
      fetchOrdersWithUserDetails();
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Update Failed", "Could not update order status.");
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
            <Text style={styles.orderText}>
              Username: {item.userDetails.username || "N/A"}
            </Text>
            <Text style={styles.orderText}>
              Phone: {item.userDetails.phone || "N/A"}
            </Text>
            <Text style={styles.orderText}>
              Address: {item.userDetails.address || "N/A"}
            </Text>
            <Text style={styles.orderText}>
              Landmark: {item.userDetails.landmark || "N/A"}
            </Text>

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

            {/* Status Selector */}
            <View style={{ marginTop: 12 }}>
              <Text style={[styles.orderTitle, { marginBottom: 6 }]}>Status:</Text>
              <TouchableOpacity
                onPress={() => setShowStatusDropdown(item.id)}
                style={{
                  backgroundColor: "#eee",
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 6,
                  alignSelf: "flex-start",
                }}
              >
                <Text style={{ color: myColors.primary, fontWeight: "bold" }}>
                  {item.status || "processing"}
                </Text>
              </TouchableOpacity>

              {/* Modal Dropdown */}
              <Modal
                transparent={true}
                visible={showStatusDropdown === item.id}
                animationType="fade"
                onRequestClose={() => setShowStatusDropdown(null)}
              >
                <Pressable
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => setShowStatusDropdown(null)}
                >
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      padding: 10,
                      width: 250,
                      maxHeight: 300,
                    }}
                  >
                    <RNFlatList
                      data={statusOptions}
                      keyExtractor={(status) => status}
                      renderItem={({ item: statusItem }) => (
                        <TouchableOpacity
                          style={{
                            paddingVertical: 12,
                            borderBottomWidth: 1,
                            borderColor: "#ddd",
                          }}
                          onPress={() => updateOrderStatus(item.id, statusItem)}
                        >
                          <Text
                            style={{
                              color:
                                statusItem === (item.status || "processing")
                                  ? myColors.primary
                                  : "#444",
                              fontWeight:
                                statusItem === (item.status || "processing")
                                  ? "bold"
                                  : "normal",
                              fontSize: 16,
                            }}
                          >
                            {statusItem.charAt(0).toUpperCase() + statusItem.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </Pressable>
              </Modal>
            </View>

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
    color: "black",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    color: "black",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    color: "black",
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
    color: "black",
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
