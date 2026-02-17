import api from "../api/fetchApi.js";

/**
 * Task Service
 * Handles all task-related API calls
 */
const taskService = {
  /**
   * Get all tasks for the authenticated user
   * @param {string} [status] - Filter by status (PENDING or COMPLETED)
   * @returns {Promise} API response with tasks array
   */
  getTasks: (status = null) => {
    const url = status ? `/tasks?status=${status}` : "/tasks";
    return api.get(url);
  },

  /**
   * Get a single task by ID
   * @param {string} taskId - Task ID
   * @returns {Promise} API response with task data
   */
  getTask: (taskId) => api.get(`/tasks/${taskId}`),

  /**
   * Create a new task
   * @param {Object} taskData - Task data
   * @param {string} taskData.title - Task title
   * @param {string} [taskData.description] - Task description
   * @param {string} [taskData.status] - Task status (PENDING or COMPLETED)
   * @returns {Promise} API response with created task
   */
  createTask: (taskData) => api.post("/tasks", taskData),

  /**
   * Update a task
   * @param {string} taskId - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise} API response with updated task
   */
  updateTask: (taskId, taskData) => api.patch(`/tasks/${taskId}`, taskData),

  /**
   * Delete a task
   * @param {string} taskId - Task ID
   * @returns {Promise} API response
   */
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
};

export default taskService;
