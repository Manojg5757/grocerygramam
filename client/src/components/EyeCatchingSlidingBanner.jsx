import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const bannerHeight = (width * 9) / 16; // 16:9 aspect ratio

const EyeCatchingSlidingBanner = ({ banners = [] }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const currentIndex = useRef(0);
  const nav = useNavigation()
  
  // Animation values for story elements
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!banners.length) return;

    // Banner sliding animation
    const bannerInterval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % banners.length;

      Animated.spring(scrollX, {
        toValue: currentIndex.current * width,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }, 4000);

    // Continuous story animations
    const startStoryAnimations = () => {
      // Floating animation for items
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatingAnim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatingAnim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Pulse animation for attention
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Bounce animation for playfulness
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.back(2)),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 600,
            easing: Easing.in(Easing.back(2)),
            useNativeDriver: true,
          }),
          Animated.delay(1000),
        ])
      ).start();

      // Rotation animation for dynamic feel
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 10000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Sparkle animation for magic
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.delay(800),
        ])
      ).start();

      // Wave animation for flow
      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        })
      ).start();
    };

    startStoryAnimations();

    return () => clearInterval(bannerInterval);
  }, [banners.length]);

  const renderBanners = () => {
    return banners.map((banner, index) => (
      <View key={index} style={styles.banner}>
        <LinearGradient
          colors={banner.gradientColors}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Animated Background Elements */}
        <Animated.View style={[
          styles.backgroundElement1,
          {
            transform: [
              {
                translateY: floatingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -15],
                }),
              },
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
            opacity: 0.3,
          }
        ]}>
          <Text style={styles.backgroundIcon}>💰</Text>
        </Animated.View>

        <Animated.View style={[
          styles.backgroundElement2,
          {
            transform: [
              {
                translateX: waveAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 10],
                }),
              },
            ],
            opacity: 0.4,
          }
        ]}>
          <Text style={styles.backgroundIcon}>🎯</Text>
        </Animated.View>

        {/* Main Content with Enhanced Animations */}
        <View style={styles.content}>
          <Animated.Text style={[
            styles.title,
            animatedStyle(index),
            {
              transform: [
                {
                  scale: pulseAnim.interpolate({
                    inputRange: [1, 1.2],
                    outputRange: [1, 1.05],
                  }),
                },
              ],
            }
          ]}>
            {banner.title}
          </Animated.Text>
          
          <Animated.Text style={[
            styles.subtitle,
            animatedStyle(index),
            {
              transform: [
                {
                  translateY: floatingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -5],
                  }),
                },
              ],
            }
          ]}>
            {banner.subtitle}
          </Animated.Text>
          
          <Animated.View style={{
            transform: [
              {
                scale: bounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.1],
                }),
              },
            ],
          }}>
            <TouchableOpacity style={[styles.button, {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }]} 
            onPress={()=>nav.navigate("Products")}
            >
              <Animated.Text style={[
                styles.buttonText,
                animatedStyle(index),
                {
                  transform: [
                    {
                      scale: pulseAnim.interpolate({
                        inputRange: [1, 1.2],
                        outputRange: [1, 1.02],
                      }),
                    },
                  ],
                }
              ]}>
                {banner.buttonText}
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Enhanced Shopping Cart Animation */}
        <Animated.View style={[
          styles.iconWrapperBottom,
          iconScaleStyle(index),
          {
            transform: [
              {
                scale: iconScaleStyle(index).transform[0].scale,
              },
              {
                translateY: bounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -8],
                }),
              },
              {
                rotate: floatingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['-5deg', '5deg'],
                }),
              },
            ],
          }
        ]}>
          <Text style={styles.icon}>🛒</Text>
          
          {/* Animated items flying into cart */}
          <Animated.View style={[
            styles.flyingItem,
            {
              opacity: sparkleAnim,
              transform: [
                {
                  translateX: sparkleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, 0],
                  }),
                },
                {
                  translateY: sparkleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
                {
                  scale: sparkleAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 1.5, 0.5],
                  }),
                },
              ],
            }
          ]}>
            <Text style={styles.smallIcon}>🥕</Text>
          </Animated.View>
        </Animated.View>

        {/* Enhanced Sparkle Animation */}
        <Animated.View style={[
          styles.iconWrapperTop,
          iconOpacityStyle(index),
          {
            transform: [
              {
                scale: sparkleAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.5, 1.5, 0.5],
                }),
              },
              {
                rotate: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg'],
                }),
              },
            ],
          }
        ]}>
          <Text style={styles.icon}>✨</Text>
        </Animated.View>

        {/* Multiple Sparkles for Magic Effect */}
        <Animated.View style={[
          styles.sparkle1,
          {
            opacity: sparkleAnim.interpolate({
              inputRange: [0, 0.3, 0.6, 1],
              outputRange: [0, 1, 0, 1],
            }),
            transform: [
              {
                scale: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1.2],
                }),
              },
            ],
          }
        ]}>
          <Text style={styles.smallIcon}>⭐</Text>
        </Animated.View>

        <Animated.View style={[
          styles.sparkle2,
          {
            opacity: sparkleAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 1, 0],
            }),
            transform: [
              {
                scale: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                }),
              },
            ],
          }
        ]}>
          <Text style={styles.smallIcon}>💫</Text>
        </Animated.View>

        {/* Price Drop Animation */}
        <Animated.View style={[
          styles.priceDropWrapper,
          {
            opacity: bounceAnim,
            transform: [
              {
                translateY: bounceAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-20, 0],
                }),
              },
              {
                scale: bounceAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.5, 1.2, 1],
                }),
              },
            ],
          }
        ]}>
          <Text style={styles.priceDropText}>💸</Text>
        </Animated.View>
      </View>
    ));
  };

  const animatedStyle = (index) => ({
    opacity: scrollX.interpolate({
      inputRange: [(index - 1) * width, index * width, (index + 1) * width],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        translateY: scrollX.interpolate({
          inputRange: [(index - 1) * width, index * width, (index + 1) * width],
          outputRange: [30, 0, 30],
          extrapolate: 'clamp',
        }),
      },
      {
        scale: scrollX.interpolate({
          inputRange: [(index - 1) * width, index * width, (index + 1) * width],
          outputRange: [0.8, 1, 0.8],
          extrapolate: 'clamp',
        }),
      },
    ],
  });

  const iconScaleStyle = (index) => ({
    transform: [
      {
        scale: scrollX.interpolate({
          inputRange: [(index - 1) * width, index * width, (index + 1) * width],
          outputRange: [0.6, 1.2, 0.6],
          extrapolate: 'clamp',
        }),
      },
    ],
  });

  const iconOpacityStyle = (index) => ({
    opacity: scrollX.interpolate({
      inputRange: [(index - 1) * width, index * width, (index + 1) * width],
      outputRange: [0, 1, 0],
      extrapolate: 'clamp',
    }),
  });

  const translateX = scrollX.interpolate({
    inputRange: banners.map((_, i) => i * width),
    outputRange: banners.map((_, i) => i * -width),
    extrapolate: 'clamp',
  });

  if (!banners.length) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
        {renderBanners()}
      </Animated.View>

      {/* Enhanced Indicator Dots with Animation */}
      <View style={styles.indicatorContainer}>
        {banners.map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [(index - 1) * width, index * width, (index + 1) * width],
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
          
          const scale = scrollX.interpolate({
            inputRange: [(index - 1) * width, index * width, (index + 1) * width],
            outputRange: [0.8, 1.3, 0.8],
            extrapolate: 'clamp',
          });
          
          return (
            <Animated.View 
              key={index} 
              style={[
                styles.indicator, 
                { 
                  opacity,
                  transform: [{ scale }],
                }
              ]} 
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: bannerHeight,
    overflow: 'hidden',
    borderRadius: 15,
    marginVertical: 10,
  },
  banner: {
    width: width,
    height: bannerHeight,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: 20,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 30,
    paddingVertical: 20,
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    maxWidth: '90%',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    maxWidth: '85%',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#FF6B6B',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    fontSize: 40,
  },
  smallIcon: {
    fontSize: 20,
  },
  iconWrapperBottom: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 5,
  },
  iconWrapperTop: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 5,
  },
  // Background elements for storytelling
  backgroundElement1: {
    position: 'absolute',
    top: 30,
    right: 60,
    zIndex: 1,
  },
  backgroundElement2: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    zIndex: 1,
  },
  backgroundIcon: {
    fontSize: 30,
    opacity: 0.3,
  },
  // Flying items animation
  flyingItem: {
    position: 'absolute',
    top: -15,
    left: -15,
  },
  // Sparkle positions
  sparkle1: {
    position: 'absolute',
    top: 60,
    right: 100,
    zIndex: 3,
  },
  sparkle2: {
    position: 'absolute',
    bottom: 80,
    left: 80,
    zIndex: 3,
  },
  // Price drop animation
  priceDropWrapper: {
    position: 'absolute',
    top: 40,
    right: 120,
    zIndex: 4,
  },
  priceDropText: {
    fontSize: 25,
  },
});

export default EyeCatchingSlidingBanner;