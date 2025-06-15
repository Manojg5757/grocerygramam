import React, { useState, useEffect, useRef } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const { width: screenWidth } = Dimensions.get("window");
const BANNER_RATIO = 16 / 9;
const bannerHeight = screenWidth / BANNER_RATIO;

const HomeBannerSlider = () => {
  const nav = useNavigation();
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const [banners, setBanners] = useState([]);
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchBanners = async () => {
    try {
      console.log("📡 Fetching banners...");
      const querySnapshot = await getDocs(collection(db, "homeBannerSlider"));
      const bannersData = [];
      querySnapshot.forEach((doc) => {
        bannersData.push({ id: doc.id, ...doc.data() });
      });
      console.log("🔥 Fetched banners:", bannersData);
      setBanners(bannersData);
    } catch (error) {
      console.error("❌ Firestore error:", error);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handlePress = (item) => {
    const knownScreens = ["Catering", "Inspiration"];
    if (item.screen && knownScreens.includes(item.screen)) {
      nav.navigate(item.screen);
    } else {
      // navigate to generic screen with item data
      nav.navigate("CustomScreen", item);
    }
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
      if (banners.length > 0) scrollToNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, banners]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      activeOpacity={0.9}
      style={styles.bannerWrapper}
    >
      <Image
        style={styles.image}
        source={{
          uri: lang === "ta" ? item.uri_ta || item.uri : item.uri_en || item.uri,
        }}
        contentFit="contain"
      />
    </TouchableOpacity>
  );

  if (banners.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

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
          const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
          setCurrentIndex(index);
        }}
        getItemLayout={(_, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />
      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    height: bannerHeight,
  },
  loaderContainer: {
    height: bannerHeight,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
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
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  pagination: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "black",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "white",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default HomeBannerSlider;





// import React, { useState, useRef, useEffect } from "react";
// import {
//   View,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Dimensions,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { useTranslation } from "react-i18next";
// import { Image } from "expo-image"; // 👈 expo-image here

// const { width: screenWidth } = Dimensions.get("window");
// const BANNER_RATIO = 16 / 9;
// const bannerHeight = screenWidth / BANNER_RATIO;

// const HomeBannerSlider = () => {
//   const nav = useNavigation();
//   const { i18n } = useTranslation();
//   const lang = i18n.language;

//   const banners = [
//     {
//       id: "1",
//       uri:
//         lang === "ta"
//           ? "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2FhomebannerTamil.png?alt=media&token=52cebd0e-6f6c-4d9e-95f8-41cce4f85b7d"
//           : "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fcateringbannerone.png?alt=media&token=5a377d40-6f85-4a24-90be-d4c12c17ff4f",
//       screen: "Catering",
//     },
//     {
//       id: "2",
//       uri:
//         "https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fhomebanner.png?alt=media&token=21bd03a9-f4cc-43fc-aab3-443230f71430",
//       screen: "Inspiration",
//     },
//   ];

//   const [loadingIds, setLoadingIds] = useState([]);
//   const flatListRef = useRef(null);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handlePress = (screen) => {
//     nav.navigate(screen);
//   };

//   const handleLoadStart = (id) => {
//     setLoadingIds((prev) => [...prev, id]);
//   };

//   const handleLoadEnd = (id) => {
//     setLoadingIds((prev) => prev.filter((item) => item !== id));
//   };

//   const scrollToNext = () => {
//     const nextIndex = (currentIndex + 1) % banners.length;
//     flatListRef.current?.scrollToIndex({
//       index: nextIndex,
//       animated: true,
//     });
//     setCurrentIndex(nextIndex);
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       scrollToNext();
//     }, 6000);
//     return () => clearInterval(interval);
//   }, [currentIndex]);

//   const renderItem = ({ item }) => (
//     <TouchableOpacity
//       onPress={() => handlePress(item.screen)}
//       activeOpacity={0.9}
//       style={styles.bannerWrapper}
//     >
//       {loadingIds.includes(item.id) && (
//         <ActivityIndicator style={styles.loader} size="large" color="#999" />
//       )}
//       <Image
//         style={styles.image}
//         source={{ uri: item.uri }}
//         contentFit="contain"
//         onLoadStart={() => handleLoadStart(item.id)}
//         onLoadEnd={() => handleLoadEnd(item.id)}
//       />
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <FlatList
//         ref={flatListRef}
//         data={banners}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         horizontal
//         pagingEnabled
//         bounces={false}
//         showsHorizontalScrollIndicator={false}
//         style={{ width: screenWidth }}
//         onMomentumScrollEnd={(e) => {
//           const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
//           setCurrentIndex(index);
//         }}
//         getItemLayout={(data, index) => ({
//           length: screenWidth,
//           offset: screenWidth * index,
//           index,
//         })}
//       />
//       <View style={styles.pagination}>
//         {banners.map((_, index) => (
//           <View
//             key={index}
//             style={[styles.dot, currentIndex === index && styles.activeDot]}
//           />
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: "relative",
//     borderRadius: 12,
//     overflow: "hidden",
//     height: bannerHeight,
//     backgroundColor: "red",
//   },
//   bannerWrapper: {
//     width: screenWidth,
//     height: bannerHeight,
//     overflow: "hidden",
//     backgroundColor: "#f0f0f0",
//   },
//   image: {
//     width: "100%",
//     height: bannerHeight,
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//   },
//   loader: {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     marginLeft: -20,
//     marginTop: -20,
//     zIndex: 1,
//   },
//   pagination: {
//     position: "absolute",
//     bottom: 10,
//     left: 0,
//     right: 0,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "black",
//     marginHorizontal: 4,
//   },
//   activeDot: {
//     backgroundColor: "white",
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
// });

// export default HomeBannerSlider;
