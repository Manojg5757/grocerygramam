import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserData,
  loadUserDataFromStorage,
  logoutAndClearUserData,
} from "../../Redux/UserSlice";
import { myColors } from "../Utils/MyColors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { getAuth, signOut } from "firebase/auth";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t, i18n } = useTranslation();
  const nav = useNavigation();
  const dispatch = useDispatch();
  const { userData, loading, error } = useSelector((state) => state.user);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();
        const user = auth.currentUser;

        if (user) {
          const adminRef = doc(db, "admin", user.uid);
          const adminSnap = await getDoc(adminRef);

          if (adminSnap.exists() && adminSnap.data().role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }

          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const languagePref = userSnap.data().languagePref;
            if (languagePref) {
              i18n.changeLanguage(languagePref);
              setSelectedLanguage(languagePref);
            }
          }
        }
      } catch (err) {
        console.error("Error checking admin role:", err);
      }
    };

    dispatch(loadUserDataFromStorage()).then(() => {
      dispatch(fetchUserData());
    });

    checkAdminRole();
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      await AsyncStorage.removeItem("userToken");
      await dispatch(logoutAndClearUserData());
      nav.replace("Login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleLanguageChange = async (lang) => {
    try {
      i18n.changeLanguage(lang);
      setSelectedLanguage(lang);

      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { languagePref: lang }, { merge: true });
      }

      setIsDropdownVisible(false);
    } catch (error) {
      console.log("Error updating language preference:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={myColors.primary} />;
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f8f8f8" }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          textAlign: "center",
          paddingTop: 20,
          color: myColors.primary,
        }}
      >
        {t("Profile")}
      </Text>

      {userData ? (
        <>
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: myColors.primary,
              }}
            >
              {t("Personal Details")}
            </Text>
            <Text style={{ fontSize: 14, marginVertical: 5 }}>
              {t("Name")}:{" "}
              <Text style={{ fontWeight: "bold" }}>{userData.username}</Text>
            </Text>
            <Text style={{ fontSize: 14, marginVertical: 5 }}>
              {t("Email")}:{" "}
              <Text style={{ fontWeight: "bold" }}>{userData.email}</Text>
            </Text>
            <Text style={{ fontSize: 14, marginVertical: 5 }}>
              {userData.address}
            </Text>
          </View>

          <View
            style={{
              borderTopWidth: 1,
              borderColor: "lightgrey",
              marginVertical: 15,
            }}
          />

          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: myColors.primary,
              }}
            >
              {t("Orders")}
            </Text>
            <TouchableOpacity
              onPress={() => nav.navigate("Orders")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginVertical: 10,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Feather
                  name="shopping-bag"
                  size={20}
                  color={myColors.primary}
                />
                <Text style={{ fontSize: 14 }}>{t("Your Orders")}</Text>
              </View>
              <Entypo
                name="chevron-thin-right"
                size={20}
                color={myColors.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Language Toggle Dropdown */}
          <View style={{ marginTop: 15 }}>
            <TouchableOpacity
              onPress={() => setIsDropdownVisible(!isDropdownVisible)}
              style={{
                paddingVertical: 10,
                backgroundColor: myColors.secondary,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 15, color: "black" }}>
                {t("Change Language")}
              </Text>
            </TouchableOpacity>
            {isDropdownVisible && (
              <View
                style={{
                  marginTop: 10,
                  borderRadius: 5,
                  backgroundColor: "white",
                  borderColor: "lightgrey",
                  borderWidth: 1,
                  padding: 10,
                }}
              >
                <TouchableOpacity onPress={() => handleLanguageChange("en")}>
                  <Text style={{ fontSize: 14, paddingVertical: 8 }}>
                    English
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleLanguageChange("ta")}>
                  <Text
                    style={{
                      fontSize: 14,
                      paddingVertical: 8,
                      borderTopWidth: 1,
                      borderColor: "lightgrey",
                    }}
                  >
                    Tamil
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Show Admin Mode only if isAdmin is true */}
          {isAdmin && (
            <TouchableOpacity
              onPress={() => nav.navigate("AdminLogin")}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: 15,
                borderTopWidth: 1,
                borderColor: "lightgrey",
                paddingVertical: 10,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <MaterialIcons
                  name="admin-panel-settings"
                  size={24}
                  color={myColors.primary}
                />
                <Text style={{ fontSize: 14 }}>{t("Admin Mode")}</Text>
              </View>
              <Entypo
                name="chevron-thin-right"
                size={20}
                color={myColors.primary}
              />
            </TouchableOpacity>
          )}

          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              onPress={() => nav.navigate("TermsAndConditions")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderColor: "lightgrey",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Feather name="file-text" size={20} color={myColors.primary} />
                <Text style={{ fontSize: 14 }}>{t("Terms & Conditions")}</Text>
              </View>
              <Entypo
                name="chevron-thin-right"
                size={20}
                color={myColors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => nav.navigate("PrivacyPolicy")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderColor: "lightgrey",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Feather name="shield" size={20} color={myColors.primary} />
                <Text style={{ fontSize: 14 }}>{t("Privacy Policy")}</Text>
              </View>
              <Entypo
                name="chevron-thin-right"
                size={20}
                color={myColors.primary}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            style={{
              flexDirection: "row",
              gap: 10,
              marginTop: 15,
              justifyContent: "center",
              backgroundColor: myColors.primary,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 20,
            }}
          >
            <AntDesign name="logout" size={20} color="white" />
            <Text style={{ color: "white" }}>{t("Logout")}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          onPress={() => nav.navigate("UserName")}
          style={{
            backgroundColor: myColors.primary,
            marginTop: "auto",
            marginBottom: "auto",
            height: 50,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: myColors.secondary, fontSize: 19 }}>
            {t("Sign Up To see Profile")}
          </Text>
        </TouchableOpacity>
      )}

      <Text
        style={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: "center",
          fontWeight: "semibold",
          color: "grey",
          fontSize: 12,
        }}
      >
        An L34 project.
      </Text>
    </View>
  );
};

export default Profile;
