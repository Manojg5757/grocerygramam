import { View, Text, ScrollView } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { myColors } from "../Utils/MyColors";

const TermsAndConditions = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: myColors.primary, marginBottom: 20 }}>
          Terms & Conditions
        </Text>

        <Text style={styles.sectionTitle}>App Information</Text>
        <Text style={styles.text}>App Name: Grocery Gramam</Text>
        <Text style={styles.text}>Location: Coimbatore, Pincode 641671, 20km radius</Text>
        <Text style={styles.text}>Contact: grocerygramam@gmail.com</Text>

        <Text style={styles.sectionTitle}>Services We Offer</Text>
        <Text style={styles.text}>• Online grocery ordering</Text>
        <Text style={styles.text}>• Local delivery service</Text>
        <Text style={styles.text}>• Catering service</Text>

        <Text style={styles.sectionTitle}>Who Can Use Our App</Text>
        <Text style={styles.text}>Users must be 13 years of age or older.</Text>

        <Text style={styles.sectionTitle}>Payment Policy</Text>
        <Text style={styles.text}>No online payments currently. Cash is collected at the time of delivery.</Text>

        <Text style={styles.sectionTitle}>Minimum Order Value</Text>
        <Text style={styles.text}>₹1499</Text>

        <Text style={styles.sectionTitle}>Refund & Replacement Policy</Text>
        <Text style={styles.text}>Refunds or replacements are provided only for damaged products upon delivery.</Text>

        <Text style={styles.sectionTitle}>Order Cancellation Policy</Text>
        <Text style={styles.text}>To cancel an order, customers must call and inform us before dispatch.</Text>

        <Text style={styles.sectionTitle}>Delivery & Service Policy</Text>
        <Text style={styles.text}>Delivery time varies and is not fixed.</Text>
        <Text style={styles.text}>Service Hours: 10:00 AM to 5:00 PM daily.</Text>

        <Text style={styles.sectionTitle}>Personal Details We Collect</Text>
        <Text style={styles.text}>• Name</Text>
        <Text style={styles.text}>• Phone number</Text>
        <Text style={styles.text}>• Address</Text>
        <Text style={styles.text}>• Pincode</Text>
        <Text style={styles.text}>• Gender</Text>
        <Text style={styles.text}>• Email</Text>
        <Text style={styles.text}>• Landmark</Text>
        <Text style={styles.text}>• Preferred language</Text>

        <Text style={styles.sectionTitle}>User Conduct Guidelines</Text>
        <Text style={styles.text}>• No misuse of the app or services.</Text>
        <Text style={styles.text}>• No fake or prank orders.</Text>
        <Text style={styles.text}>• No abusive, offensive, or harmful behavior.</Text>

        <Text style={styles.sectionTitle}>Disclaimer</Text>
        <Text style={styles.text}>• Grocery Gramam is not responsible for product unavailability or stock shortages.</Text>
        <Text style={styles.text}>• We are not liable for delivery delays due to unavoidable reasons like weather or traffic.</Text>
        <Text style={styles.text}>• We reserve the right to change these Terms & Conditions at any time without prior notice.</Text>

        <Text style={[styles.text, { marginTop: 20 }]}>For any queries, contact us at: grocerygramam@gmail.com</Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = {
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
    color: myColors.primary,
  },
  text: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
    lineHeight: 22,
  },
};

export default TermsAndConditions;
