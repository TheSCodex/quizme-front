import {
  useRoutes,
  BrowserRouter as Router,
  Navigate,
  useLocation,
} from "react-router-dom";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Home from "./pages/Home.jsx";
import Recover from "./pages/Auth/Recover.jsx";
import Reset from "./pages/Auth/Reset.jsx";
import Templates from "./pages/Templates/Templates.jsx";
import TemplateForm from "./pages/Templates/TemplateForm.jsx";
import Template from "./pages/Templates/TemplateDetails.jsx";
import TemplateEdit from "./pages/Templates/TemplateEdit.jsx";
import Users from "./pages/Admin/Users.jsx";
import Form from "./pages/Forms/Form.jsx";
import UserForm from "./pages/users/UserForm.jsx";

const AppRoutes = () => {
  const authToken =
    sessionStorage.getItem("authToken") || localStorage.getItem("authToken");

  let isLoggedIn = false;
  let isAdmin = false;

  if (authToken) {
    isLoggedIn = true;
    const decodedToken = jwtDecode(authToken);
    isAdmin = decodedToken.role === "admin";
  }

  const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    return isLoggedIn ? (
      children
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  };

  ProtectedRoute.propTypes = {
    children: PropTypes.node,
  };

  const AdminRoute = ({ children }) => {
    return isAdmin ? children : <Navigate to="/" replace />;
  };

  AdminRoute.propTypes = {
    children: PropTypes.node,
  };

  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "templates", element: <Templates /> },
        {
          path: "user/settings",
          element: (
            <ProtectedRoute>
              <UserForm />
            </ProtectedRoute>
          ),
        },
        {
          path: "templates/new",
          element: (
            <ProtectedRoute>
              <TemplateForm />
            </ProtectedRoute>
          ),
        },
        {
          path: "template/show/:templateId",
          element: (
            <ProtectedRoute>
              <Template />
            </ProtectedRoute>
          ),
        },
        {
          path: "template/edit/:templateId",
          element: (
            <ProtectedRoute>
              <TemplateEdit />
            </ProtectedRoute>
          ),
        },
        {
          path: "admin/users",
          element: (
            <AdminRoute>
              <Users />
            </AdminRoute>
          ),
        },
        {
          path: "form/:templateId/:formId",
          element: (
            <ProtectedRoute>
              <Form />
            </ProtectedRoute>
          ),
        },
      ],
    },
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
    { path: "recover", element: <Recover /> },
    { path: "reset", element: <Reset /> },
  ]);

  return routes;
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
