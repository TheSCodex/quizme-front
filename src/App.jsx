import { useRoutes, BrowserRouter as Router } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Home from "./pages/Home.jsx";
import Recover from "./pages/Auth/Recover.jsx";
import Reset from "./pages/Auth/Reset.jsx";

const AppRoutes = () => {
  let routes = useRoutes([
    { path: "/", element: <Login /> },
    { path: "register", element: <Register /> },
    { path: "recover", element: <Recover /> },
    { path: "reset", element: <Reset /> },
    {
      path: "app/",
      element: <Layout />,
      children: [
        { path: "home", element: <Home /> },
        // Add other routes here
      ],
    },
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
