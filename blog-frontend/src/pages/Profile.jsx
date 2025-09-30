import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from '../api';

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState({ id: "", name: "" });
  

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/user/profile`);
        setUser(response.data);
        
        console.log(response);
        
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (token) fetchData();
    }, [token]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md mt-20">
        <button
          onClick={() => navigate("/")}
          className=" text-indigo-600 hover:underline mb-6"
        >
          &larr; Back
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Profile</h2>
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold">User ID:</span> {user.userId}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Name:</span> {user.username}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
