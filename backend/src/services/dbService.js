const pool = require('../config/db');

const dbService = {
  // Save a new comment and return the saved row
  createComment: async (examId, userId, content) => {
    const query = `
      INSERT INTO comments (exam_id, user_id, content) 
      VALUES ($1, $2, $3) 
      RETURNING *;
    `;
    const result = await pool.query(query, [examId, userId, content]);
    return result.rows[0];
  },

  // Save a notification
  createNotification: async (userId, actorId, actionType, targetId) => {
    const query = `
      INSERT INTO notifications (user_id, actor_id, action_type, target_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *;
    `;
    const result = await pool.query(query, [userId, actorId, actionType, targetId]);
    return result.rows[0];
  }
};

module.exports = dbService;