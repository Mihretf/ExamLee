const db = require("../../services/dbService"); // Import your service

module.exports = (io, socket) => {
  // 1. Join a room for a specific exam
  socket.on("join_exam", (examId) => {
    socket.join(`exam_${examId}`);
  });

  // 2. Post a comment
  socket.on("post_comment", async (data) => {
    const { examId, content, examOwnerId} = data;
    const userId = socket.user.id; // Get this from the JWT-verified socket

    try {
      // SAVE TO NEON FIRST
      const newComment = await db.createComment(examId, userId, content);

      // SEND TO EVERYONE IN THE ROOM
      io.to(`exam_${examId}`).emit("receive_comment", newComment);

      if (userId !== examOwnerId) { // Don't notify me if I comment on my own exam!
        const notif = await db.createNotification(
          examOwnerId, 
          userId, 
          'NEW_COMMENT', 
          examId
        );
        
        // Push the notification to the owner's private room instantly
        io.to(`user_${examOwnerId}`).emit("new_notification", notif);
      }
      // ------------------------------------
       console.log(`Comment and Notification processed for exam ${examId}`);
     } catch (err) {
      console.error("Database error while saving comment:", err);
      socket.emit("error", { message: "Could not save comment" });
    }
  });
};