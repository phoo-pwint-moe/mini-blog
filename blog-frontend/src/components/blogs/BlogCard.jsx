import {
  FaUserCircle,
  FaRegThumbsUp,
  FaThumbsUp,
  FaRegThumbsDown,
  FaThumbsDown,
} from "react-icons/fa";
import { HiTrash, HiPencil } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setShowDeleteModal,
  setDeleteId,
  setShowUpdateModal,
  setUpdateBlog,
} from "./blogSlice";


const currentUserId = localStorage.getItem("userId");


function BlogCard({ blog, openModal, socket }) {
  const dispatch = useDispatch();
  
  const truncateWords = (text, wordLimit = 10) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };

  const handleLike = () => {
    socket.emit("like_blog", { blogId: blog._id, currentUserId });
  };

  const handleDislike = () => {
    socket.emit("dislike_blog", { blogId: blog._id, currentUserId });
  };

  return (
    <div className="bg-white rounded-xl w-xl shadow p-6 hover:shadow-lg transition relative">
      <div className="flex items-center gap-3 mb-3">
        <FaUserCircle size={26} className="text-gray-600" />
        <span className="font-semibold text-gray-800">
          {blog.userId?.username}
        </span>
      </div>

      <h2 className="text-xl font-semibold text-gray-900">{blog.title}</h2>
      <p className="mt-2 text-gray-600 line-clamp-3">
        {truncateWords(blog.content, 10)}
      </p>

      {/* Images preview */}
      <div
        className={`my-5 grid gap-0
          ${blog.images.length === 1 ? "grid-cols-1" : ""}
          ${blog.images.length === 2 ? "grid-cols-2" : ""}
          ${blog.images.length === 3 ? "grid-cols-3" : ""}
          ${blog.images.length >= 4 ? "grid-cols-2 grid-rows-2" : ""}`}
      >
        {blog.images
          .slice(0, blog.images.length >= 4 ? 4 : blog.images.length)
          .map((img, i) => (
            <div
              key={i}
              className="aspect-square relative overflow-hidden border border-white"
            >
              {" "}
              <Link
                to={`/detail/${blog._id}`}
                className="mt-4 text-indigo-600 hover:underline text-sm"
              >
                <img
                  src={img}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => openModal(blog, i)}
                />
              </Link>
              {i === 3 && blog.images.length > 4 && (
                <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center text-white text-2xl font-bold">
                  +{blog.images.length - 4}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Like/Dislike buttons */}
      <div className="flex gap-4 text-center my-3">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 px-3 py-1 rounded-full font-semibold"
        >
          {blog.likedBy?.includes(currentUserId) ? (
            <FaThumbsUp className="w-5 h-5 text-blue-600" />
          ) : (
            <FaRegThumbsUp className="w-5 h-5 text-gray-500 hover:text-blue-600" />
          )}
          <span
            className={
              blog.likedBy?.includes(currentUserId)
                ? "text-blue-600"
                : "text-gray-700"
            }
          >
            {blog.likes}
          </span>
        </button>

        <button
          onClick={handleDislike}
          className="flex items-center gap-1 px-3 py-1 rounded-full font-semibold"
        >
          {blog.dislikedBy?.includes(currentUserId) ? (
            <FaThumbsDown className="w-5 h-5 text-red-600" />
          ) : (
            <FaRegThumbsDown className="w-5 h-5 text-gray-500 hover:text-red-600" />
          )}
          <span
            className={
              blog.dislikedBy?.includes(currentUserId)
                ? "text-red-600"
                : "text-gray-700"
            }
          >
            {blog.dislikes}
          </span>
        </button>
      </div>

      {/* Edit/Delete buttons for owner */}
      {blog.userId?._id === currentUserId && (
        <>
          <button
            onClick={() => {
              dispatch(setUpdateBlog(blog));
              dispatch(setShowUpdateModal(true));
            }}
            className="absolute top-6 right-12 text-blue-500 hover:text-blue-700"
            title="Edit blog"
          >
            <HiPencil size={20} />
          </button>
          <button
            onClick={() => {
              dispatch(setDeleteId(blog._id));
              dispatch(setShowDeleteModal(true));
            }}
            className="absolute top-6 right-5 text-red-500 hover:text-red-700"
            title="Delete blog"
          >
            <HiTrash size={20} />
          </button>
        </>
      )}

      <p className="text-gray-600 text-sm absolute bottom-6 right-5">
        {new Date(blog.createdAt).toLocaleString()}
      </p>
      <Link
        to={`/detail/${blog._id}`}
        className="mt-4 text-indigo-600 hover:underline text-sm"
      >
        Read more
      </Link>
    </div>
  );
}

export default BlogCard;
