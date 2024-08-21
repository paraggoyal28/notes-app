import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords should match");
      return;
    }

    setError("");

    // login api
    try {
      const response = await axiosInstance.put("/forgot-password", {
        email: email,
        password: password,
      });

      // Handle successful login response
      if (response?.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      // Handling login error
      if (error?.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-cetner justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form onSubmit={handlePasswordChange}>
            <h4 className="text-2xl mb-7">Password Update</h4>
            <input
              data-testid="Email"
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && (
              <p className="text-red-500 text-xs pb-1" data-testid="Error">
                {error}
              </p>
            )}
            <button
              data-testid="Password Update Button"
              type="submit"
              className="btn-primary"
            >
              Update password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
