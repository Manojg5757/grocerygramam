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
  StyleSheet,
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
  console.log("cart",user)

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>
        {t("Your Cart")}
      </Text>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image
              source={{ uri: item.icon }}
              style={styles.productImage}
              resizeMode="contain"
            />
            <View style={styles.productInfo}>
              <TouchableOpacity
                onPress={() => nav.navigate("ProductDetails", { productId: item.id })}
              >
                <Text
                  style={styles.productName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name_en}
                </Text>
              </TouchableOpacity>
              <Text style={styles.productWeight}>
                {item.net_weight} {item.volume_type}
              </Text>
            </View>

            {/* Quantity Changer */}
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={() => handleDecrease(item)}>
                <Text style={styles.quantityButton}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>
                {item.quantity}
              </Text>
              <TouchableOpacity onPress={() => handleIncrease(item)}>
                <Text style={styles.quantityButton}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.offerPrice}>
                ₹{item.quantity * item.offer_price}
              </Text>
              <Text style={styles.mrpPrice}>
                ₹{item.quantity * item.mrp}
              </Text>
            </View>

            {/* Remove Button */}
            <TouchableOpacity
              onPress={() => handleRemove(item)}
              style={styles.removeButton}
            >
              <Fontisto name="shopping-basket-remove" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.summaryContainer}>
        <Text style={styles.orderInfo}>
          {t("Minimum Order Value: ₹1999 (or Self Pickup)")}
        </Text>
        <Text style={styles.orderInfo}>
          {t("Minimum Products: 4")}
        </Text>

        <Text style={styles.grandTotal}>
          {t("Grand Total")}: ₹{grandTotal}
        </Text>
        <Text style={styles.deliveryStatus}>
          {isEligibileForDelivery
            ? t("Eligible for free delivery")
            : `Add ₹${Math.max(0, 1999 - grandTotal)} more and ${Math.max(
                0,
                4 - cartItems.length
              )} more item${
                4 - cartItems.length !== 1 ? "s" : ""
              } for free delivery`}
        </Text>

        {/* Confirm Order Button */}
        <Button
          title={t("Proceed to Checkout")}
          disabled={cartItems.length === 0}
          onPress={handleProceed}
          color={myColors.primary}
          style={styles.checkoutButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  headerText: {
    color: myColors.primary,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    marginVertical: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  productImage: {
    height: 60,
    width: 60,
    borderRadius: 10,
    marginRight: 15,
    borderColor: myColors.primary,
    borderWidth: 1,
  },
  productInfo: {
    flex: 2,
  },
  productName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    maxWidth: 100,
  },
  productWeight: {
    fontSize: 12,
    color: "#777",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderColor: myColors.primary,
  },
  quantityButton: {
    fontSize: 25,
    color: myColors.primary,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: 'black',
  },
  priceContainer: {
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerPrice: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    color: 'black',
    flexWrap: 'wrap',
  },
  mrpPrice: {
    fontSize: 12,
    textAlign: "center",
    textDecorationLine: "line-through",
    color: "#777",
    flexWrap: 'wrap',
    marginTop: 2,
  },
  removeButton: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#f3f3f3",
  },
  summaryContainer: {
    marginTop: 20,
    paddingVertical: 5,
    borderTopWidth: 1,
  },
  orderInfo: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
    color: 'black',
  },
  grandTotal: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: 'black',
  },
  deliveryStatus: {
    textAlign: "center",
    marginTop: 10,
    color: 'black',
  },
  checkoutButton: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: myColors.primary,
    paddingVertical: 12,
  },
});

export default Cart;