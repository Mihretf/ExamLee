const db = require("../../services/dbService"); // Import your service

const examRoom = (examId) => `exam_${String(examId)}`;

module.exports = (io, socket) => {
  // 1. Join a room for a specific exam
  socket.on("join_exam", (examId) => {
    socket.join(examRoom(examId));
  });

  // 2. Post a comment
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

      io.to(examRoom(examId)).emit("receive_comment", newComment);

      if (userId !== examOwnerId) {
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
};