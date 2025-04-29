import {
    View,
    Text,
    ScrollView,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
  } from "react-native";
  import React, { useState } from "react";
  import { myColors } from "../Utils/MyColors";
  import { StatusBar } from "expo-status-bar";
  import Logo from "../../assets/logo.png";
  import { SafeAreaView } from "react-native-safe-area-context";
  import { getAuth, sendPasswordResetEmail } from "firebase/auth";
  import { useNavigation } from "@react-navigation/native";
  
  const ForgotPassword = () => {
    const auth = getAuth();
    const nav = useNavigation();
    const [email, setEmail] = useState("");
  
    const handleForgotPassword = () => {
      if (!email.trim()) {
        Alert.alert("Enter your email", "Please enter your email to reset your password.");
        return;
      }
  
      sendPasswordResetEmail(auth, email.trim())
        .then(() => {
          Alert.alert("Success", "Password reset email sent. Check your inbox.");
          nav.goBack(); // Or nav.navigate("Login");
        })
        .catch((error) => {
          let message = "Something went wrong. Try again.";
          if (error.code === "auth/invalid-email") {
            message = "Invalid email address.";
          } else if (error.code === "auth/user-not-found") {
            message = "No user found with this email.";
          }
          Alert.alert("Error", message);
        });
    };
  
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: myColors.secondary }}>
        <StatusBar style="auto" />
        <ScrollView
          style={{ flex: 1, paddingTop: 30 }}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
        >
          <Image
            source={Logo}
            style={{
              borderColor: "black",
              borderWidth: 2,
              height: 75,
              width: 75,
              borderRadius: 100,
              alignSelf: "center",
            }}
          />
          <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
            <Text style={{ color: myColors.third, fontSize: 24 }}>Forgot Password</Text>
            <Text style={{ color: "grey", fontWeight: "400", fontSize: 16, marginTop: 10 }}>
              Enter your email to reset your password
            </Text>
  
            <Text style={{ fontSize: 16, fontWeight: "500", color: "grey", marginTop: 40 }}>
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={(val) => setEmail(val)}
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                borderColor: "#E3E3E3",
                borderBottomWidth: 2,
                fontSize: 16,
                marginTop: 15,
              }}
            />
  
            <Text
              style={{
                fontSize: 14,
                fontWeight: "400",
                color: "black",
                marginTop: 15,
                letterSpacing: 0.7,
                lineHeight: 25,
                width: "95%",
                opacity: 0.7,
              }}
            >
              We will send you a link to reset your password to your registered email address.
            </Text>
  
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={{
                backgroundColor: myColors.primary,
                marginTop: 30,
                height: 70,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: myColors.secondary, fontSize: 19 }}>Send Reset Link</Text>
            </TouchableOpacity>
  
            <View
              style={{
                flexDirection: "row",
                gap: 5,
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 16 }}>Remember Password?</Text>
              <TouchableOpacity onPress={() => nav.navigate("Login")}>
                <Text style={{ color: myColors.primary, fontSize: 15, fontWeight: "500" }}>
                  Login Now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default ForgotPassword;
  