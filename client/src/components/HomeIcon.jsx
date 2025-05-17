import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import Logo from '../../assets/logo.png';
import StockClearance from "../../assets/stockclearance.jpg"
import { useNavigation } from '@react-navigation/native';

const HomeIcon = () => {
  const nav = useNavigation()
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={Logo} />
      <TouchableOpacity onPress={() => nav.navigate('StockClearance')}>
        <Image style={styles.logo} source={StockClearance} />
      </TouchableOpacity>
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
    borderWidth:1,
    borderColor:'black'
  },
});

export default HomeIcon;
