import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import {jwtDecode} from "jwt-decode";

function Otp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("otpUserId");

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return; // allow only 1 digit
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // auto-focus next input
    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput.focus();
    }
  };

  const confirmOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      alert("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/otp/confirm", {
        userId,
        otp: otpValue,
      });

      alert("OTP verified successfully!");
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      localStorage.setItem("userId", decoded.sub);
      localStorage.setItem("username", decoded.username);
      if (token) localStorage.setItem("auth", "true");

      navigate("/");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const requestOtp = async () => {
    try {
      await api.post("/otp/request", { userId });
      alert("OTP sent to your email!");
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };
    
    //  useEffect(() => {
    //    requestOtp();
    //  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Enter OTP</h2>
        <p className="text-gray-500 text-center mb-6">
          We sent a 6-digit OTP to your email/phone
        </p>

        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              maxLength={1}
              className="w-12 h-12 text-center text-xl rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
            />
          ))}
        </div>

        <button
          onClick={confirmOtp}
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 mb-3"
        >
          {loading ? "Verifying..." : "Confirm OTP"}
        </button>

        <button
          onClick={requestOtp}
          className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
}

export default Otp;
