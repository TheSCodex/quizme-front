import { useRoutes, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Home from "./pages/Home.jsx";
import Recover from "./pages/Auth/Recover.jsx";
import Reset from "./pages/Auth/Reset.jsx";
import Templates from "./pages/Templates/Templates.jsx";
import TemplateForm from "./pages/Templates/TemplateForm.jsx";

const AppRoutes = () => {
  let routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "templates", element: <Templates /> },
        { path: "templates/new", element: <TemplateForm /> },
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
