import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'

const EmbeddVideo = () => {
  return (
    <View>
     <WebView
     style={styles.container}
     source={{uri:"https://www.youtube.com/embed/P7I5uCMvRho?si=elRyDALoAMtLLVdJ"}}
     allowsFullscreenVideo
     />
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})

export default EmbeddVideo