import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

/**
 * Tasks Page Component
 * Main page for displaying and managing tasks
 */
const TasksPage = () => {
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
  } = useTasks();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("ALL");

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  // Filter tasks based on selected filter
  const filteredTasks = tasks.filter((task) => {
    if (filter === "ALL") return true;
    return task.status === filter;
  });

  const pendingCount = tasks.filter((t) => t.status === "PENDING").length;
  const completedCount = tasks.filter((t) => t.status === "COMPLETED").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>

        {/* Stats and Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Tasks</p>
                <p className="text-3xl font-bold text-blue-900">{tasks.length}</p>
              </div>
              <svg
                className="w-12 h-12 text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </Card>

          <Card className="bg-linear-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-900">{pendingCount}</p>
              </div>
              <svg
                className="w-12 h-12 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </Card>

          <Card className="bg-linear-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <p className="text-3xl font-bold text-green-900">{completedCount}</p>
              </div>
              <svg
                className="w-12 h-12 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </Card>
        </div>

        {/* Filter and Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              onClick={() => setFilter("ALL")}
              variant={filter === "ALL" ? "primary" : "outline"}
              className="text-sm"
            >
              All
            </Button>
            <Button
              onClick={() => setFilter("PENDING")}
              variant={filter === "PENDING" ? "primary" : "outline"}
              className="text-sm"
            >
              Pending
            </Button>
            <Button
              onClick={() => setFilter("COMPLETED")}
              variant={filter === "COMPLETED" ? "primary" : "outline"}
              className="text-sm"
            >
              Completed
            </Button>
          </div>

          <Button onClick={() => setIsModalOpen(true)} variant="success">
            + Create Task
          </Button>
        </div>

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          error={error}
          onUpdate={updateTask}
          onDelete={handleDeleteTask}
          onToggleStatus={toggleTaskStatus}
        />

        {/* Create Task Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Task"
        >
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default TasksPage;
