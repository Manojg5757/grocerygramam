import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";
import { myColors } from "../Utils/MyColors"; // Custom colors if you have
import logo from "../../assets/logo.png"; // Replace with your logo path

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const db = getFirestore();
  const navigation = useNavigation();

  // 🔒 Check if already logged in admin — auto-navigate
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminDoc = await getDoc(doc(db, "admin", user.uid));
        if (adminDoc.exists() && adminDoc.data().role === "admin") {
          await AsyncStorage.setItem("userToken", user.uid);
          navigation.replace("AdminDashboard");
        } else {
          await signOut(auth);
        }
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const adminDoc = await getDoc(doc(db, "admin", user.uid));

      if (adminDoc.exists() && adminDoc.data().role === "admin") {
        // 🔔 Request Notification permission
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          // ✅ Get FCM Token
          const currentToken = await messaging().getToken();
          const savedToken = await AsyncStorage.getItem("fcmToken");
          console.log("✅ FCM Token fetched:", currentToken);          if (currentToken !== savedToken) {
            // Save token to users collection
            await setDoc(
              doc(db, "users", user.uid),
              { fcmToken: currentToken },
              { merge: true }
            );
            await AsyncStorage.setItem("fcmToken", currentToken);
            console.log("✅ FCM token updated in users collection")
          } else {
            console.log("ℹ️ FCM token unchanged")
          }

          // 🔥 Token saved to users collection

          console.log("✅ FCM Token saved to Firestore");
        } else {
          console.warn("🚫 Notification permission not granted");
        }

        await AsyncStorage.setItem("userToken", user.uid);
        navigation.replace("AdminDashboard");
      } else {
        Alert.alert("Access Denied", "You are not authorized as an admin.");
        await signOut(auth);
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      Alert.alert("Login Failed", error.message);
    }
    setLoading(false);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "#F4F7FC",
      }}
    >
      <View style={{ alignItems: "center", marginBottom: 40 }}>
        <Image
          source={logo} // Add your logo here if any
          style={{ width: 120, height: 120, marginBottom: 20 }}
        />
        <Text
          style={{ fontSize: 28, fontWeight: "bold", color: myColors.primary }}
        >
          Admin Login
        </Text>
      </View>

      <View
        style={{
          backgroundColor: "white",
          borderRadius: 10,
          padding: 30,
          elevation: 5,
        }}
      >
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={{
            borderBottomWidth: 1,
            borderColor: "#ddd",
            marginBottom: 20,
            paddingVertical: 10,
            fontSize: 16,
            color: "#333",
          }}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderBottomWidth: 1,
            borderColor: "#ddd",
            marginBottom: 30,
            paddingVertical: 10,
            fontSize: 16,
            color: "#333",
          }}
        />

        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: myColors.primary,
            paddingVertical: 15,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Login
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* <View style={{ marginTop: 20, alignItems: "center" }}>
        <Text style={{ color: "#888", fontSize: 14 }}>
          Don't have an account?{" "}
          <Text
            onPress={() => navigation.navigate("AdminRegister")}
            style={{ color: myColors.primary, fontWeight: "bold" }}
          >
            Register here
          </Text>
        </Text>
      </View> */}
    </View>
  );
};

export default AdminLogin;
