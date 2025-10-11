import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import BlogList from "../components/blogs/BlogList";
import BlogCreateModal from "../components/blogs/BlogCreateModal";
import BlogUpdateModal from "../components/blogs/BlogUpdateModal";
import BlogDeleteModal from "../components/blogs/BlogDeleteModal";
import { setShowCreateModal, fetchBlogs, updateLikes } from "../components/blogs/blogSlice";
import ImageUploading from "react-images-uploading";
import { jwtDecode } from "jwt-decode";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { io } from "socket.io-client";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

 const tokenExpire = (token) => {
   try {
     const decoded = jwtDecode(token);
     const currentTime = Date.now() / 1000;
     return decoded.exp < currentTime;
   } catch (e) {
     return true;
   }
 };


const currentUserId = localStorage.getItem("userId");
const socket = io("http://localhost:4000", { auth: { currentUserId } });

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const isExpired = tokenExpire(token);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const {
    items: blogs,
    showCreateModal,
    showUpdateModal,
    showDeleteModal,
  } = useSelector((s) => s.blogs);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_blog", (data) => {
      if (data.blog.userId._id !== currentUserId) {
        dispatch(fetchBlogs());

        setNotificationMessage(data.notification || "A new blog was posted!");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 5000);
      }
    });

    return () => socket.off("new_blog");
  }, [socket, currentUserId, dispatch]);
  
  
  const openModal = (blog, index) => {
    // handle image modal if needed
  };
 

 
   if (isExpired) {
     return (
       <div className="text-center py-20">
         <p className="text-lg text-gray-700 mb-4">
           Your token is Expired
         </p>
         <Link
           to="/login"
           className="text-indigo-600 hover:underline text-sm font-medium"
         >
           Please Login again
         </Link>
       </div>
     );
   }
  if (!token || !currentUserId) {
   
       return (
         <div className="text-center py-20">
           <p className="text-lg text-gray-700 mb-4">
             You're not allowed to see posts.
           </p>
           <Link
             to="/login"
             className="text-indigo-600 hover:underline text-sm font-medium"
           >
             Please Login
           </Link>
         </div>
       );
     
     
   }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {showNotification && (
        <div className="fixed top-5 right-5 bg-indigo-600 text-white px-5 py-3 rounded-lg shadow-lg animate-slide-in z-50">
          {notificationMessage}
        </div>
      )}
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Dashboard</h1>
          <button
            onClick={() => dispatch(setShowCreateModal(true))}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            + New Blog
          </button>

          {token && (
            <button
              onClick={() => navigate("/profile")}
              className="text-gray-700 hover:text-gray-900"
              title="Profile"
            >
              <FaUserCircle size={28} />
            </button>
          )}
        </div>
        <BlogList/>

        {showCreateModal && <BlogCreateModal />}
        {showUpdateModal && <BlogUpdateModal />}
        {showDeleteModal && <BlogDeleteModal />}
      </div>
    </div>
  );
}
export default Home;
