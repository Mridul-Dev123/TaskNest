import { Navigate } from "react-router-dom";
import App from "../App";
import ProtectedRoute from "../components/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import TasksPage from "../pages/TasksPage";

const routes = [
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
];

export default routes;
