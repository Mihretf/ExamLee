const db = require("../../services/dbService");

const examRoom = (examId) => `exam_${String(examId)}`;

module.exports = (io, socket) => {
  socket.on("toggle_reaction", async (data) => {
    const { examId, emoji } = data || {};
    if (!examId || !emoji) {
      socket.emit("error", { message: "examId and emoji are required" });
      return;
    }
    const userId = socket.user.id;

    try {
      const ownerId = await db.getExamOwnerId(examId);
      if (ownerId == null) {
        socket.emit("error", { message: "Exam not found" });
        return;
      }

      await db.toggleReaction(examId, userId, emoji);
      const snapshot = await db.getReactionSnapshot(examId);

      io.to(examRoom(examId)).emit("reaction_updated", {
        examId: Number(examId),
        ...snapshot,
      });

      if (userId !== ownerId) {
        const notif = await db.createNotification(
          ownerId,
          userId,
          "NEW_REACTION",
          examId
        );
        io.to(`user_${ownerId}`).emit("new_notification", notif);
      }
    } catch (err) {
      console.error("Database error while toggling reaction:", err);
      socket.emit("error", { message: "Could not update reaction" });
    }
  });

  socket.on("fetch_reactions", async (examId) => {
    if (examId == null) return;
    try {
      const ownerId = await db.getExamOwnerId(examId);
      if (ownerId == null) {
        socket.emit("error", { message: "Exam not found" });
        return;
      }
      const snapshot = await db.getReactionSnapshot(examId);
      socket.emit("reaction_state", {
        examId: Number(examId),
        ...snapshot,
      });
    } catch (err) {
      console.error("fetch_reactions failed:", err);
      socket.emit("error", { message: "Could not load reactions" });
    }
  });
};
