const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifyAdminOnOrder = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const order = snap.data();
    const orderId = context.params.orderId;

    try {
      // 🔍 Fetch the first admin document where role == "admin"
      const adminQuerySnapshot = await admin.firestore()
        .collection("admin")
        .where("role", "==", "admin")
        .limit(1)
        .get();

      if (adminQuerySnapshot.empty) {
        console.warn("🚫 No admin found");
      } else {
        const adminDoc = adminQuerySnapshot.docs[0];
        const adminData = adminDoc.data();
        const adminFcmToken = adminData.fcmToken;

        if (adminFcmToken) {
          // 📢 Send notification to admin
          const adminMessage = {
            notification: {
              title: "🛒 New Order Placed",
              body: `Order from ${order.customerName || "Customer"}`,
            },
            data: {
              type: "order",
              orderId: orderId,
              customerName: order.customerName || "Customer",
            },
            token: adminFcmToken,
          };

          const adminResponse = await admin.messaging().send(adminMessage);
          console.log("✅ Admin notification sent:", adminResponse);
        } else {
          console.warn("⚠️ Admin FCM token not found");
        }
      }

      // 📲 Notify the customer
      const customerId = order.userId;
      if (!customerId) {
        console.warn("⚠️ Order missing userId");
        return;
      }

      // 🔍 Fetch customer details
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

      // 📢 Prepare language-based notification for customer
      const isTamil = customerData.languagePref === "ta";

      const customerMessage = {
        notification: {
          title: isTamil ? "🛒 உங்கள் ஆர்டர் வந்தது!" : "🛒 Order Received",
          body: isTamil
            ? `வணக்கம் ${customerData.username || "வாடிக்கையாளர்"}, உங்கள் ஆர்டர் உறுதி செய்யப்பட்டது!`
            : `Hi ${customerData.username || "Customer"}, your order is confirmed!`,
        },
        data: {
          type: "order",
          orderId: orderId,
          totalAmount: order.totalAmount.toString(),
        },
        token: customerFcmToken,
      };

      const customerResponse = await admin.messaging().send(customerMessage);
      console.log("✅ Customer notification sent:", customerResponse);

    } catch (error) {
      console.error("❌ Error sending notifications:", error);
    }
  });
