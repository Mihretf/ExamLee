const db = require("../../services/dbService"); // Import your service

const examRoom = (examId) => `exam_${String(examId)}`;

module.exports = (io, socket) => {
  // 1. Join a room for a specific exam
  socket.on("join_exam", (examId) => {
    socket.join(examRoom(examId));
  });

  // 2. Post a comment (Existing Logic)
  socket.on("post_comment", async (data) => {
    const { examId, content } = data || {};
    const userId = socket.user.id;

    if (!examId || !content || !String(content).trim()) {
      socket.emit("error", { message: "examId and content are required" });
      return;
    }

    try {
      const examOwnerId = await db.getExamOwnerId(examId);
      if (examOwnerId == null) {
        socket.emit("error", { message: "Exam not found" });
        return;
      }

      const newComment = await db.createComment(examId, userId, content.trim());

      // Public broadcast to the exam room
      io.to(examRoom(examId)).emit("receive_comment", newComment);

      // Private notification to owner
      if (Number(userId) !== Number(examOwnerId)) {
        const notif = await db.createNotification(
          examOwnerId,
          userId,
          "NEW_COMMENT",
          examId
        );
        io.to(`user_${examOwnerId}`).emit("new_notification", notif);
      }
      console.log(`Comment and Notification processed for exam ${examId}`);
    } catch (err) {
      console.error("Database error while saving comment:", err);
      socket.emit("error", { message: "Could not save comment" });
    }
  });

  // 3. NEW: Fetch Notification History (The "Inbox" logic)
  socket.on("get_notifications", async () => {
    try {
      const userId = socket.user.id;
      // Pull history from DB
      const notifications = await db.getNotificationsByUser(userId);
      
      // Send the list back ONLY to the requesting user
      socket.emit("notifications_list", notifications);
      console.log(`📦 History: Sent ${notifications.length} notifications to User ${userId}`);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      socket.emit("error", { message: "Failed to load notification history" });
    }
  });
};