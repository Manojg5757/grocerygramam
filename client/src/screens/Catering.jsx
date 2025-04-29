import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import React from 'react';
import { myColors } from '../Utils/MyColors';
import { catering } from '../../data';
import { SafeAreaView } from 'react-native-safe-area-context';

const Catering = () => {
  const renderHeader = () => (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: 30,
          color: myColors.primary,
          paddingBottom: 10,
        }}
      >
        Sri Sakthi Catering
      </Text>
      <Image
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fcateringbannertwo.png?alt=media&token=8dcac0d6-3edb-435d-811d-0a30fc45ebfa',
        }}
        style={{
          height: 220,
          width: '100%',
          borderRadius: 20,
          resizeMode: 'cover',
          marginBottom: 20,
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, padding: 15 }}>
      <FlatList
        data={catering}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: '#fff',
              borderRadius: 15,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 5,
              elevation: 5,
              overflow: 'hidden',
              width: '48%', // Adjust width for two columns
              marginBottom: 20,
            }}
          >
            <Image
              style={{
                height: 150,
                width: '100%',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                resizeMode: 'cover',
              }}
              source={{ uri: item.icon }}
            />
            <View style={{ padding: 10 }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  color: myColors.primary,
                  marginBottom: 5,
                  textAlign: 'center',
                }}
              >
                {item.itemNameTamil}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 14,
                  color: myColors.primary,
                  textAlign: 'center',
                }}
              >
                {item.itemName}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: 'gray',
                  marginTop: 5,
                  textAlign: 'center',
                }}
              >
                Price: ₹{item.price}/{item.type}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: 'gray',
                  textAlign: 'center',
                  marginTop: 5,
                }}
              >
                Minimum Order: {item.minOrder}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default Catering;
