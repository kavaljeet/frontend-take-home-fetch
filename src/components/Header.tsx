import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { AppDispatch } from "../store";
import { useNavigate } from "react-router-dom";
import { baseName } from "../router";

const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate(`/${baseName}`);
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex flex-wrap justify-between items-center">
      <h1 className="text-xl font-bold flex items-center gap-2">
        🐶 FetchFinder
      </h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full sm:w-auto mt-2 sm:mt-0"
      >
        Logout
      </button>
    </header>
  );
};

export default Header;
