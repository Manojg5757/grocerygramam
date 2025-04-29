import { View, Text,Image } from 'react-native'
import React from 'react'
import Logo from '../../assets/logo.png'

const HomeIcon = () => {
  return (
    <View style={{justifyContent:'center',alignItems:'flex-start'}}>
     <Image style={{width:50,height:50,borderRadius:100}} source={Logo} />
    </View>
  )
}

export default HomeIcon