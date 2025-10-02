import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserCircle, FaThumbsDown, FaThumbsUp, FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import ImageUploading from "react-images-uploading";
import { FaPlus } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import api from "../api";
import { io, Socket } from "socket.io-client";
const socket = io("http://localhost:4000");

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImgModal, setShowImgModal] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const maxNumber = 5;
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  const openModal = (index) => {
    setStartIndex(index);
    setShowImgModal(true);
  };

  // Fetch single blog
  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/blogs/${id}`);

      setBlog(response.data);
      console.log(response.data);

      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id, token]);

  const onChange = (imageList) => {
    setImages(imageList);
  };
  // Update blog
  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    const existingImages = images
      .filter((img) => !img.file) // images already on server
      .map((img) => img.data_url);
    formData.append("existingImages", JSON.stringify(existingImages));

    // New images
    images.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });

    try {
      await api.put(`/blogs/${id}`, formData);
      setShowUpdateModal(false);
      await fetchBlog();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update blog");
    }
  };

  // Delete blog
  const handleDeleteBlog = async () => {
    try {
      await api.delete(`blogs/${deleteId}`);
      setShowDeleteModal(false);
      setDeleteId(null);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete blog");
    }
  };

  useEffect(() => {
     socket.emit("join_blog", id);

     // 3️⃣ Listen for updates
     const handleUpdateLikes = ({
       blogId,
       likes,
       dislikes,
       likedBy,
       dislikedBy,
     }) => {
       if (blogId === id) {
         setBlog((prev) => ({
           ...prev,
           likes,
           dislikes,
           likedBy,
           dislikedBy,
         }));
       }
     };

     socket.on("update_likes", handleUpdateLikes);

     // 4️⃣ Leave room on unmount
     return () => {
       socket.emit("leave_blog", id);
       socket.off("update_likes", handleUpdateLikes);
     };;
  }, [id]);

  const handleLike = (blog) =>
    socket.emit("like_blog", { blogId: blog._id, currentUserId });
  const handleDislike = (blog) =>
    socket.emit("dislike_blog", { blogId: blog._id, currentUserId });

  if (loading)
    return (
      <p className="p-6 flex item-center justify-center text-gray-500">
        Loading blog...
      </p>
    );
  if (!blog) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-indigo-600 hover:underline mb-6"
      >
        &larr; Back
      </button>
      <div className="flex items-center gap-3 mb-3">
        <FaUserCircle size={26} className="text-gray-600" />
        <span className="font-semibold text-gray-800">
          {blog.userId?.username}
        </span>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">{blog.title}</h1>
      <p className="text-gray-700 mb-2 whitespace-pre-wrap">{blog.content}</p>
      {/* image */}
      <div
        className={`mb-6
              grid gap-0 max-w-lg mx-auto
              ${blog.images.length === 1 ? "grid-cols-1 " : ""}
              ${blog.images.length === 2 ? "grid-cols-2" : ""}
              ${blog.images.length === 3 ? "grid-cols-3" : ""}
              ${blog.images.length === 4 ? "grid-cols-2 grid-rows-2" : ""}
              ${blog.images.length === 4 ? "grid-cols-2 grid-rows-2" : ""}
              ${blog.images.length === 5 ? "disply-none" : ""}
            `}
      >
        {blog.images.length !== 5 &&
          blog.images.map((img, i) => (
            <div
              key={i}
              className="aspect-square relative overflow-hidden  border border-white"
            >
              <img
                src={img}
                className="w-full h-full object-cover"
                onClick={() => openModal(i)}
              />
            </div>
          ))}
      </div>

      {blog.images.length === 5 && (
        <div className="mb-6 grid grid-cols-2 gap-0 max-w-lg mx-auto aspect-square relative overflow-hidden  ">
          {/* Top row (first 2 photos) */}

          {blog.images.slice(0, 2).map((img, i) => (
            <div className="">
              <img
                key={i}
                src={img}
                alt={`photo-${i}`}
                className="w-full h-full object-cover border border-white"
                onClick={() => openModal(i)}
              />
            </div>
          ))}

          {/* Bottom row (next 3 blog.images) */}
          <div className="col-span-2 grid grid-cols-3 ">
            {blog.images.slice(2, 5).map((img, i) => (
              <img
                key={i + 2}
                src={img}
                alt={`photo-${i + 2}`}
                className="w-full h-full object-cover border border-white"
                onClick={() => openModal(i)}
              />
            ))}
          </div>
        </div>
      )}
      {showImgModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowImgModal(false)}
        >
          <div
            className="relative w-[90vw] max-w-4xl h-[80vh] rounded-2xl overflow-hidden bg-black shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImgModal(false)}
              className="absolute top-3 right-3 z-50 text-black hover:text-gray-300 text-2xl"
            >
              ✕
            </button>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              initialSlide={startIndex}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
              className="w-full h-full"
            >
              {blog.images.map((img, i) => (
                <SwiperSlide key={i} className="w-full h-full">
                  <a href={img} target="_blank" rel="noopener noreferrer">
                    <img
                      src={img}
                      alt={`Slide ${i}`}
                      className="w-full h-full object-cover cursor-pointer"
                    />
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}
      {/* Like/Dislike buttons */}
      <div className="flex gap-4 text-center my-3">
        {/* Like button */}
        <button
          onClick={() => handleLike(blog)}
          className="flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition-all duration-200 scale-80"
        >
          {blog.likedBy?.includes(currentUserId) ? (
            <FaThumbsUp className="w-5 h-5 text-blue-600 transition-transform duration-200 scale-110" />
          ) : (
            <FaRegThumbsUp className="w-5 h-5 text-gray-500 hover:text-blue-600 transition-transform duration-200 hover:scale-110" />
          )}
          <span
            className={
              blog.likedBy?.includes(currentUserId)
                ? "text-blue-600"
                : "text-gray-700"
            }
          >
            {blog.likedBy.length}
          </span>
        </button>

        {/* Dislike button */}
        <button
          onClick={() => handleDislike(blog)}
          className="flex items-center gap-1 px-3 py-1 rounded-full font-semibold transition-all duration-200 scale-80"
        >
          {blog.dislikedBy?.includes(currentUserId) ? (
            <FaThumbsDown className="w-5 h-5 text-red-600 transition-transform duration-200 scale-110" />
          ) : (
            <FaRegThumbsDown className="w-5 h-5 text-gray-500 hover:text-red-600 transition-transform duration-200 hover:scale-110" />
          )}
          <span
            className={
              blog.dislikedBy?.includes(currentUserId)
                ? "text-red-600"
                : "text-gray-700"
            }
          >
            {blog.dislikedBy.length}
          </span>
        </button>
      </div>
      {/* update and delete modal  */}
      <div className="flex gap-3  items-center">
        {blog.userId?._id === currentUserId && (
          <button
            onClick={() => {
              setImages(
                blog.images.map((img) => ({
                  data_url: img,
                }))
              );
              setShowUpdateModal(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Update
          </button>
        )}
        {blog.userId?._id === currentUserId && (
          <button
            onClick={() => {
              setDeleteId(blog._id);
              setShowDeleteModal(true);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Update New Blog</h2>
            <form
              onSubmit={handleUpdateBlog}
              className="space-y-4"
              encType="multipart/form-data"
            >
              <input
                type="text"
                placeholder="Blog Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 placeholder-gray-400 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                placeholder="Blog Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-40 px-4 py-2 border placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              {/* image upoading  */}
              <ImageUploading
                multiple
                value={images}
                onChange={onChange}
                maxNumber={maxNumber}
                dataURLKey="data_url"
                onError={(errors, files) => {
                  if (errors.maxNumber) {
                    setError(`You can only upload up to ${maxNumber} images`);
                  }
                }}
              >
                {({
                  imageList,
                  onImageUpload,
                  onImageRemove,
                  isDragging,
                  dragProps,
                }) => (
                  <div className="px-5">
                    <button
                      type="button"
                      style={isDragging ? { color: "red" } : undefined}
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      <FaPlus className="text-2xl mb-1" /> Add Images
                    </button>
                    <div className="flex gap-2 mt-2">
                      {imageList.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.data_url}
                            alt=""
                            className="w-24 h-24 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => onImageRemove(index)}
                            className="absolute top-0 right-0 text-red-500"
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ImageUploading>
              {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Confirm Delete
            </h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this blog? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBlog}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailPage;
