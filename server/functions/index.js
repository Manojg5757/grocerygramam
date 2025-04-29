const functions = require("firebase-functions/v1");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notifyAdminOnOrder = functions.firestore
  .document("orders/{orderId}")
  .onCreate(async (snap, context) => {
    const order = snap.data();

    try {
      // 🔍 Fetch the first admin document where role == "admin"
      const adminQuerySnapshot = await admin.firestore()
        .collection("admin")
        .where("role", "==", "admin")
        .limit(1)
        .get();

      if (adminQuerySnapshot.empty) {
        console.warn("🚫 No admin found");
        return;
      }

      const adminDoc = adminQuerySnapshot.docs[0];
      const adminData = adminDoc.data();
      const adminFcmToken = adminData.fcmToken;
      console.log("🔑 Admin FCM token:", adminFcmToken);

      if (!adminFcmToken) {
        console.warn("⚠️ Admin FCM token not found");
        return;
      }

      // 📢 Prepare and send the notification
      const message = {
        notification: {
          title: "🛒 New Order Placed",
          body: `Order from ${order.customerName || "Customer"}`,
        },
        data: {
          type: 'order',                    // Custom data to identify it's an order
          orderId: context.params.orderId,   // Order ID to pass to the frontend
          customerName: order.customerName || "Customer", // Customer name
        },
        token: adminFcmToken,
      };

      const response = await admin.messaging().send(message);
      console.log("✅ Notification sent successfully:", response);
    } catch (error) {
      console.error("❌ Notification failed:", error);
    }
  });
