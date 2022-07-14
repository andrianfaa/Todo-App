import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PublicRoute } from "app/routes";

function AppRouter() {
  return (
    <Router>
      <Routes>
        {PublicRoute.map((route) => {
          const Element = route.element;

          return <Route key={route.path} path={route.path} element={<Element />} />;
        })}
      </Routes>
    </Router>
  );
}

export default AppRouter;
