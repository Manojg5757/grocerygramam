import { View, Image, StyleSheet } from 'react-native';
import React from 'react';
import Logo from '../../assets/logo.png';
import StockClearance from "../../assets/stockclearance.jpg"

const HomeIcon = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={Logo} />
      <Image style={styles.logo} source={StockClearance}  />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,  // optional spacing inside container
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,  // no need to use 100, just half of width/height
  },
});

export default HomeIcon;
