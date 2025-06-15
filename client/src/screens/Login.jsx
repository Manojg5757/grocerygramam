import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { myColors } from "../Utils/MyColors";
import { StatusBar } from "expo-status-bar";
import Logo from "../../assets/logo.png";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadCartFromStorage } from "../../Redux/CartSlice";
import { useDispatch } from "react-redux";

const Login = () => {
  const nav = useNavigation();
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userCredential, setUserCredential] = useState({ email: "", password: "" });
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const dispatch = useDispatch();
  const auth = getAuth();
  const { email, password } = userCredential;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        if (!user.emailVerified) {
          await auth.signOut();
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert("Email Not Verified", "Please verify your email to continue.");
        setUnverifiedUser(user);
        await auth.signOut();
        return;
      }

      await AsyncStorage.setItem("userToken", JSON.stringify({ uid: user.uid, email: user.email }));
      dispatch(loadCartFromStorage());
      nav.replace("Main"); // Navigate once here after successful login

    } catch (error) {
      let errorMessage = "Login failed. Please try again.";

      if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else {
        errorMessage = error.message || error.code;
      }

      Alert.alert("Login Failed", errorMessage);
    }
  };

  const handleResendVerification = async () => {
    try {
      if (unverifiedUser) {
        await sendEmailVerification(unverifiedUser);
        Alert.alert("Verification Email Sent", "Check your inbox.");
      }
    } catch (err) {
      Alert.alert("Error", err.message || "Something went wrong.");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={myColors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: myColors.secondary }}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            style={{ flex: 1, paddingTop: 30 }}
            contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
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
              <Text style={{ color: myColors.third, fontSize: 24 }}>Login</Text>
              <Text style={{ color: "grey", fontWeight: "400", fontSize: 16, marginTop: 10 }}>Enter Details</Text>

              <Text style={{ fontSize: 16, fontWeight: "500", color: "grey", marginTop: 40 }}>Email</Text>
              <TextInput
                value={email}
                onChangeText={(val) => setUserCredential({ ...userCredential, email: val })}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ borderColor: "#E3E3E3", borderBottomWidth: 2, fontSize: 16, marginTop: 15, color: "black" }}
              />

              <Text style={{ fontSize: 16, fontWeight: "500", color: "grey", marginTop: 30 }}>Password</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <TextInput
                  value={password}
                  onChangeText={(val) => setUserCredential({ ...userCredential, password: val })}
                  secureTextEntry={isVisible}
                  autoCapitalize="none"
                  maxLength={20}
                  style={{
                    borderColor: "#E3E3E3",
                    borderBottomWidth: 2,
                    fontSize: 16,
                    marginTop: 15,
                    flex: 0.9,
                    color: "black",
                  }}
                />
                <Ionicons
                  name={isVisible ? "eye-off-outline" : "eye-outline"}
                  onPress={() => setIsVisible(!isVisible)}
                  size={24}
                  color="black"
                />
              </View>

              <TouchableOpacity onPress={() => nav.navigate("ForgotPassword")}>
                <Text style={{ marginTop: 10, color: myColors.primary }}>Forgot Password?</Text>
              </TouchableOpacity>

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
                By continuing, you agree to our Terms & Conditions and Privacy Policy
              </Text>

              <TouchableOpacity
                onPress={handleLogin}
                style={{
                  backgroundColor: myColors.primary,
                  marginTop: 30,
                  height: 70,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: myColors.secondary, fontSize: 19 }}>Login</Text>
              </TouchableOpacity>

              {unverifiedUser && (
                <TouchableOpacity
                  onPress={handleResendVerification}
                  style={{ marginTop: 20, padding: 12, borderRadius: 10, backgroundColor: "#328E6E", alignItems: "center" }}
                >
                  <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Resend Verification Email</Text>
                </TouchableOpacity>
              )}

              <View style={{ flexDirection: "row", gap: 5, marginTop: 20, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 16, color: "black" }}>Don't Have an Account?</Text>
                <TouchableOpacity onPress={() => nav.navigate("UserName")}>
                  <Text style={{ color: myColors.primary, fontSize: 15, fontWeight: "500" }}>Signup Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
