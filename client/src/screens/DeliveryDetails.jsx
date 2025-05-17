import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { myColors } from "../Utils/MyColors";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { addOrderToFirestore, clearCart } from "../../Redux/CartSlice";

const DeliveryDetails = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const nav = useNavigation();
  const [storedUserData, setStoredUserData] = useState(null);
  const cartItems = useSelector((state) => state.cart || []);
  const { grandTotal, pickup } = route.params;

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await AsyncStorage.getItem("userData");
      if (data) {
        setStoredUserData(JSON.parse(data));
      }
    };
    fetchUserData();
  }, []);

  const handleConfirmOrder = async () => {
    if (!storedUserData) {
      nav.navigate("UserName");
      return;
    }
    try {
      const orderData = {
        orderedItems: cartItems.map((item) => ({
          name: item.name_en,
          quantity: item.quantity,
          price: item.offer_price,
        })),
        totalAmount: cartItems.reduce(
          (total, item) => total + item.quantity * item.offer_price,
          0
        ),
        pickup: pickup,
        orderDate: new Date().toISOString(),
      };

      await dispatch(addOrderToFirestore(orderData));
      dispatch(clearCart());
      nav.navigate("OrderConfirmed");
    } catch (error) {
      console.error("Error while placing order:", error);
    }
  };

  if (!storedUserData) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="blue" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              marginTop: 20,
              padding: 20,
              backgroundColor: "#f9f9f9",
              borderRadius: 10,
              elevation: 3,
            }}
          >
            <Text
              style={{
                color: myColors.primary,
                fontSize: 22,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 15,
              }}
            >
              Delivery Details
            </Text>

            {[
              { label: "Name", value: storedUserData.username },
              { label: "Phone", value: storedUserData.phone },
              { label: "Address", value: storedUserData.address },
              { label: "Landmark", value: storedUserData.landmark },
              { label: "Pincode", value: storedUserData.pincode },
              { label: "Delivery", value: pickup },
            ].map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  marginBottom: 15,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: myColors.primary,
                    fontSize: 18,
                    fontWeight: "600",
                    width: 100,
                  }}
                >
                  {item.label}:
                </Text>
                <Text style={{ fontSize: 16, color: "#333", flex: 1 }}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={{
              marginTop: 20,
              padding: 15,
              backgroundColor: "#f9f9f9",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: myColors.primary,
                fontSize: 20,
                textAlign: "center",
                marginBottom: 15,
              }}
            >
              Delivery Instructions
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: myColors.primary,
                  fontSize: 18,
                  marginRight: 8,
                }}
              >
                🚚
              </Text>
              <Text style={{ fontSize: 15, flex: 1 }}>
                Orders above <Text style={{ fontWeight: "bold" }}>₹1499</Text>{" "}
                with a minimum of{" "}
                <Text style={{ fontWeight: "bold" }}>3 products</Text> will be
                delivered to your doorstep within the{" "}
                <Text style={{ fontWeight: "bold" }}>641671</Text> pincode area.
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <Text
                style={{
                  color: myColors.primary,
                  fontSize: 18,
                  marginRight: 8,
                }}
              >
                📦
              </Text>
              <Text style={{ fontSize: 15, flex: 1 }}>
                Orders below <Text style={{ fontWeight: "bold" }}>₹1499</Text>{" "}
                will be neatly packed and kept ready for pickup at our store.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Fixed confirm button */}
        <View
          style={{
            padding: 20,
            borderTopWidth: 1,
            borderTopColor: "#ddd",
            backgroundColor: "#fff",
          }}
        >
          <Text style={{ fontSize: 16,fontWeight:'bold', marginBottom: 10 }}>
            Total Value: ₹{grandTotal}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: myColors.primary,
              padding: 12,
              borderRadius: 5,
            }}
            onPress={handleConfirmOrder}
          >
            <Text
              style={{ color: "#fff", textAlign: "center", fontSize: 18 }}
            >
              Confirm Order
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DeliveryDetails;
