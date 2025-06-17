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
  Animated,
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
  const user = useSelector(state => state.user.userData);

  // Animation values
  const fadeAnim = new Animated.Value(1);
  const scaleAnim = new Animated.Value(1);

  // Load cart from AsyncStorage when component mounts
  useEffect(() => {
    dispatch(loadCartFromStorage());
  }, [dispatch]);

  const handleIncrease = (item) => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        useNativeDriver: true,
        duration: 100,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        duration: 100,
      }),
    ]).start();
    dispatch(increaseQuantity(item));
  };

  const handleDecrease = (item) => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        useNativeDriver: true,
        duration: 100,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        duration: 100,
      }),
    ]).start();
    dispatch(decreaseQuantity(item));
  };

  const handleRemove = (item) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      dispatch(removeFromCart(item));
      fadeAnim.setValue(1);
    });
  };

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
    }
  };

  const grandTotal = cartItems.reduce(
    (total, item) => total + item.quantity * item.offer_price,
    0
  );

  const totalMRP = cartItems.reduce(
    (total, item) => total + item.quantity * item.mrp,
    0
  );

  const totalSavings = totalMRP - grandTotal;
  const isEligibileForDelivery = grandTotal >= 1499 && cartItems.length >= 3;

  // Get all products from Redux store
  const allProducts = useSelector((state) => state.products.data);

  // Get complementary product recommendations
  const getRecommendations = () => {
    // Get unique categories from cart items
    const cartCategories = new Set(cartItems.map(item => item.categoryId));
    const cartItemIds = new Set(cartItems.map(item => item.id));
    
    // Find complementary products
    const recommendations = allProducts
      .filter(product => {
        // Exclude products already in cart
        if (cartItemIds.has(product.id)) return false;
        
        // Include products from same categories
        if (cartCategories.has(product.categoryId)) return true;
        
        // Include complementary category products
        // e.g., if there's masala in cart, suggest flour products
        const complementaryPairs = {
          'Cat-02': 'Cat-03', // Masala -> Flour
          'Cat-03': 'Cat-02', // Flour -> Masala
          'Cat-04': 'Cat-01', // Oil -> Essentials
          'Cat-01': 'Cat-04', // Essentials -> Oil
          'Cat-05': 'Cat-07', // Snacks -> Soft Drinks
          'Cat-07': 'Cat-05', // Soft Drinks -> Snacks
        };
        
        return Array.from(cartCategories).some(
          cartCat => complementaryPairs[cartCat] === product.categoryId
        );
      })
      .slice(0, 3); // Limit to 3 recommendations
      
    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>
        {t("Your Cart")}
      </Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => nav.navigate("Products")}  // Fixed extra space in route name
          >
            <Text style={styles.shopButtonText}>{t("Browse Products")}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {totalSavings > 0 && (
            <Animated.View 
              style={[styles.savingsContainer, {
                transform: [{scale: scaleAnim}]
              }]}
            >
              <Text style={styles.savingsText}>
                {t("You Save")}: ₹{totalSavings.toFixed(2)}
              </Text>
              <Text style={styles.savingsSubtext}>
                ({((totalSavings/totalMRP) * 100).toFixed(1)}% {t("off")})
              </Text>
            </Animated.View>
          )}

          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            ListFooterComponent={() => (
              <>
                {recommendations.length > 0 && (
                  <View style={styles.recommendationsContainer}>
                    <Text style={styles.recommendationsTitle}>
                      {t("You might also like")}
                    </Text>
                    <FlatList
                      horizontal
                      data={recommendations}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity 
                          style={styles.recommendationItem}
                          onPress={() => nav.navigate("ProductDetails", { productId: item.id })}
                        >
                          <Image
                            source={{ uri: item.icon }}
                            style={styles.recommendationImage}
                            resizeMode="contain"
                          />
                          <Text style={styles.recommendationName} numberOfLines={2}>
                            {item.name_en}
                          </Text>
                          <View style={styles.recommendationPriceContainer}>
                            <Text style={styles.recommendationPrice}>
                              ₹{item.offer_price}
                            </Text>
                            <Text style={styles.recommendationMrp}>
                              ₹{item.mrp}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      showsHorizontalScrollIndicator={false}
                    />
                  </View>
                )}
                {cartItems.length > 0 && (
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

                    <Button
                      title={t("Proceed to Checkout")}
                      onPress={handleProceed}
                      color={myColors.primary}
                      style={styles.checkoutButton}
                    />
                  </View>
                )}
              </>
            )}
            renderItem={({ item }) => (
              <Animated.View 
                style={[
                  styles.cartItem,
                  {
                    opacity: fadeAnim,
                    transform: [{scale: scaleAnim}]
                  }
                ]}
              >
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

                <View style={styles.quantityContainer}>
                  <TouchableOpacity onPress={() => handleDecrease(item)}>
                    <Text style={styles.quantityButton}>-</Text>
                  </TouchableOpacity>
                  <Animated.Text 
                    style={[
                      styles.quantityText,
                      {transform: [{scale: scaleAnim}]}
                    ]}
                  >
                    {item.quantity}
                  </Animated.Text>
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

                <TouchableOpacity
                  onPress={() => handleRemove(item)}
                  style={styles.removeButton}
                >
                  <Fontisto name="shopping-basket-remove" size={20} color="red" />
                </TouchableOpacity>
              </Animated.View>
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shopButton: {
    backgroundColor: myColors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 2,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
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
  savingsContainer: {
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  savingsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  savingsSubtext: {
    fontSize: 14,
    color: '#388e3c',
    marginTop: 2,
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
  recommendationsContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: myColors.primary,
  },
  recommendationItem: {
    width: 130,
    marginRight: 12,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  recommendationImage: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  recommendationName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  recommendationPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 2,
    justifyContent: 'flex-start'
  },
  recommendationPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: myColors.primary,
  },
  recommendationMrp: {
    fontSize: 10,
    color: '#777',
    textDecorationLine: 'line-through',
    marginLeft: 4
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
