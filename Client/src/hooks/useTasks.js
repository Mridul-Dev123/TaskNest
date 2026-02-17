import { useState, useEffect } from "react";
import taskService from "../services/taskService";

/**
 * Custom hook for managing tasks
 * @returns {Object} Task state and methods
 */
export const useTasks = (initialStatus = null) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async (status = initialStatus) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTasks(status);
      setTasks(response.data);
    } catch (error) {
      setError(error.message || "Failed to fetch tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      setError(null);
      const response = await taskService.createTask(taskData);
      setTasks((prev) => [response.data, ...prev]);
      return response.data;
    } catch (error) {
      setError(error.message || "Failed to create task");
      throw error;
    }
  };

  const updateTask = async (taskId, taskData) => {
    try {
      setError(null);
      const response = await taskService.updateTask(taskId, taskData);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? response.data : task))
      );
      return response.data;
    } catch (error) {
      setError(error.message || "Failed to update task");
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      setError(null);
      await taskService.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      setError(error.message || "Failed to delete task");
      throw error;
    }
  };

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    return updateTask(task.id, { status: newStatus });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  };
};
