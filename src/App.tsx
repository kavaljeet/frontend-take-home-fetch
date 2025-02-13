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

const App = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/search" replace /> : <Login />
          }
        />
        <Route
          path="/search"
          element={isAuthenticated ? <Search /> : <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
