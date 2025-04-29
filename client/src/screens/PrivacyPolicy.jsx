import { View, Text, ScrollView, StyleSheet } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { myColors } from "../Utils/MyColors"; // your custom colors

const PrivacyPolicy = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Privacy Policy</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to Grocery Gramam. We value your privacy and are committed to
          protecting your personal information. This Privacy Policy outlines how
          we collect, use, and protect the data you provide while using our
          services.
        </Text>

        <Text style={styles.sectionTitle}>2. Contact Information</Text>
        <Text style={styles.paragraph}>
          For any privacy-related concerns, you may contact us at:
          grocerygramam@gmail.com.
        </Text>

        <Text style={styles.sectionTitle}>3. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect the following personal information when you place an order
          or interact with our services:
        </Text>
        <Text style={styles.listItem}>• Name</Text>
        <Text style={styles.listItem}>• Phone number</Text>
        <Text style={styles.listItem}>• Address</Text>
        <Text style={styles.listItem}>• Pincode</Text>
        <Text style={styles.listItem}>• Gender</Text>
        <Text style={styles.listItem}>• Email</Text>
        <Text style={styles.listItem}>• Landmark</Text>
        <Text style={styles.listItem}>• Preferred language</Text>

        <Text style={styles.sectionTitle}>4. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          The information we collect is used to:
        </Text>
        <Text style={styles.listItem}>• Process and deliver your orders</Text>
        <Text style={styles.listItem}>• Provide customer support</Text>
        <Text style={styles.listItem}>• Improve our services and communication</Text>

        <Text style={styles.sectionTitle}>5. Sharing of Information</Text>
        <Text style={styles.paragraph}>
          We do not share your personal information with any third parties
          except where required by law or to facilitate your delivery.
        </Text>

        <Text style={styles.sectionTitle}>6. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement reasonable security measures to protect your personal
          data from unauthorized access, disclosure, or misuse.
        </Text>

        <Text style={styles.sectionTitle}>7. Who Can Use Our Services</Text>
        <Text style={styles.paragraph}>
          Our services are available to individuals aged 13 years and above.
        </Text>

        <Text style={styles.sectionTitle}>8. Payment and Delivery</Text>
        <Text style={styles.paragraph}>
          Payments are collected as cash on delivery. No online payment options
          are available at this time. Delivery times may vary and are not fixed.
        </Text>

        <Text style={styles.sectionTitle}>9. Refunds and Replacements</Text>
        <Text style={styles.paragraph}>
          Refunds or replacements are offered only for damaged products.
        </Text>

        <Text style={styles.sectionTitle}>10. Order Cancellation</Text>
        <Text style={styles.paragraph}>
          Orders can be canceled by contacting us through a phone call.
        </Text>

        <Text style={styles.sectionTitle}>11. User Conduct</Text>
        <Text style={styles.paragraph}>
          Users are expected to use our services respectfully and responsibly.
          Any misuse, fake orders, or abusive behavior will not be tolerated.
        </Text>

        <Text style={styles.sectionTitle}>12. Changes to this Policy</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify this Privacy Policy at any time. Changes
          will be updated within the app.
        </Text>

        <Text style={styles.sectionTitle}>13. Disclaimer</Text>
        <Text style={styles.paragraph}>
          Grocery Gramam is not responsible for product unavailability or delays
          in delivery caused by unavoidable circumstances.
        </Text>

        <Text style={styles.footerText}>
          Last Updated: April 28, 2025
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: myColors.primary,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    marginLeft: 10,
  },
  footerText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginTop: 30,
  },
});
