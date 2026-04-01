const db = require("../../services/dbService");

const examRoom = (examId) => `exam_${String(examId)}`;

module.exports = (io, socket) => {
  // 1. Toggle Reaction (Add/Remove)
  socket.on("toggle_reaction", async (data) => {
    const { examId, emoji } = data || {};
    const userId = socket.user.id;

    if (!examId || !emoji) {
      socket.emit("error", { message: "examId and emoji are required" });
      return;
    }

    try {
      const ownerId = await db.getExamOwnerId(examId);
      if (ownerId == null) {
        socket.emit("error", { message: "Exam not found" });
        return;
      }

      // Perform the toggle in DB
      const result = await db.toggleReaction(examId, userId, emoji);
      
      // Get the fresh count/state
      const snapshot = await db.getReactionSnapshot(examId);

      // Tell everyone in the room to update their UI
      io.to(examRoom(examId)).emit("reaction_updated", {
        examId: Number(examId),
        ...snapshot,
      });

      // Notify the owner if it was an ADD (not a removal)
      if (!result.removed && Number(userId) !== Number(ownerId)) {
        const notif = await db.createNotification(
          ownerId,
          userId,
          "NEW_REACTION",
          examId
        );
        io.to(`user_${ownerId}`).emit("new_notification", notif);
      }
      
      console.log(`✨ Reaction ${result.removed ? 'removed' : 'added'} by User ${userId}`);
    } catch (err) {
      console.error("Database error while toggling reaction:", err);
      socket.emit("error", { message: "Could not update reaction" });
    }
  });

  // 2. Fetch Reactions (To load initial state when user joins)
  socket.on("fetch_reactions", async (examId) => {
    if (examId == null) return;
    try {
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