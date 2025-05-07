import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorField, setErrorField] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  if (password !== confirmPassword) {
    setErrorField("Passwords do not match");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/api/auth/register", {
      username,
      email,
      password,
    });

    if (response.data.success) {
      alert("Registered successfully!");
      navigate("/login");
    }
  } catch (err) {
    if (err.response?.data?.message) {
      setErrorField(err.response.data.message);
    } else {
      setErrorField("Registration failed, please try again");
    }
  }
};


  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md sm:max-w-lg space-y-6">
        <h2 className="text-3xl font-bold text-center">Create an Account</h2>
        <p className="text-center text-gray-600">Please register to continue</p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}  // Manage username state
            className={`w-full px-5 py-3 border rounded-xl text-base focus:outline-none ${errorField ? "border-red-500" : ""}`}
          />

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

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-5 py-3 border rounded-xl text-base focus:outline-none ${errorField ? "border-red-500" : ""}`}
          />

          {errorField && <p className="text-red-500 text-sm text-center mt-1">{errorField}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition text-lg font-medium">
          Register
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login here
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
