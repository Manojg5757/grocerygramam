import { View, Text, Animated, Easing, Image } from "react-native";
import React, { useEffect, useRef } from "react";
import { myColors } from "../Utils/MyColors";
import Logo from "../../assets/logo.png";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Splash = () => {
  const nav = useNavigation();

  // Animation values
  const logoTranslateX = useRef(new Animated.Value(-150)).current; // from left
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(50)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  const subTextTranslateY = useRef(new Animated.Value(100)).current; // from bottom
  const subTextOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo sliding in from left
    Animated.parallel([
      Animated.timing(logoTranslateX, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate main text
    Animated.parallel([
      Animated.timing(textSlide, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate subtext "Online Groceries"
    Animated.parallel([
      Animated.timing(subTextTranslateY, {
        toValue: -15,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        delay: 800,
        useNativeDriver: true,
      }),
      Animated.timing(subTextOpacity, {
        toValue: 1,
        duration: 1000,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const timeout = setTimeout(() => {
      checkLoginStatus();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (userToken) {
        nav.replace("Main");
      } else {
        nav.replace("UserName");
      }
    } catch (error) {
      console.error("Error checking login status:", error);
      nav.replace("UserName");
    }
  };

  return (
    <View
      style={{
        backgroundColor: myColors.primary,
        flex: 1,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Animated.Image
          source={Logo}
          style={{
            height: 75,
            width: 75,
            borderRadius: 100,
            marginRight: 10,
            opacity: logoOpacity,
            transform: [{ translateX: logoTranslateX }],
          }}
        />
        <Animated.View
          style={{
            transform: [{ translateY: textSlide }],
            opacity: textOpacity,
          }}
        >
          <Text style={{ fontSize: 55, color: myColors.secondary }}>
            GGramam
          </Text>
          <Animated.Text
            style={{
              textAlign: "center",
              color: myColors.secondary,
              fontSize: 17,
              letterSpacing: 5,
              transform: [{ translateY: subTextTranslateY }],
              opacity: subTextOpacity,
            }}
          >
            Online Groceries
          </Animated.Text>
        </Animated.View>
      </View>
    </View>
  );
};

export default Splash;
