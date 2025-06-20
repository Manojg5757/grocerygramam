import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Dimensions,
  ScrollView,
  Modal,
} from "react-native";
import {
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { checkAndFetchProducts } from "../../Redux/ProductSlice";
import { addToCart } from "../../Redux/CartSlice";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { myColors } from "../Utils/MyColors";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Image } from "expo-image";
import Animated, { FadeInUp, FadeInLeft } from "react-native-reanimated";
import { category } from "../../data.js";

const { width: screenWidth } = Dimensions.get("window");

export default function Products() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const route = useRoute();
  const nav = useNavigation();
  const dispatch = useDispatch();
  const { data: products, loading } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name"); // name, price_low, price_high, newest
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFeatured, setShowFeatured] = useState(true);

  // Advanced filter states
  const [showOnlyFeatured, setShowOnlyFeatured] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // Price range input states
  const [priceMinInput, setPriceMinInput] = useState(priceRange[0].toString());
  const [priceMaxInput, setPriceMaxInput] = useState(priceRange[1].toString());

  const flatListRef = useRef();

  const H_PAD = 10 * 2;
  const MARGIN_H = 10;
  const NUM_COL = 2;
  const tileWidth = (screenWidth - H_PAD - MARGIN_H * NUM_COL) / NUM_COL;

  useEffect(() => {
    dispatch(checkAndFetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (route.params?.categoryId) {
      setSelectedCategory(route.params.categoryId);
      setSelectedCategoryName(route.params.name);
    } else {
      setSelectedCategory(null);
      setSelectedCategoryName(null);
    }
  }, [route.params]);

  // Get featured products
  const featuredProducts = products.filter(
    (p) => p.featured === true && !p.stock_clearance
  );

  // Filter products
  let filtered = selectedCategory
    ? products.filter((p) => p.categoryId === selectedCategory && !p.stock_clearance)
    : products.filter((p) => !p.stock_clearance);

  if (searchTerm.trim() !== "") {
    const searchText = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (Array.isArray(p.tags) &&
          p.tags.some((tag) => {
            const tagLower = tag.toLowerCase();
            const isLatin = /^[a-z\s]+$/.test(tagLower);
            if (isLatin) {
              const regex = new RegExp(`\\b${searchText}`, "i");
              return regex.test(tagLower);
            } else {
              return tagLower.startsWith(searchText);
            }
          })) ||
        p[`name_${lang}`]?.toLowerCase().includes(searchText)
    );
  }

  filtered = filtered.filter((p) => {
    const price = Number(p.offer_price);
    const min = Number(priceRange[0]);
    const max = Number(priceRange[1]);
    if (isNaN(price) || isNaN(min) || isNaN(max)) return true;
    return price >= min && price <= max;
  });

  if (showOnlyFeatured) {
    filtered = filtered.filter((p) => p.featured);
  }
  if (showInStockOnly) {
    filtered = filtered.filter((p) => p.stock > 0);
  }

  filtered.sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.offer_price - b.offer_price;
      case "price_high":
        return b.offer_price - a.offer_price;
      case "newest":
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      default:
        return a[`name_${lang}`]?.localeCompare(b[`name_${lang}`]) || 0;
    }
  });

  const handleAddToCart = (product) => {
    if (!cartItems.some((item) => item.id === product.id)) {
      dispatch(addToCart(product));
    }
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedCategoryName(null);
    setSortBy("name");
    setPriceRange([0, 1000]);
    setPriceMinInput("0");
    setPriceMaxInput("1000");
    setShowOnlyFeatured(false);
    setShowInStockOnly(false);
  };

  const onApplyPriceRange = () => {
    let min = parseInt(priceMinInput, 10);
    let max = parseInt(priceMaxInput, 10);
    if (isNaN(min) || min < 0) min = 0;
    if (isNaN(max) || max < min) max = min;
    setPriceRange([min, max]);
  };

  const renderProductCard = ({ item, index }) => {
    const isInCart = cartItems.some((ci) => ci.id === item.id);
    const discountPercent = item.mrp && item.offer_price 
      ? Math.round(((item.mrp - item.offer_price) / item.mrp) * 100) 
      : 0;

    return (
      <Animated.View entering={FadeInUp.delay(index * 80).springify()}>
        <TouchableOpacity
          onPress={() => nav.navigate("ProductDetails", { productId: item.id })}
          style={{
            width: tileWidth,
            backgroundColor: "#fff",
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
            ...(Platform.OS === "ios"
              ? {
                  shadowColor: "#000",
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                }
              : { elevation: 3 }),
            position: "relative",
          }}
          activeOpacity={0.9}
        >
          {item.featured && (
            <View style={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "#FFD700",
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 10,
              zIndex: 10,
            }}>
              <Text style={{ fontSize: 10, fontWeight: "bold", color: "#000" }}>{t("Featured")}</Text>
            </View>
          )}

          {discountPercent > 0 && (
            <View style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "#FF4444",
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 10,
              zIndex: 10,
            }}>
              <Text style={{ fontSize: 10, fontWeight: "bold", color: "#fff" }}>
                {discountPercent}% {t("OFF")}
              </Text>
            </View>
          )}

          <Image
            source={item.icon}
            style={{ width: "100%", aspectRatio: 1, borderRadius: 8 }}
            contentFit="cover"
            accessible
            accessibilityLabel={item[`name_${lang}`]}
          />

          <View style={{ height: 50 }}>
            <Text
              style={{ fontSize: 16, fontWeight: "bold", marginTop: 5, color: "black" }}
              numberOfLines={2}
              ellipsizeMode="tail"
              accessibilityRole="header"
            >
              {item[`name_${lang}`]}
            </Text>
          </View>

          <Text style={{ fontSize: 14, color: "gray", marginTop: 3 }} accessibilityRole="text">
            {item.net_weight} {t(item.volume_type)}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Text style={{ fontWeight: "bold", fontSize: 20, color: "black" }} accessibilityRole="text">
              ₹{item.offer_price}
            </Text>
            {item.mrp > item.offer_price && (
              <Text style={{ textDecorationLine: "line-through", color: "gray", marginLeft: 8 }} accessibilityRole="text">
                ₹{item.mrp}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={{ marginTop: 8, backgroundColor: isInCart ? "#ccc" : myColors.primary, paddingVertical: 8, borderRadius: 5 }}
            onPress={() => handleAddToCart(item)}
            disabled={isInCart}
            accessibilityRole="button"
            accessibilityState={{ disabled: isInCart }}
            accessibilityLabel={isInCart ? t("Already Added") : t("Add to Cart")}
          >
            <Text style={{ color: "white", fontSize: 14, textAlign: "center" }}>
              {isInCart ? t("Already Added") : t("Add to Cart")}
            </Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderFeaturedProducts = () => {
    if (!showFeatured || featuredProducts.length === 0) return null;

    return (
      <View style={{ marginBottom: 20 }} accessible accessibilityLabel={t("Featured Products")}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: myColors.primary, marginBottom: 10 }}>
          ⭐ {t("Featured Products")}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }}>
          {featuredProducts.slice(0, 5).map((item, index) => {
            const isInCart = cartItems.some((ci) => ci.id === item.id);
            return (
              <Animated.View key={item.id} entering={FadeInLeft.delay(index * 100).springify()}>
                <TouchableOpacity
                  onPress={() => nav.navigate("ProductDetails", { productId: item.id })}
                  style={{
                    width: 160,
                    backgroundColor: "#fff",
                    borderRadius: 12,
                    padding: 10,
                    marginRight: 10,
                    ...(Platform.OS === "ios"
                      ? {
                          shadowColor: "#000",
                          shadowOpacity: 0.1,
                          shadowRadius: 6,
                          shadowOffset: { width: 0, height: 2 },
                        }
                      : { elevation: 3 }),
                  }}
                  activeOpacity={0.9}
                  accessibilityRole="button"
                >
                  <Image source={item.icon} style={{ width: "100%", height: 120, borderRadius: 8 }} contentFit="cover" accessible accessibilityLabel={item[`name_${lang}`]} />
                  <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 5, color: "black", height: 35 }} numberOfLines={2} accessibilityRole="header">
                    {item[`name_${lang}`]}
                  </Text>
                  <View style={{ flexDirection: 'row', marginTop: 2, alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: "gray" }} accessibilityRole="text">
                      {item.net_weight} {t(item.volume_type)}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: "bold", color: myColors.primary }} accessibilityRole="text">
                    ₹{item.offer_price}
                  </Text>
                  <TouchableOpacity
                    style={{ marginTop: 5, backgroundColor: isInCart ? "#ccc" : myColors.primary, paddingVertical: 6, borderRadius: 5 }}
                    onPress={() => handleAddToCart(item)}
                    disabled={isInCart}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: isInCart }}
                    accessibilityLabel={isInCart ? t("Already Added") : t("Add to Cart")}
                  >
                    <Text style={{ color: "white", fontSize: 12, textAlign: "center" }}>
                      {isInCart ? t("Already Added") : t("Add to Cart")}
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderFilterModal = () => (
    <Modal visible={showFilters} animationType="slide" transparent={true} onRequestClose={() => setShowFilters(false)}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
        <View style={{ backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "80%" }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }} accessibilityRole="header">{t("Filters & Sort")}</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)} accessibilityRole="button" accessibilityLabel={t("Close Filters")}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Sort Options */}
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "black" }} accessibilityRole="header">{t("Sort By")}</Text>
            {[
              { key: "name", label: "Name" },
              { key: "price_low", label: "Price: Low to High" },
              { key: "price_high", label: "Price: High to Low" },
              { key: "newest", label: "Newest First" },
            ].map((option) => (
              <TouchableOpacity key={option.key} onPress={() => setSortBy(option.key)} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}
                accessibilityRole="radio"
                accessibilityState={{ selected: sortBy === option.key }}
                accessibilityLabel={t(option.label)}
              >
                <View style={{
                  width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: myColors.primary,
                  marginRight: 10, backgroundColor: sortBy === option.key ? myColors.primary : "transparent",
                }} />
                <Text style={{ color: "black" }}>{t(option.label)}</Text>
              </TouchableOpacity>
            ))}

            {/* Price Range */}
            <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 10, color: "black" }} accessibilityRole="header">{t("Price Range")}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 12 }}>
              <TextInput
                style={{
                  flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 12,
                  paddingVertical: Platform.OS === "ios" ? 12 : 8, fontSize: 14, color: "black", backgroundColor: "#fafafa",
                }}
                keyboardType="numeric"
                value={priceMinInput}
                onChangeText={setPriceMinInput}
                placeholder="Min"
                placeholderTextColor="#999"
                accessibilityLabel={t("Minimum price")}
                returnKeyType="done"
                onEndEditing={onApplyPriceRange}
                blurOnSubmit={true}
              />
              <Text style={{ fontSize: 16, fontWeight: "bold", marginHorizontal: 8 }}>-</Text>
              <TextInput
                style={{
                  flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 12,
                  paddingVertical: Platform.OS === "ios" ? 12 : 8, fontSize: 14, color: "black", backgroundColor: "#fafafa",
                }}
                keyboardType="numeric"
                value={priceMaxInput}
                onChangeText={setPriceMaxInput}
                placeholder="Max"
                placeholderTextColor="#999"
                accessibilityLabel={t("Maximum price")}
                returnKeyType="done"
                onEndEditing={onApplyPriceRange}
                blurOnSubmit={true}
              />
            </View>

            {/* Advanced Options */}
            <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 10, color: "black" }} accessibilityRole="header">{t("Advanced Options")}</Text>
            <TouchableOpacity onPress={() => setShowOnlyFeatured(!showOnlyFeatured)} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: showOnlyFeatured }}
              accessibilityLabel={t("Show Only Featured Products")}
            >
              <View style={{
                width: 20, height: 20, borderRadius: 10, borderWidth: 2,
                borderColor: myColors.primary, marginRight: 10,
                backgroundColor: showOnlyFeatured ? myColors.primary : "transparent",
              }} />
              <Text style={{ color: "black" }}>{t("Show Only Featured Products")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowInStockOnly(!showInStockOnly)} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 10 }}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: showInStockOnly }}
              accessibilityLabel={t("Show In-Stock Products Only")}
            >
              <View style={{
                width: 20, height: 20, borderRadius: 10, borderWidth: 2,
                borderColor: myColors.primary, marginRight: 10,
                backgroundColor: showInStockOnly ? myColors.primary : "transparent",
              }} />
              <Text style={{ color: "black" }}>{t("Show In-Stock Products Only")}</Text>
            </TouchableOpacity>

            {/* Categories Filter */}
            <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 20, marginBottom: 10, color: "black" }} accessibilityRole="header">{t("Categories")}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity onPress={() => { setSelectedCategory(null); setSelectedCategoryName(null); }} style={{
                paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20,
                backgroundColor: !selectedCategory ? myColors.primary : "#f0f0f0",
                marginRight: 10,
              }}
                accessibilityRole="radio"
                accessibilityState={{ selected: !selectedCategory }}
              >
                <Text style={{ color: !selectedCategory ? "white" : "black", fontSize: 12 }}>{t("All")}</Text>
              </TouchableOpacity>
              {category.map((cat) => (
                <TouchableOpacity key={cat.categoryId} onPress={() => { setSelectedCategory(cat.categoryId); setSelectedCategoryName(cat[`name_${lang}`]); }} style={{
                  paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20,
                  backgroundColor: selectedCategory === cat.categoryId ? myColors.primary : "#f0f0f0",
                  marginRight: 10,
                }}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: selectedCategory === cat.categoryId }}
                >
                  <Text style={{ color: selectedCategory === cat.categoryId ? "white" : "black", fontSize: 12 }}>{cat[`name_${lang}`]}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Clear Filters */}
            <TouchableOpacity onPress={clearAllFilters} style={{ backgroundColor: "#FF4444", paddingVertical: 12, borderRadius: 8, marginTop: 20, alignItems: "center" }}
              accessibilityRole="button" accessibilityLabel={t("Clear All Filters")}>
              <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{t("Clear All Filters")}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={myColors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, backgroundColor: "#f9f9f9" }}>
          <Text
            style={{ marginTop: 20, fontSize: 24, fontWeight: "bold", marginBottom: 10, color: myColors.primary, textAlign: "center" }}
            accessibilityRole="header"
          >
            {t("All Products")}
          </Text>

          {/* Search Bar */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 14,
              paddingVertical: Platform.OS === "ios" ? 12 : 8,
              marginBottom: 10,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 3 },
              elevation: 4,
            }}
          >
            <FontAwesome name="search" size={20} color="black" />
            <TextInput
              placeholder={t("Search products...")}
              placeholderTextColor="black"
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={{ flex: 1, marginHorizontal: 12, fontSize: 16, color: "black", minHeight: 40 }}
              accessible
              accessibilityLabel={t("Search products")}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm("")} accessibilityRole="button" accessibilityLabel={t("Clear search text")}>
                <MaterialIcons name="highlight-remove" size={24} color="black" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setShowFilters(true)} style={{ marginLeft: 14 }} accessibilityRole="button" accessibilityLabel={t("Open filters")}>
              <Ionicons name="filter" size={28} color={myColors.primary} />
            </TouchableOpacity>
          </View>

          {/* Active Filters Below Search Bar */}
          <View style={{ marginBottom: 10 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 2 }}>
              {selectedCategory && (
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: myColors.primary,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 20,
                    marginRight: 10,
                    alignItems: "center",
                    shadowColor: myColors.primary,
                    shadowOpacity: 0.4,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 3 },
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={`${t("Category")}: ${selectedCategoryName}, ${t("Tap to remove")}`}
                >
                  <Text style={{ fontSize: 14, color: "white", marginRight: 6, fontWeight: "600" }}>{selectedCategoryName}</Text>
                  <TouchableOpacity onPress={() => { setSelectedCategory(null); setSelectedCategoryName(null); }} accessibilityRole="button" accessibilityLabel={t("Remove category filter")}>
                    <MaterialIcons name="close" size={18} color="white" />
                  </TouchableOpacity>
                </View>
              )}

              {sortBy !== "name" && (
                <View
                  style={{
                    backgroundColor: "#666",
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 20,
                    marginRight: 10,
                    justifyContent: "center",
                  }}
                  accessibilityRole="text"
                >
                  <Text style={{ fontSize: 14, color: "white", fontWeight: "600" }}>
                    {t("Sorted by")}: {sortBy.replace("_", " ")}
                  </Text>
                </View>
              )}

              {showOnlyFeatured && (
                <View
                  style={{
                    backgroundColor: myColors.primary,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 20,
                    marginRight: 10,
                    justifyContent: "center",
                  }}
                  accessibilityRole="text"
                >
                  <Text style={{ fontSize: 14, color: "white", fontWeight: "600" }}>{t("Featured Only")}</Text>
                </View>
              )}

              {showInStockOnly && (
                <View
                  style={{
                    backgroundColor: myColors.primary,
                    paddingHorizontal: 14,
                    paddingVertical: 6,
                    borderRadius: 20,
                    marginRight: 10,
                    justifyContent: "center",
                  }}
                  accessibilityRole="text"
                >
                  <Text style={{ fontSize: 14, color: "white", fontWeight: "600" }}>{t("In Stock Only")}</Text>
                </View>
              )}
            </ScrollView>
          </View>

          {/* Main Content Scroll: Includes Featured Products + Product List */}
          <FlatList
            ref={flatListRef}
            data={filtered}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            numColumns={NUM_COL}
            keyboardShouldPersistTaps="handled"
            columnWrapperStyle={{ justifyContent: "space-between" }}
            renderItem={renderProductCard}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListHeaderComponent={
              <>
                {renderFeaturedProducts()}
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginBottom: 10,
                    color: "black",
                    textAlign: "center",
                  }}
                  accessibilityRole="text"
                >
                  {filtered.length} {t("Products Found")}
                </Text>
              </>
            }
            ListEmptyComponent={
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center", marginTop: 40 }} accessible accessibilityRole="alert" accessibilityLabel={t("No products found")}>
                <MaterialIcons name="search-off" size={72} color="#ccc" />
                <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16, color: "black", maxWidth: 280 }}>{t("No products found.")}</Text>
                <TouchableOpacity onPress={clearAllFilters} style={{
                  backgroundColor: myColors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8,
                  marginTop: 16, shadowColor: myColors.primary, shadowOpacity: 0.35, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
                }} accessibilityRole="button" accessibilityLabel={t("Clear Filters")}>
                  <Text style={{ color: "white", fontWeight: "bold", fontSize: 16, textAlign: "center" }}>{t("Clear Filters")}</Text>
                </TouchableOpacity>
              </View>
            }
          />

          {/* Filter Modal */}
          {renderFilterModal()}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// Implement the renderFilterModal function here (same as previous responses)
function renderFilterModal() {
  // copy the previous renderFilterModal implementation here exactly
}
