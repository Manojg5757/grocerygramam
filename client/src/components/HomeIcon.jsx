import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import React from 'react';
import Logo from '../../assets/logo.png';
import StockClearance from "../../assets/stockclearancebanner.png"
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const HomeIcon = () => {
  const nav = useNavigation()
  
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={Logo} />
      </View>
      
      {/* Attractive center element */}
      <TouchableOpacity 
  style={styles.centerElement} 
  onPress={() => nav.navigate('Products')}
  activeOpacity={0.7}
>
  <Ionicons name="sparkles" size={12} color="#FFD700" />
  <Text style={styles.centerText}>Sale Open</Text>
</TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.stockContainer}
        onPress={() => nav.navigate('StockClearance')}
        activeOpacity={0.8}
      >
        <Image style={styles.stock} source={StockClearance} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>HOT</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  logoContainer: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 3,
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  centerElement: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8f4fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#b3d9ff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  centerText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1976d2',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  stockContainer: {
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  stock: {
    width: 45,
    height: 45,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4757',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
});

export default HomeIcon;