import React, { useState, useRef, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import FastImage from "react-native-fast-image";

const { width: screenWidth } = Dimensions.get("window");
const BANNER_RATIO = 16 / 9;
const bannerHeight = screenWidth / BANNER_RATIO;

const HomeBannerSlider = () => {
  const nav = useNavigation();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const banners = [
    {
      id: "1",
      uri:
        lang === "ta"
          ? "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2FhomebannerTamil.png?alt=media&token=52cebd0e-6f6c-4d9e-95f8-41cce4f85b7d"
          : "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fcateringbannerone.png?alt=media&token=5a377d40-6f85-4a24-90be-d4c12c17ff4f",
      screen: "Catering",
    },
    {
      id: "2",
      uri:
        "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2FhomebannerTamil.png?alt=media&token=52cebd0e-6f6c-4d9e-95f8-41cce4f85b7d",
      screen: "Catering",
    },
  ];

  const [loadingIds, setLoadingIds] = useState([]);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePress = (screen) => {
    nav.navigate(screen);
  };

  const handleLoadStart = (id) => {
    setLoadingIds((prev) => [...prev, id]);
  };

  const handleLoadEnd = (id) => {
    setLoadingIds((prev) => prev.filter((item) => item !== id));
  };

  const scrollToNext = () => {
    const nextIndex = (currentIndex + 1) % banners.length;
    flatListRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });
    setCurrentIndex(nextIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scrollToNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]); // depends on currentIndex to always move to next

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item.screen)}
      activeOpacity={0.9}
      style={styles.bannerWrapper}
    >
      {loadingIds.includes(item.id) && (
        <ActivityIndicator style={styles.loader} size="large" color="#999" />
      )}
      <FastImage
        style={styles.image}
        source={{
          uri: item.uri,
          priority: FastImage.priority.high,
          cache: FastImage.cacheControl.immutable,
        }}
        resizeMode={FastImage.resizeMode.cover}
        onLoadStart={() => handleLoadStart(item.id)}
        onLoadEnd={() => handleLoadEnd(item.id)}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        style={{ width: screenWidth }}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x / screenWidth
          );
          setCurrentIndex(index);
        }}
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />

      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    height: bannerHeight,
    backgroundColor: "#fff",
  },
  bannerWrapper: {
    width: screenWidth,
    height: bannerHeight,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: bannerHeight,
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -20,
    zIndex: 1,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#333",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default HomeBannerSlider;
