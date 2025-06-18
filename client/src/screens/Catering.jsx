import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  Dimensions, 
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Linking,
  Alert
} from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { myColors } from '../Utils/MyColors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

const { width, height } = Dimensions.get('window');
const cardWidth = (width - 45) / 2;

const Catering = () => {
  const [catering, setCatering] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Phone number for catering service
  const CATERING_PHONE = "+919876543210"; // Replace with actual phone number

  const handleCallPress = () => {
    const phoneUrl = `tel:${CATERING_PHONE}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneUrl);
        } else {
          Alert.alert("Error", "Phone calls are not supported on this device");
        }
      })
      .catch((err) => {
        console.error('Error opening dialer:', err);
        Alert.alert("Error", "Unable to open dialer");
      });
  };

  useEffect(() => {
    const fetchCatering = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "catering"));
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        setCatering(items);
      } catch (error) {
        console.error("Error fetching catering:", error);
        Alert.alert(
          "Error",
          "Unable to load catering menu. Please try again later."
        );
      }
      setLoading(false);
    };
    fetchCatering();
  }, []);

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#FF6B35', '#F7931E', '#FFD23F']}
        style={styles.heroGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.heroContent}>
          {/* Top Badge */}
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>⭐ PREMIUM CATERING ⭐</Text>
          </View>
          
          <Text style={styles.mainTitle}>Sri Sakthi Catering</Text>
          <Text style={styles.subtitle}>Traditional Flavors • Modern Service</Text>
          
          {/* Feature highlights */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🍽️</Text>
              <Text style={styles.featureText}>Authentic Recipes</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>👨‍🍳</Text>
              <Text style={styles.featureText}>Expert Chefs</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚚</Text>
              <Text style={styles.featureText}>Fresh Delivery</Text>
            </View>
          </View>

          {/* Call to Action */}
          <TouchableOpacity 
            style={styles.heroCallButton}
            onPress={handleCallPress}
            activeOpacity={0.8}
          >
            <View style={styles.callButtonContent}>
              <Text style={styles.callButtonIcon}>📞</Text>
              <View>
                <Text style={styles.callButtonText}>Call Now for Orders</Text>
                <Text style={styles.callButtonSubtext}>Available 24/7</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.comingSoonBadge}>
            <Text style={styles.badgeText}>🔥 Online Orders Coming Soon</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Banner Image with Overlay */}
      <View style={styles.bannerContainer}>
        <Image
          source={{
            uri: 'https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fcateringbannertwo.png?alt=media&token=8dcac0d6-3edb-435d-811d-0a30fc45ebfa',
          }}
          style={styles.bannerImage}
          contentFit="cover"
          transition={500}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.imageOverlay}
        />
      </View>

      {/* Menu Section Header */}
      <View style={styles.menuHeader}>
        <Text style={styles.menuTitle}>Our Specialties</Text>
        <Text style={styles.menuSubtitle}>Crafted with love, served with pride</Text>
      </View>
    </View>
  );

  const renderCateringCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.icon }}
            style={styles.cardImage}
            contentFit="cover"
            transition={300}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.1)']}
            style={styles.cardImageOverlay}
          />
        </View>

        {/* Content Container */}
        <View style={styles.cardContent}>
          <Text style={styles.itemNameTamil} numberOfLines={1}>
            {item.itemNameTamil}
          </Text>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.itemName}
          </Text>
          
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Starting from</Text>
            <Text style={styles.price}>₹{item.price}/{item.type}</Text>
          </View>
          
          <View style={styles.minOrderContainer}>
            <View style={styles.minOrderBadge}>
              <Text style={styles.minOrderText}>Min: {item.minOrder}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LinearGradient
          colors={['#FF5722', '#FFC107']}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading delicious options...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#FF5722" />
      <View style={styles.mainContent}>
        <FlatList
          data={catering}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={styles.row}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          renderItem={renderCateringCard}
        />
      </View>
      
      {/* Fixed Bottom Call Button */}
      <View style={styles.bottomCallContainer}>
        <TouchableOpacity 
          style={styles.bottomCallButton}
          onPress={handleCallPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF6B35', '#F7931E']}
            style={styles.bottomCallGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.bottomCallIcon}>📞</Text>
            <Text style={styles.bottomCallText}>Call Now - Quick Orders</Text>
            <Text style={styles.bottomCallNumber}>{CATERING_PHONE}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  mainContent: {
    flex: 1,
  },
  headerContainer: {
    marginBottom: 20,
  },
  heroGradient: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroContent: {
    alignItems: 'center',
  },
  premiumBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  premiumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF9C4',
    textAlign: 'center',
    marginBottom: 25,
    fontWeight: '500',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 25,
    paddingHorizontal: 10,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  heroCallButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  callButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  callButtonSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomCallContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomCallButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  bottomCallGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  bottomCallIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  bottomCallText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  bottomCallNumber: {
    color: '#FFF9C4',
    fontSize: 14,
    fontWeight: '500',
  },
  bannerContainer: {
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  bannerImage: {
    width: '100%',
    height: width * 0.55,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  menuHeader: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 10,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: myColors.primary || '#FF5722',
    textAlign: 'center',
    marginBottom: 5,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 120, // Extra space for bottom call button
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardContainer: {
    width: cardWidth,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: cardWidth * 0.8,
  },
  cardImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
  },
  cardContent: {
    padding: 15,
  },
  itemNameTamil: {
    fontSize: 16,
    fontWeight: 'bold',
    color: myColors.primary || '#FF5722',
    textAlign: 'center',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  minOrderContainer: {
    alignItems: 'center',
  },
  minOrderBadge: {
    backgroundColor: 'rgba(255, 87, 34, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 87, 34, 0.2)',
  },
  minOrderText: {
    fontSize: 11,
    color: '#FF5722',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 15,
    fontWeight: '500',
  },
});

export default Catering;