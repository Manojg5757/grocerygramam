import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomScreen = () => {
  const route = useRoute();
  const {
    uri,
    title,
    desc,
    offer,
    contact,
    location,
    buttonlabel,
    actionType,
    actionValue,
    offerValidTill,
    rating,
    services,
    tags,
    openHours,
    closedOn,
  } = route.params;
  console.log("kr pumps:",title)

  const handleAction = () => {
    if (actionType === 'call' && actionValue) {
      Linking.openURL(`tel:${actionValue}`);
    }
    // extend here for whatsapp, web link etc if needed
  };

  return (
    <SafeAreaView>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri }} style={styles.bannerImage} />
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.title}>{title}</Text>

        {offer ? <Text style={styles.offer}>{offer}</Text> : null}

        {offerValidTill ? (
          <Text style={styles.validity}>Valid till: {offerValidTill}</Text>
        ) : null}

        <Text style={styles.desc}>{desc}</Text>

        {rating ? (
          <View style={styles.ratingBox}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.ratingText}>{rating} / 5</Text>
          </View>
        ) : null}

        {location ? (
          <View style={styles.detail}>
            <Ionicons name="location" size={16} color="#555" />
            <Text style={styles.detailText}>{location}</Text>
          </View>
        ) : null}

        {openHours ? (
          <View style={styles.detail}>
            <Ionicons name="time" size={16} color="#555" />
            <Text style={styles.detailText}>{openHours}</Text>
          </View>
        ) : null}

        {closedOn ? (
          <View style={styles.detail}>
            <Ionicons name="close-circle" size={16} color="#555" />
            <Text style={styles.detailText}>Closed on {closedOn}</Text>
          </View>
        ) : null}

        {services && services.length > 0 && (
          <View style={styles.servicesBox}>
            <Text style={styles.sectionTitle}>Services:</Text>
            {services.map((service, index) => (
              <Text key={index} style={styles.serviceItem}>• {service}</Text>
            ))}
          </View>
        )}

        {tags && tags.length > 0 && (
          <View style={styles.tagsBox}>
            {tags.map((tag, index) => (
              <Text key={index} style={styles.tag}>{tag}</Text>
            ))}
          </View>
        )}

        <TouchableOpacity style={styles.actionButton} onPress={handleAction}>
          <Ionicons name="call" size={20} color="white" />
          <Text style={styles.buttonText}>{buttonlabel || 'Contact'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default CustomScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    backgroundColor: '#f8f9fa',
  },
  imageContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  bannerImage: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  contentBox: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  offer: {
    fontSize: 18,
    color: '#e63946',
    fontWeight: '600',
    marginBottom: 5,
    backgroundColor: '#ffe6e6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  validity: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  desc: {
    fontSize: 16,
    color: '#444',
    marginBottom: 15,
    lineHeight: 24,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff8e1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  detail: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
    paddingLeft: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 15,
    color: '#555',
    marginLeft: 6,
  },
  servicesBox: {
    marginTop: 15,
    marginBottom: 10,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  serviceItem: {
    fontSize: 15,
    color: '#444',
    marginLeft: 5,
    marginBottom: 4,
    lineHeight: 20,
  },
  tagsBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    color: '#1976d2',
    fontSize: 13,
    fontWeight: '500',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e63946',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 25,
    justifyContent: 'center',
    shadowColor: '#e63946',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '600',
  },
});