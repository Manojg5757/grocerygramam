import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { myColors } from "../Utils/MyColors";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from 'react-native-animatable';

const OrderConfirmed = () => {
  const nav = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      nav.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
      <Animatable.View animation="bounceIn" duration={1000}>
        <Ionicons name="checkmark-circle-outline" size={120} color={myColors.primary} />
      </Animatable.View>

      <Animatable.Text
        animation="fadeInDown"
        delay={300}
        duration={1000}
        style={{ fontSize: 26, fontWeight: "bold", color: myColors.primary, marginTop: 20 }}
      >
        Order Confirmed!
      </Animatable.Text>

      <Animatable.Text
        animation="fadeInUp"
        delay={600}
        duration={1000}
        style={{ fontSize: 16, color: "#555", marginTop: 10, textAlign: "center", paddingHorizontal: 30 }}
      >
        Your order has been placed successfully. We'll notify you when it’s ready for delivery or pickup.
      </Animatable.Text>
    </SafeAreaView>
  );
};

export default OrderConfirmed;
