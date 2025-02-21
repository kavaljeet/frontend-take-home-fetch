import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import Login from "./pages/Login";
import Search from "./pages/Search";
import { baseName } from "./router";

const App = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <Router>
      <Routes>
        <Route
          path={`/${baseName}`}
          element={
            isAuthenticated ? <Navigate to={`/${baseName}/search`} replace /> : <Login />
          }
        />
        <Route
          path={`/${baseName}/search`}
          element={isAuthenticated ? <Search /> : <Navigate to={`/${baseName}`} replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
