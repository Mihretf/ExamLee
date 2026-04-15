const pool = require('../config/db');

const dbService = {
  // FIXED: Changed owner_user_id to uploader_id to match your schema
  getExamOwnerId: async (examId) => {
    const id = Number(examId);
    const result = await pool.query(
      'SELECT uploader_id FROM exams WHERE id = $1',
      [id]
    );
    // Return uploader_id or null if not found
    return result.rows[0]?.uploader_id ?? null;
  },

  // Save a new comment and return the saved row
  createComment: async (examId, userId, content) => {
    const query = `
      INSERT INTO comments (exam_id, user_id, content) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const result = await pool.query(query, [Number(examId), userId, content]);
    return result.rows[0];
  },

  // Save a notification
  createNotification: async (userId, actorId, actionType, targetId) => {
    const query = `
      INSERT INTO notifications (user_id, actor_id, action_type, target_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *;
    `;
    const result = await pool.query(query, [
      userId,
      actorId,
      actionType,
      targetId != null ? Number(targetId) : null,
    ]);
    return result.rows[0];
  },

  getNotificationsByUser: async (userId, limit = 100) => {
    const result = await pool.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY id DESC LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  },

  toggleReaction: async (examId, userId, emoji) => {
    const eid = Number(examId);
    const existing = await pool.query(
      'SELECT emoji FROM reactions WHERE exam_id = $1 AND user_id = $2',
      [eid, userId]
    );
    if (existing.rows.length && existing.rows[0].emoji === emoji) {
      await pool.query(
        'DELETE FROM reactions WHERE exam_id = $1 AND user_id = $2',
        [eid, userId]
      );
      return { removed: true };
    }
    await pool.query(
      `INSERT INTO reactions (exam_id, user_id, emoji)
       VALUES ($1, $2, $3)
       ON CONFLICT (exam_id, user_id)
       DO UPDATE SET emoji = $3, updated_at = NOW()`,
      [eid, userId, emoji]
    );
    return { removed: false };
  },

  getReactionSnapshot: async (examId) => {
    const eid = Number(examId);
    const result = await pool.query(
      'SELECT user_id, emoji FROM reactions WHERE exam_id = $1',
      [eid]
    );
    const counts = {};
    const userReactions = {};
    for (const row of result.rows) {
      counts[row.emoji] = (counts[row.emoji] || 0) + 1;
      userReactions[String(row.user_id)] = row.emoji;
    }
    return { counts, userReactions };
  },
};

module.exports = dbService;