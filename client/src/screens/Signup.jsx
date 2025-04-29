import {
  View,
  Text,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { myColors } from "../Utils/MyColors";
import { StatusBar } from "expo-status-bar";
import Logo from "../../assets/logo.png";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
  const languages = ["Tamil", "English"];
  const genders = ["Male", "Female", "Other"];

  const route = useRoute();
  const nav = useNavigation();
  const [gender, setGender] = useState("");
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [languagePref, setLanguagePref] = useState("");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const { userName } = route.params;

  const [userCredential, setUserCredential] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    landmark: "",
    pincode: "",
  });

  const { username, email, password, phone, address, landmark, pincode } =
    userCredential;

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

  useEffect(() => {
    if (userName) {
      setUserCredential((prev) => ({ ...prev, username: userName }));
    }
  }, [userName]);

  const handleSignup = async () => {
    if (
      !username ||
      !email ||
      !password ||
      !phone ||
      !address ||
      !landmark ||
      !pincode
    ) {
      Alert.alert("Fill all details");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain at least one letter and one number"
      );
      return;
    }

    setPasswordError("");
    setEmailError("");

    try {
      setIsSigningUp(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      const languageCode =
        languagePref === "Tamil"
          ? "ta"
          : languagePref === "English"
          ? "en"
          : "";

      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        username,
        email,
        phone,
        address,
        landmark,
        pincode,
        languagePref: languageCode,
        gender,
        createdAt: new Date().toISOString(),
      });

      const usernameRef = doc(db, "usernames", username.toLowerCase());
      await setDoc(usernameRef, {
        uid: user.uid,
        username,
      });

      Alert.alert(
        "Verify Your Email",
        "Your account has been created! Please check your email and verify before logging in."
      );
      nav.replace("Login");
    } catch (error) {
      if (error.message.includes("email-already-in-use")) {
        setEmailError("Email already in use. Please use a different email.");
      }
    } finally {
      setIsSigningUp(false);
    }
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
          <Text style={{ color: myColors.third, fontSize: 24 }}>Signup</Text>
          <Text
            style={{
              color: "grey",
              fontWeight: "400",
              fontSize: 16,
              marginTop: 10,
            }}
          >
            Create a new account
          </Text>

          <Text style={styles.label}>Username</Text>
          <TextInput value={username} editable={false} style={styles.input} />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={(val) => {
              setUserCredential({ ...userCredential, email: val });
              setEmailError("");
            }}
            keyboardType="email-address"
            style={styles.input}
          />
          {emailError ? (
            <Text style={{ color: "red", marginTop: 10 }}>{emailError}</Text>
          ) : null}

          <Text style={styles.label}>Password</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TextInput
              value={password}
              onChangeText={(val) =>
                setUserCredential({ ...userCredential, password: val })
              }
              secureTextEntry={isVisible}
              maxLength={12}
              keyboardType="ascii-capable"
              style={[styles.input, { flex: 0.9 }]}
            />
            <Ionicons
              name={isVisible ? "eye-off-outline" : "eye-outline"}
              onPress={() => setIsVisible(!isVisible)}
              size={24}
              color="black"
            />
          </View>
          {passwordError ? (
            <Text style={{ color: "red", marginTop: 10 }}>{passwordError}</Text>
          ) : null}

          <Text style={styles.label}>Phone</Text>
          <TextInput
            value={phone}
            onChangeText={(val) =>
              setUserCredential({ ...userCredential, phone: val })
            }
            keyboardType="phone-pad"
            style={styles.input}
          />

          <Text style={styles.label}>Gender</Text>
          <View style={{ zIndex: 20 }}>
            <TouchableOpacity
              onPress={() => setShowGenderDropdown(!showGenderDropdown)}
              style={[styles.input, { paddingVertical: 10 }]}
            >
              <Text style={{ fontSize: 16, color: gender ? "black" : "grey" }}>
                {gender || "Select Gender"}
              </Text>
            </TouchableOpacity>

            {showGenderDropdown && (
              <View style={styles.dropdown}>
                {genders.map((g) => (
                  <TouchableOpacity
                    key={g}
                    onPress={() => {
                      setGender(g);
                      setShowGenderDropdown(false);
                    }}
                    style={{ padding: 12 }}
                  >
                    <Text style={{ fontSize: 16 }}>{g}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Text style={styles.label}>Language</Text>
          <View style={{ zIndex: 10 }}>
            <TouchableOpacity
              onPress={() => setShowLanguageDropdown(!showLanguageDropdown)}
              style={[styles.input, { paddingVertical: 10 }]}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: languagePref ? "black" : "grey",
                }}
              >
                {languagePref || "Select Language"}
              </Text>
            </TouchableOpacity>

            {showLanguageDropdown && (
              <View style={styles.dropdown}>
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    onPress={() => {
                      setLanguagePref(lang);
                      setShowLanguageDropdown(false);
                    }}
                    style={{ padding: 12 }}
                  >
                    <Text style={{ fontSize: 16 }}>{lang}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <Text style={styles.label}>Address</Text>
          <TextInput
            value={address}
            onChangeText={(val) =>
              setUserCredential({ ...userCredential, address: val })
            }
            style={styles.input}
          />

          <Text style={styles.label}>Landmark</Text>
          <TextInput
            value={landmark}
            onChangeText={(val) =>
              setUserCredential({ ...userCredential, landmark: val })
            }
            style={styles.input}
          />

          <Text style={styles.label}>Pincode</Text>
          <TextInput
            value={pincode}
            onChangeText={(val) =>
              setUserCredential({ ...userCredential, pincode: val })
            }
            keyboardType="number-pad"
            style={styles.input}
          />

          <Text style={styles.terms}>
            By signing up, you agree to our{" "}
            <Text
              style={{ color: myColors.primary }}
              onPress={() => nav.navigate("TermsAndConditions")}
            >
              Terms & Conditions
            </Text>{" "}
            and <Text style={{color:myColors.primary}} onPress={()=>nav.navigate('PrivacyPolicy')}>Privacy Policy</Text>
          </Text>

          <TouchableOpacity
            onPress={handleSignup}
            style={styles.signupBtn}
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <ActivityIndicator color={myColors.secondary} />
            ) : (
              <Text style={styles.signupText}>Signup</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={{ fontSize: 16 }}>Already have an account?</Text>
            <TouchableOpacity onPress={() => nav.navigate("Login")}>
              <Text
                style={{
                  color: myColors.primary,
                  fontSize: 15,
                  fontWeight: "500",
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "grey",
    marginTop: 30,
  },
  input: {
    borderColor: "#E3E3E3",
    borderBottomWidth: 2,
    fontSize: 16,
    marginTop: 15,
  },
  terms: {
    fontSize: 14,
    fontWeight: "400",
    color: "black",
    marginTop: 15,
    letterSpacing: 0.7,
    lineHeight: 25,
    width: "95%",
    opacity: 0.7,
  },
  signupBtn: {
    backgroundColor: myColors.primary,
    marginTop: 30,
    height: 70,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    color: myColors.secondary,
    fontSize: 19,
  },
  loginContainer: {
    flexDirection: "row",
    gap: 5,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: "#fff",
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    elevation: 4,
    zIndex: 1000,
  },
};

export default Signup;
