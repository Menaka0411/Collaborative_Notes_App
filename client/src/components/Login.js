import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorField, setErrorField] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("username", response.data.user.username);
      localStorage.setItem("email", response.data.user.email);

      setIsLoggedIn(true);
      navigate("/"); 
    } catch (err) {
      setErrorField("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg space-y-6">
        <h2 className="text-3xl font-bold text-center">Welcome Back</h2>
        <p className="text-center text-gray-600">Please login to continue</p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-5 py-3 border rounded-xl text-base focus:outline-none ${errorField ? "border-red-500" : ""}`}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-5 py-3 border rounded-xl text-base focus:outline-none ${errorField ? "border-red-500" : ""}`}
          />

          {errorField && <p className="text-red-500 text-sm text-center mt-1">{errorField}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition text-lg font-medium">
          Login
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
