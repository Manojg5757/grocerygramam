import React from "react";
import { StatusBar, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeIcon from "../components/HomeIcon";
import HomeBanner from "../components/HomeBanner";
import Categories from "../components/Categories";

const Home = () => {
  // Combine the static components (banner, icon, etc.) into the ListHeaderComponent
  const renderHeader = () => (
    <View>
      <HomeIcon />
      <HomeBanner />
    </View>
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
      
      {/* Use FlatList for entire screen content */}
      <FlatList
        data={[]}
        keyExtractor={(item, index) => index.toString()} // Dummy key extractor for header
        renderItem={() => null} // No actual items to render, we're just using FlatList for layout
        ListHeaderComponent={renderHeader} // Static components (icon, banner)
        ListFooterComponent={<Categories />} // Scrollable component (Categories)
        contentContainerStyle={{ flexGrow: 1 }} // Ensures content takes up full height
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default Home;
