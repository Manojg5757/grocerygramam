const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifyAdminOnOrder = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const order = snap.data();
    const orderId = context.params.orderId;

    try {
      // First get admin document based on role
      const adminSnapshot = await admin.firestore()
        .collection("admin")
        .where("role", "==", "admin")
        .get();

      if (adminSnapshot.empty) {
        console.warn("🚫 No admin user found");
        return;
      }

      // Get the first admin document
      const adminDoc = adminSnapshot.docs[0];
      const adminId = adminDoc.id;

      // Then get the admin's user document for FCM token
      const adminUserDoc = await admin.firestore()
        .collection("users")
        .doc(adminId)
        .get();

      if (!adminUserDoc.exists) {
        console.warn("🚫 Admin user document not found");
        return;
      }

      const adminData = adminUserDoc.data();
      console.log("📱 Admin user data:", JSON.stringify(adminData, null, 2));
      
      const adminFcmToken = adminData.fcmToken;
      if (!adminFcmToken) {
        console.warn("⚠️ Admin FCM token not found in user document");
        return;
      }

      console.log("✅ Found admin FCM token:", adminFcmToken);

      // Send notification to admin
      try {
        const adminMessage = {
          notification: {
            title: "🛒 New Order Placed",
            body: `Order #${orderId.slice(0, 8)} from ${order.customerName || "Customer"}`
          },
          data: {
            type: "order",
            orderId: orderId,
            customerName: order.customerName || "Customer",
            totalAmount: order.totalAmount?.toString() || "0",
            timestamp: new Date().toISOString(),
            screen: "AdminDashboard",
            click_action: "FLUTTER_NOTIFICATION_CLICK",
            // Include notification content in data payload for background handling
            title: "🛒 New Order Placed",
            body: `Order #${orderId.slice(0, 8)} from ${order.customerName || "Customer"}`
          },
          token: adminFcmToken,
          android: {
            priority: "high",
            notification: {
              channelId: "orders",
              priority: "max",
              visibility: "public",
              sound: "default",
              defaultSound: true,
              tag: "order_notification"  // This helps prevent notification stacking
            }
          }
        };

        const adminResponse = await admin.messaging().send(adminMessage);
        console.log("✅ Admin notification sent:", adminResponse);
      } catch (error) {
        if (error.code === 'messaging/registration-token-not-registered') {
          // Clear invalid token from user document
          await adminUserDoc.ref.update({
            fcmToken: admin.firestore.FieldValue.delete()
          });
          console.warn("⚠️ Removed invalid admin FCM token");
        } else {
          console.error("❌ Error sending admin notification:", error);
        }
      }

      // Send notification to customer
      const customerId = order.userId;
      if (!customerId) {
        console.warn("⚠️ Order missing userId");
        return;
      }

      const customerDoc = await admin.firestore()
        .collection("users")
        .doc(customerId)
        .get();

      if (!customerDoc.exists) {
        console.warn("🚫 Customer not found");
        return;
      }

      const customerData = customerDoc.data();
      const customerFcmToken = customerData.fcmToken;

      if (!customerFcmToken) {
        console.warn("⚠️ Customer FCM token not found");
        return;
      }

      // Send notification to customer
      try {
        const isTamil = customerData.languagePref === "ta";
        const customerMessage = {
          notification: {
            title: isTamil ? "🛒 உங்கள் ஆர்டர் வந்தது!" : "🛒 Order Received",
            body: isTamil
              ? `வணக்கம் ${customerData.username || "வாடிக்கையாளர்"}, உங்கள் ஆர்டர் உறுதி செய்யப்பட்டது!`
              : `Hi ${customerData.username || "Customer"}, your order is confirmed!`
          },
          data: {
            type: "order",
            orderId: orderId,
            totalAmount: order.totalAmount?.toString() || "0",
            timestamp: new Date().toISOString(),
            screen: "Orders"
          },
          token: customerFcmToken,
          android: {
            priority: "high",
            notification: {
              channelId: "orders",
              sound: "default"
            }
          },
          apns: {
            payload: {
              aps: {
                sound: "default"
              }
            }
          }
        };

        const customerResponse = await admin.messaging().send(customerMessage);
        console.log("✅ Customer notification sent:", customerResponse);
      } catch (error) {
        if (error.code === 'messaging/registration-token-not-registered') {
          // Clear invalid token
          await customerDoc.ref.update({
            fcmToken: admin.firestore.FieldValue.delete()
          });
          console.warn("⚠️ Removed invalid customer FCM token");
        } else {
          console.error("❌ Error sending customer notification:", error);
        }
      }

    } catch (error) {
      console.error("❌ Error in notification process:", error);
      throw error; // Re-throw to mark function as failed
    }
  });
