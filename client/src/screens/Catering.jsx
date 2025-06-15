

import { View, Text, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import React from 'react';
import { Image } from 'expo-image';
import { myColors } from '../Utils/MyColors';
import { catering } from '../../data';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const cardWidth = (width - 45) / 2;

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
        Sri Sakthi Catering Live
      </Text>
      <Image
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/grocerygramam-27cb1.firebasestorage.app/o/catering%2Fcateringbannertwo.png?alt=media&token=8dcac0d6-3edb-435d-811d-0a30fc45ebfa',
        }}
        style={{
          width: '100%',
          height: width * 0.55,
          borderRadius: 20,
          marginBottom: 20,
        }}
        contentFit="cover"
        transition={300}
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
              width: cardWidth,
            }}
          >
            <Image
              source={{ uri: item.icon }}
              style={{
                width: '100%',
                height: cardWidth * 0.75,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}
              contentFit="cover"
              transition={300}
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



// import React from "react";
// import { View, Text, StyleSheet, Image } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { LinearGradient } from 'expo-linear-gradient';

// const Catering = () => {
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <LinearGradient colors={['#FF5722', '#FFC107']} style={styles.container}>
//         <View style={styles.content}>
//           {/* Optional Coming Soon image */}
//           {/* <Image source={require("../../assets/comingsoon.png")} style={styles.image} /> */}

//           <Text style={styles.title}>Catering Service</Text>
//           <Text style={styles.subtitle}>Coming Soon!</Text>

//           <Text style={styles.description}>
//             We're preparing something delicious for your special occasions. Stay tuned!
//           </Text>

//           <Text style={styles.quote}>
//             “Traditional food isn’t just a meal, it’s a memory served on a plate.”
//           </Text>
//         </View>
//       </LinearGradient>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   content: {
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   image: {
//     width: 250,
//     height: 250,
//     resizeMode: "contain",
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 36,
//     fontWeight: "bold",
//     color: "#FFFFFF",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 28,
//     color: "#FFFFFF",
//     marginBottom: 16,
//   },
//   description: {
//     fontSize: 18,
//     color: "#FFF9C4",
//     textAlign: "center",
//     marginBottom: 30,
//   },
//   quote: {
//     fontSize: 20,
//     color: "#FFFDE7",
//     fontStyle: "italic",
//     textAlign: "center",
//     marginHorizontal: 10,
//     marginTop: 20,
//   },
// });

// export default Catering;




