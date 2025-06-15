import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';

const Inspiration = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>“We are nothing on a cosmic scale, yet we can bring a change.”</Text>

          <Text style={styles.story}>
            In a small village by the Brahmaputra River, a boy named{" "}
            <Text style={styles.highlight}>Jadav Payeng</Text> watched helplessly as dozens of
            snakes perished under the scorching sun. The land had no trees.
            No one came to help.{"\n\n"}
            But Jadav did something no one expected — he planted a tree. Then
            another. And another. Every day. Alone.{"\n\n"}
            Decades later, his single act of courage became a{" "}
            <Text style={styles.highlight}>1,300-acre forest</Text>, home to elephants,
            tigers, birds, and life in abundance.{"\n\n"}
            It began with one person. One idea. One action.
          </Text>

          <Text style={styles.quote}>
            
          </Text>

          

         
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 24,
  },
  story: {
    fontSize: 18,
    color: "#E0F7FA",
    lineHeight: 28,
    textAlign: "justify",
    marginBottom: 30,
  },
  highlight: {
    color: "#FFD54F",
    fontWeight: "700",
  },
  quote: {
    fontSize: 20,
    fontStyle: "italic",
    color: "#FFCCBC",
    textAlign: "center",
    marginBottom: 26,
  },
  footer: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFF59D",
    textAlign: "center",
    marginTop: 40,
  },
});

export default Inspiration;
