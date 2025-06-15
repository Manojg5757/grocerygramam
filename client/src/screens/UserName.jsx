import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { myColors } from "../Utils/MyColors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db } from "../../firebase";
import Logo from "../../assets/logo.png";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { doc, getDoc } from "firebase/firestore";

const UserName = () => {
  const route = useRoute();
  const nav = useNavigation();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const checkUsername = async () => {
    const trimmedUsername = username.trim().toLowerCase();

    if (!trimmedUsername) {
      Alert.alert("Username Required", "Please enter a username.");
      return;
    }

    try {
      setLoading(true);

      // Optional safety delay (remove if not needed)
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Ensure db is available
      if (!db) {
        throw new Error("Firestore not initialized. fuck you");
      }

      const docRef = doc(db, "usernames", trimmedUsername);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        Alert.alert("Username Taken", "That username is already in use.");
      } else {
        nav.navigate("Signup", { userName: trimmedUsername });
      }
    } catch (error) {
      console.error("Error checking username:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: myColors.secondary }}>
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingTop: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={Logo}
          style={{
            height: 75,
            width: 75,
            borderRadius: 100,
            alignSelf: "center",
            borderWidth: 2,
            borderColor: "black",
          }}
        />
        <Text style={{ color: myColors.third, fontSize: 24, marginTop: 30 }}>
          Signup
        </Text>
        <Text style={{ color: myColors.third, fontSize: 15, marginTop: 30 }}>
          Choose a Username
        </Text>
        <Text style={{ color: "grey", fontSize: 16, marginTop: 10 }}>
          This will be your unique identity
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            color: "grey",
            marginTop: 40,
          }}
        >
          Username
        </Text>
        <TextInput
          value={username}
          onChangeText={(val) => setUsername(val)}
          autoCapitalize="none"
          style={{
            borderColor: "#E3E3E3",
            borderBottomWidth: 2,
            fontSize: 16,
            marginTop: 15,
            paddingVertical: 8,
            color:'black'
          }}
          placeholder="Enter username"
        />
        <View style={{ flexDirection: "row" }}>
          <Text style={{ color: "grey" }}>Already Have An Account? </Text>
          <TouchableOpacity onPress={() => nav.navigate("Login")}>
            <Text style={{ color: myColors.primary, fontWeight: "bold" }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={checkUsername}
          style={{
            backgroundColor: myColors.primary,
            marginTop: 40,
            height: 50,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color={myColors.secondary} size="small" />
          ) : (
            <Text style={{ color: myColors.secondary, fontSize: 19 }}>
              Continue
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => nav.navigate("Main")}
          style={{
            backgroundColor: myColors.primary,
            marginTop: 20,
            height: 50,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: myColors.secondary, fontSize: 19 }}>
            Skip for Now
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserName;
