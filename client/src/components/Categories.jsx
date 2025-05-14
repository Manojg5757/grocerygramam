import { View, Text, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { category } from '../../data.js';
import {  useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { width: screenWidth } = Dimensions.get('window');

const Categories = () => {
  const nav = useNavigation();
  const { i18n } = useTranslation();
  const lang = i18n.language;



 

  // total horizontal padding around list
  const HORIZONTAL_PADDING = 10 * 2;   
  // total space between two items (marginLeft + marginRight)
  const ITEM_HORIZONTAL_MARGIN = 5 * 2;
  // number of columns
  const NUM_COLUMNS = 2;

  // compute the tile width so two fit side by side with margins
  const tileWidth =
    (screenWidth - HORIZONTAL_PADDING - ITEM_HORIZONTAL_MARGIN * NUM_COLUMNS) /
    NUM_COLUMNS;

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
      
        data={category}
        keyExtractor={(item) => item.categoryId.toString()}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const title = item[`name_${lang}`];
          return (
            <TouchableOpacity
              onPress={() =>
                nav.navigate('Products', {
                  categoryId: item.categoryId,
                  name: title,
                })
              }
              style={{
                width: tileWidth,
                marginVertical: 5,
                alignItems: 'center',
                padding: 10,
                borderRadius: 20,
                backgroundColor: '#fff',
              }}
            >
              <Image
                source={item.icon}
                style={{
                  width: tileWidth - 20,    // account for tile padding
                  height: tileWidth - 20,   // keep square
                  borderRadius: 10,
                }}
                resizeMode="cover"
              />
              <Text
                style={{
                  textAlign: 'center',
                  marginTop: 5,
                  fontWeight: 'bold',
                }}
                numberOfLines={1}
              >
                {title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Categories;
