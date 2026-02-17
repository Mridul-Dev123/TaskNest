import {ApiError, ApiResponse, asyncHandler} from "../utils/index.js";
import db from "../database/queries.js";

/**
 * Get all tasks for the authenticated user
 * @route GET /api/tasks
 * @access Private
 * @query {string} [status] - Filter by status (PENDING or COMPLETED)
 */
const getTasks = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { status } = req.query;

  // Validate status if provided
  if (status && !['PENDING', 'COMPLETED'].includes(status)) {
    throw new ApiError(400, "Invalid status. Must be PENDING or COMPLETED");
  }

  const filters = status ? { status } : {};
  const tasks = await db.getTasksByUserId(userId, filters);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        tasks,
        `Retrieved ${tasks.length} task${tasks.length !== 1 ? 's' : ''} successfully`
      )
    );
});

/**
 * Get a single task by ID
 * @route GET /api/tasks/:id
 * @access Private
 */
const getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id) {
    throw new ApiError(400, "Task ID is required");
  }

  const task = await db.getTaskById(id, userId);

  if (!task) {
    throw new ApiError(404, "Task not found or you don't have permission to access it");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task retrieved successfully"));
});

/**
 * Create a new task
 * @route POST /api/tasks
 * @access Private
 * @body {string} title - Task title (required)
 * @body {string} [description] - Task description (optional)
 * @body {string} [status] - Task status (PENDING or COMPLETED, default: PENDING)
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const userId = req.user.id;

  // Validate required fields
  if (!title || title.trim() === '') {
    throw new ApiError(400, "Task title is required");
  }

  // Validate status if provided
  if (status && !['PENDING', 'COMPLETED'].includes(status)) {
    throw new ApiError(400, "Invalid status. Must be PENDING or COMPLETED");
  }

  const taskData = {
    title: title.trim(),
    userId,
  };

  if (description) {
    taskData.description = description.trim();
  }

  if (status) {
    taskData.status = status;
  }

  const newTask = await db.createTask(taskData);

  return res
    .status(201)
    .json(new ApiResponse(201, newTask, "Task created successfully"));
});

/**
 * Update a task
 * @route PATCH /api/tasks/:id
 * @access Private
 * @body {string} [title] - Task title
 * @body {string} [description] - Task description
 * @body {string} [status] - Task status (PENDING or COMPLETED)
 */
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const { title, description, status } = req.body;

  if (!id) {
    throw new ApiError(400, "Task ID is required");
  }

  // Check if task exists and belongs to user
  const existingTask = await db.getTaskById(id, userId);
  if (!existingTask) {
    throw new ApiError(404, "Task not found or you don't have permission to update it");
  }

  // Validate at least one field is provided
  if (!title && !description && !status && description !== '') {
    throw new ApiError(400, "At least one field (title, description, or status) must be provided");
  }

  // Build update data
  const updateData = {};

  if (title !== undefined) {
    if (title.trim() === '') {
      throw new ApiError(400, "Task title cannot be empty");
    }
    updateData.title = title.trim();
  }

  if (description !== undefined) {
    updateData.description = description.trim() || null;
  }

  if (status !== undefined) {
    if (!['PENDING', 'COMPLETED'].includes(status)) {
      throw new ApiError(400, "Invalid status. Must be PENDING or COMPLETED");
    }
    updateData.status = status;
  }

  const updatedTask = await db.updateTask(id, userId, updateData);

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

/**
 * Delete a task
 * @route DELETE /api/tasks/:id
 * @access Private
 */
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id) {
    throw new ApiError(400, "Task ID is required");
  }

  // Check if task exists and belongs to user
  const existingTask = await db.getTaskById(id, userId);
  if (!existingTask) {
    throw new ApiError(404, "Task not found or you don't have permission to delete it");
  }

  await db.deleteTask(id, userId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Task deleted successfully"));
});

const taskController = {getTasks, getTask, createTask, updateTask, deleteTask};

export default taskController;