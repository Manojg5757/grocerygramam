import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { category } from '../../data.js';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Categories = () => {
  const nav = useNavigation();
  const{t,i18n} = useTranslation()
  const lang = i18n.language

  const key = `name_${lang}`
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={category}
        key={2}
        keyExtractor={(item) => item.categoryId}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => {
          

          return (
            <TouchableOpacity
              onPress={() =>
                nav.navigate('Products', {
                  categoryId: item.categoryId,
                  name: item[`name_${lang}`],
                })
              }
              style={{
                flex: 1,
                margin: 5,
                alignItems: 'center',
                padding: 10,
                borderRadius: 20,
              }}
            >
              <Image
                source={item.icon}
                style={{ width: 150, height: 150, borderRadius: 10 }}
              />
              <Text style={{ textAlign: 'center', marginTop: 5, fontWeight: 'bold' }}>
                {item[`name_${lang}`]}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default Categories;
