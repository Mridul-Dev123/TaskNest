import prisma from "./prismaClient.js";

// User related queries

/**
 * Create a new user
 * @param {Object} userData - User data
 * @param {string} userData.username - Username
 * @param {string} userData.password - Password
 * @param {string} [userData.name] - Optional name
 * @returns {Promise<User>} Created user
 */
const createUser = async ({ username, password, name }) => {
  return await prisma.user.create({
    data: {
      username,
      password,
      name,
    },
  });
};

/**
 * Find user by username
 * @param {string} username - Username to search
 * @returns {Promise<User|null>} User or null
 */
const searchByusername = async (username) => {
  return await prisma.user.findUnique({
    where: { username },
  });
};

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {Promise<User|null>} User or null
 */
const getUser = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

/**
 * Get all users
 * @returns {Promise<User[]>} Array of users
 */
const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// Task related queries

/**
 * Create a new task
 * @param {Object} taskData - Task data
 * @param {string} taskData.title - Task title
 * @param {string} [taskData.description] - Optional description
 * @param {string} [taskData.status] - Task status (PENDING or COMPLETED)
 * @param {string} taskData.userId - User ID
 * @returns {Promise<Task>} Created task
 */
const createTask = async ({ title, description, status, userId }) => {
  return await prisma.task.create({
    data: {
      title,
      description,
      status,
      userId,
    },
  });
};

/**
 * Get all tasks for a user
 * @param {string} userId - User ID
 * @param {Object} [filters] - Optional filters
 * @param {string} [filters.status] - Filter by status
 * @returns {Promise<Task[]>} Array of tasks
 */
const getTasksByUserId = async (userId, filters = {}) => {
  const where = { userId };
  
  if (filters.status) {
    where.status = filters.status;
  }

  return await prisma.task.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });
};

/**
 * Get a single task by ID
 * @param {string} id - Task ID
 * @param {string} userId - User ID (for ownership verification)
 * @returns {Promise<Task|null>} Task or null
 */
const getTaskById = async (id, userId) => {
  return await prisma.task.findFirst({
    where: {
      id,
      userId,
    },
  });
};

/**
 * Update a task
 * @param {string} id - Task ID
 * @param {string} userId - User ID (for ownership verification)
 * @param {Object} data - Update data
 * @returns {Promise<Task>} Updated task
 */
const updateTask = async (id, userId, data) => {
  return await prisma.task.update({
    where: {
      id,
      userId,
    },
    data,
  });
};

/**
 * Delete a task
 * @param {string} id - Task ID
 * @param {string} userId - User ID (for ownership verification)
 * @returns {Promise<Task>} Deleted task
 */
const deleteTask = async (id, userId) => {
  return await prisma.task.delete({
    where: {
      id,
      userId,
    },
  });
};

const db = {
  createUser,
  searchByusername,
  getUser,
  getAllUsers,
  createTask,
  getTasksByUserId,
  getTaskById,
  updateTask,
  deleteTask,
};

export default db;
