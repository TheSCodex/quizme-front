import { useRoutes, BrowserRouter as Router, Navigate } from "react-router-dom";
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

  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "templates", element: <Templates /> },
        {
          path: "templates/new",
          element: isLoggedIn ? <TemplateForm /> : <Navigate to="/login" />,
        },
        { path: "template/show/:templateId", element: <Template /> },
        {
          path: "template/edit/:templateId",
          element: isLoggedIn ? <TemplateEdit /> : <Navigate to="/login" />,
        },
        {
          path: "admin/users",
          element: isAdmin ? <Users /> : <Navigate to="/" />,
        },
        { path: "form/:templateId/:formId", element: <Form /> },
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
