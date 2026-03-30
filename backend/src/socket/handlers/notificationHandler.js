const db = require("../../services/dbService"); // Import your DB logic

module.exports = (io, socket) => {
  // Logic to trigger a notification (usually called by other handlers)
  socket.on("send_notification", async (data) => {
    const { targetUserId, actionType, targetId } = data;
    const actorId = socket.user.id; // The person who triggered the notification

    try {
      // 1. SAVE TO NEON DB
      const newNotification = await db.createNotification(
        targetUserId, 
        actorId, 
        actionType, 
        targetId
      );

      // 2. EMIT TO TARGET USER'S PRIVATE ROOM
      io.to(`user_${targetUserId}`).emit("new_notification", newNotification);

      console.log(`Notification saved and sent to User ${targetUserId}`);
    } catch (err) {
      console.error("Failed to process notification:", err);
    }
  });

  socket.on("get_my_notifications", async () => {
    try {
      const list = await db.getNotificationsByUser(socket.user.id);
      socket.emit("notifications_list", list);
    } catch (err) {
      console.error(err);
      socket.emit("error", { message: "Could not load notifications" });
    }
  });
};