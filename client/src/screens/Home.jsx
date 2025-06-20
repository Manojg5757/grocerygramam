import React, { useCallback } from "react";
import { StatusBar, FlatList, View, BackHandler, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeIcon from "../components/HomeIcon";
import HomeBanner from "../components/HomeBanner";
import Categories from "../components/Categories";
import { getPermissionAndSaveToken } from "../firebasepush/FirebasePermission";
import { fetchUserData, loadUserDataFromStorage } from "../../Redux/UserSlice";
import { useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { myColors } from "../Utils/MyColors";
import EyeCatchingSlidingBanner from "../components/EyeCatchingSlidingBanner";

const Home = () => {
  const dispatch = useDispatch();
  const banners = [
    {
      title: "Grocery Products at Low Prices!",
      subtitle: "Fresh fruits, vegetables, and more at unbeatable prices.",
      buttonText: "Shop Now",
      gradientColors: ["#FF6B6B", "#FF8E53"],
      page:"Products"
    },
    {
      title: "Stock Clearance Sale!",
      subtitle: "Very low prices on selected items.",
      buttonText: "Get the Deal",
      gradientColors: ["#6C63FF", "#4ECDC4"],
      page:"StockClearance"
    },
  ];

  const renderHeader = () => (
    <View>
      <HomeIcon />
      <HomeBanner />
      <EyeCatchingSlidingBanner banners={banners} />
     
    </View>
  );

  useFocusEffect(
    useCallback(() => {
      getPermissionAndSaveToken();
      dispatch(loadUserDataFromStorage()).then(() => {
        dispatch(fetchUserData());
      });

      const backAction = () => {
        Alert.alert("Exit App", "Do you want to exit?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      // Cleanup when unfocused
      return () => backHandler.remove();
    }, [dispatch])
  );

  return (
    <SafeAreaView
      style={{
        paddingHorizontal: 20,
        paddingTop: 10,
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <StatusBar hidden={true} />

      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={() => null}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={<Categories />}
        contentContainerStyle={{ flexGrow: 1 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Home;
