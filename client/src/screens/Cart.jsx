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
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart || []);
  const user = useSelector(state => state.user.userData);

  // Animation values
  const fadeAnim = new Animated.Value(1);
  const scaleAnim = new Animated.Value(1);

  // Helper function to get product name based on current language
  const getProductName = (item) => {
    return i18n.language === 'ta' && item.name_ta ? item.name_ta : item.name_en;
  };

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
        pickup: isEligibileForDelivery ? t("Home Delivery") : t("Self Pickup"),
      })
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
  const DELIVERY_THRESHOLD = 1999;
  const isEligibileForDelivery = grandTotal >= DELIVERY_THRESHOLD;
  const amountForFreeDelivery = DELIVERY_THRESHOLD - grandTotal;

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
        if (cartItemIds.has(product.id)) return false;
        if (cartCategories.has(product.categoryId)) return true;
        
        const complementaryPairs = {
          'Cat-02': 'Cat-03',
          'Cat-03': 'Cat-02',
          'Cat-04': 'Cat-01',
          'Cat-01': 'Cat-04',
          'Cat-05': 'Cat-07',
          'Cat-07': 'Cat-05',
        };
        
        return Array.from(cartCategories).some(
          cartCat => complementaryPairs[cartCat] === product.categoryId
        );
      })
      .slice(0, 3);
      
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
          <Text style={styles.emptyText}>{t("Your cart is empty")}</Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => nav.navigate("Products")}
          >
            <Text style={styles.shopButtonText}>{t("Start shopping")}</Text>
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
                            {getProductName(item)}
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

                <View style={styles.summaryContainer}>
                  <Text style={styles.summaryTitle}>{t("Order Summary")}</Text>
                  
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t("Items")}</Text>
                    <Text style={styles.summaryValue}>{cartItems.length}</Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{t("MRP Total")}</Text>
                    <Text style={styles.summaryValue}>₹{totalMRP}</Text>
                  </View>

                  {totalSavings > 0 && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>{t("Total Savings")}</Text>
                      <Text style={[styles.summaryValue, styles.savingsValue]}>-₹{totalSavings}</Text>
                    </View>
                  )}

                  <View style={[styles.summaryRow, styles.grandTotalRow]}>
                    <Text style={styles.grandTotalLabel}>{t("Grand Total")}</Text>
                    <Text style={styles.grandTotalValue}>₹{grandTotal}</Text>
                  </View>

                  <View style={styles.deliveryInfoContainer}>
                    {isEligibileForDelivery ? (
                      <>
                        <Text style={[styles.deliveryStatus, styles.eligibleDelivery]}>
                          {t("Your order qualifies for Free delivery")}
                        </Text>
                        <View style={styles.deliveryRadiusContainer}>
                          <Text style={styles.deliveryRadiusText}>
                            {t("Free delivery within 10km")}
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        <Text style={[styles.deliveryStatus, styles.selfPickup]}>
                          {t("You can come and get the order at shop, We will notify when your order is Ready")}
                        </Text>
                        <Text style={styles.addMoreInfo}>
                          {t("Purchase for")} ₹{amountForFreeDelivery.toFixed(2)} {t("more to get Free Delivery")}
                        </Text>
                        <View style={styles.deliveryRadiusContainer}>
                          <Text style={styles.deliveryRadiusText}>
                            {t("Free delivery within 10km")}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.checkoutButton,
                      !user && styles.checkoutButtonDisabled
                    ]}
                    onPress={handleProceed}
                    disabled={!user}
                  >
                    <Text style={styles.checkoutButtonText}>
                      {user ? t("Proceed to Checkout") : t("Please login to continue")}
                    </Text>
                  </TouchableOpacity>
                </View>
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
                      {getProductName(item)}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.productWeight}>
                    {item.net_weight} {t(item.volume_type)}
                  </Text>
                </View>

                <View style={styles.quantityContainer}>
                  <TouchableOpacity 
                    onPress={() => handleDecrease(item)}
                    style={styles.quantityButton}
                  >
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
                  <TouchableOpacity 
                    onPress={() => handleIncrease(item)}
                    style={styles.quantityButton}
                  >
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
                  accessibilityLabel={t("Remove")}
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
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: myColors.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#333',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  savingsValue: {
    color: '#2e7d32',
  },
  grandTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginTop: 10,
    paddingTop: 10,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: myColors.primary,
  },
  deliveryInfoContainer: {
    marginVertical: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  deliveryStatus: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  eligibleDelivery: {
    color: '#2e7d32',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  selfPickup: {
    color: '#ed6c02',
    backgroundColor: '#fff3e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 8,
  },
  addMoreInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  checkoutButton: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: myColors.primary,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutButtonDisabled: {
    backgroundColor: '#ccc',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveryRadiusContainer: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 18,
    backgroundColor: '#e1f5fe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deliveryRadiusText: {
    fontSize: 14,
    color: '#01579b',
    fontWeight: '500',
  },
});

export default Cart;
