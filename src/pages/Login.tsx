import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import { RootState, AppDispatch } from "../store";
import { useNavigate } from "react-router-dom";
import { baseName } from '../router'

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch<AppDispatch>(); 
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login({ name, email })); 
    navigate(`/${baseName}/search` , { replace: true }); 
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        {error && <p className="text-red-500 text-sm">{error}</p>} {/* ✅ Show error if login fails */}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          disabled={loading} 
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
