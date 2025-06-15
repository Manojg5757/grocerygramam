import React, { useEffect } from "react";
import { StyleSheet, Text, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import StockClearance from "../../assets/stockclearancebanner.png";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const HomeAnimation = () => {
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    // Animate text fade and vertical slide loop
    textOpacity.value = withRepeat(
      withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    textTranslateY.value = withRepeat(
      withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    // Animated sequence for image moving around the container edges in loop
    const sideDuration = 1500;
    const pauseDuration = 300;

    const horizontalDistance = screenWidth * 0.8; // adjust margins a bit inside screen
    const verticalDistance = 150; // vertical movement within container area

    translateX.value = withRepeat(
      withSequence(
        // From center to right
        withTiming(horizontalDistance / 2, { duration: sideDuration, easing: Easing.inOut(Easing.ease) }),
        // Pause
        withDelay(pauseDuration, withTiming(horizontalDistance / 2, { duration: 0 })),
        // Move to center
        withTiming(0, { duration: sideDuration, easing: Easing.inOut(Easing.ease) }),

        // From center to left
        withTiming(-horizontalDistance / 2, { duration: sideDuration, easing: Easing.inOut(Easing.ease) }),
        // Pause
        withDelay(pauseDuration, withTiming(-horizontalDistance / 2, { duration: 0 })),
        // Back to center
        withTiming(0, { duration: sideDuration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    translateY.value = withRepeat(
      withSequence(
        // Pause while X moves right & left
        withDelay(sideDuration * 2 + pauseDuration * 2, withTiming(0, { duration: 0 })),
        // From center to down
        withTiming(verticalDistance / 2, { duration: sideDuration, easing: Easing.inOut(Easing.ease) }),
        // Pause
        withDelay(pauseDuration, withTiming(verticalDistance / 2, { duration: 0 })),
        // Back to center
        withTiming(0, { duration: sideDuration, easing: Easing.inOut(Easing.ease) }),

        // From center to top
        withTiming(-verticalDistance / 2, { duration: sideDuration, easing: Easing.inOut(Easing.ease) }),
        // Pause
        withDelay(pauseDuration, withTiming(-verticalDistance / 2, { duration: 0 })),
        // Back to center
        withTiming(0, { duration: sideDuration, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.container]}>
      <Animated.Text style={[styles.text, textAnimatedStyle]}>
        HomeAnimation
      </Animated.Text>
      <Animated.Image
        source={StockClearance}
        style={[styles.image, imageAnimatedStyle]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    overflow: "hidden",
  },
  text: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 20,
    zIndex: 10,
  },
  image: {
    position: "absolute",
    height: 80,
    width: 80,
  },
});

export default HomeAnimation;
