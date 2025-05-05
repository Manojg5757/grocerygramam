import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadCartFromStorage,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../Redux/CartSlice";
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { myColors } from "../Utils/MyColors";
import Fontisto from "@expo/vector-icons/Fontisto";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const Cart = () => {
  const nav = useNavigation();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart || []);
  const user = useSelector(state => state.user.userData)


  // Load cart from AsyncStorage when component mounts
  useEffect(() => {
    dispatch(loadCartFromStorage());
  }, [dispatch]);

  const handleIncrease = (item) => dispatch(increaseQuantity(item));
  const handleDecrease = (item) => dispatch(decreaseQuantity(item));
  const handleRemove = (item) => dispatch(removeFromCart(item));

  const handleProceed = async()=>{
    try {
      if(!user){
        nav.navigate('Login')
        return
      }
      nav.navigate("DeliveryDetails", {
        grandTotal: grandTotal,
        pickup: isEligibileForDelivery ? "Home Delivery" : "Self Pickup",})
    } catch (error) {
      console.log(error)
    }}

  const grandTotal = cartItems.reduce(
    (total, item) => total + item.quantity * item.offer_price,
    0
  );
  const isEligibileForDelivery = grandTotal >= 1499 && cartItems.length >= 3;

  return (
    <SafeAreaView style={{ flex: 1, padding: 15, backgroundColor: '#fff' }}>
      <Text
        style={{
          color: myColors.primary,
          fontSize: 22,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        {t("Your Cart")}
      </Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#f9f9f9",
              marginVertical: 10,
              padding: 15,
              borderRadius: 10,
              elevation: 2, // adds shadow for Android
              shadowColor: "#000", // adds shadow for iOS
              shadowOpacity: 0.1,
              shadowRadius: 5,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Image
              source={{ uri: item.icon }}
              style={{
                height: 60,
                width: 60,
                borderRadius: 10,
                marginRight: 15,
                borderColor: myColors.primary,
                borderWidth: 1,
              }}
              resizeMode="contain"
            />
            <View style={{ flex: 2 }}>
              <TouchableOpacity
                onPress={() => nav.navigate("ProductDetails", { productId: item.id })}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "#333",
                    marginBottom: 5,
                    maxWidth: 100,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name_en}
                </Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 12, color: "#777" }}>
                {item.net_weight} {item.volume_type}
              </Text>
            </View>

            {/* Quantity Changer */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 1,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 10,
                borderColor: myColors.primary,
              }}
            >
              <TouchableOpacity onPress={() => handleDecrease(item)}>
                <Text style={{ fontSize: 25, color: myColors.primary }}>-</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 10, fontSize: 16 }}>
                {item.quantity}
              </Text>
              <TouchableOpacity onPress={() => handleIncrease(item)}>
                <Text style={{ fontSize: 25, color: myColors.primary }}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 16 }}>
                ₹{item.quantity * item.offer_price}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  textAlign: "center",
                  textDecorationLine: "line-through",
                  color: "#777",
                }}
              >
                ₹{item.quantity * item.mrp}
              </Text>
            </View>

            {/* Remove Button */}
            <TouchableOpacity
              onPress={() => handleRemove(item)}
              style={{
                padding: 10,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
                backgroundColor: "#f3f3f3",
              }}
            >
              <Fontisto name="shopping-basket-remove" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={{ marginTop: 20, paddingVertical: 5, borderTopWidth: 1 }}>
        <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 5 }}>
          {t("Minimum Order Value: ₹1499 (or Self Pickup)")}
        </Text>
        <Text style={{ fontSize: 14, textAlign: "center", marginBottom: 5 }}>
          {t("Minimum Products: 3")}
        </Text>

        <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center" }}>
          {t("Grand Total")}: ₹{grandTotal}
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: isEligibileForDelivery ? "green" : "red",
            marginTop: 10,
          }}
        >
          {isEligibileForDelivery
            ? t("Eligible for free delivery")
            : `Add ₹${Math.max(0, 1499 - grandTotal)} more and ${Math.max(
                0,
                3 - cartItems.length
              )} more item${
                3 - cartItems.length !== 1 ? "s" : ""
              } for free delivery`}
        </Text>

        {/* Confirm Order Button */}
        <Button
          title={t("Proceed to Checkout")}
          disabled={cartItems.length === 0}
          onPress={handleProceed}
          color={myColors.primary}
          style={{
            marginTop: 20,
            borderRadius: 10,
            backgroundColor: myColors.primary,
            paddingVertical: 12,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Cart;
