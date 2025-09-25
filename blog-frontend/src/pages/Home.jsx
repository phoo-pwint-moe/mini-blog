import React, { useEffect, useState } from "react";
import axios from "axios";
import { HiTrash } from "react-icons/hi";
import { FaUserCircle } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ImageUploading from "react-images-uploading";

function Home() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const maxNumber = 5;

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const Api = "http://localhost:4000";

  const token = localStorage.getItem("token");

  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${Api}/blogs`, {});
        const sorted = response.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setBlogs(sorted);
        console.log(sorted);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [token]);

  const truncateWords = (text, wordLimit = 10) => {
    const words = text.split(" ");
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(" ") + "...";
  };
  const onChange = (imageList) => {
    setImages(imageList);
  };

  // Create new blog
  const handleCreateBlog = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Please fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    images.forEach((img) => {
      formData.append("images", img.file);
    });
    try {
      const response = await axios.post(`${Api}/blogs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Add new blog to list
      setBlogs([response.data, ...blogs]);
      setTitle("");
      setContent("");
      setImages([]);
      setShowModal(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create blog");
    }
  };

  // Delete blog
  const handleDeleteBlog = async () => {
    try {
      await axios.delete(`${Api}/blogs/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteModal(false);
      setBlogs(blogs.filter((blog) => blog._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete blog");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Dashboard</h1>
          <div className="flex items-center gap-4">
            {token && (
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow"
              >
                + New Blog
              </button>
            )}

            {token ? (
              <button
                onClick={() => navigate("/profile")}
                className="absloute text-gray-700 hover:text-gray-900 right-5 "
                title="Profile"
              >
                <FaUserCircle size={28} />
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="absloute text-gray-700 hover:text-gray-900 right-5 "
              >
                Login
              </button>
            )}
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
                <h2 className="text-xl font-bold mb-4">Create New Blog</h2>
                <form
                  onSubmit={handleCreateBlog}
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
                  <ImageUploading
                    multiple
                    value={images}
                    onChange={onChange}
                    maxNumber={maxNumber}
                    dataURLKey="data_url"
                    onError={(errors, files) => {
                      if (errors.maxNumber) {
                        setError(
                          `You can only upload up to ${maxNumber} images`
                        );
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
                  {error && (
                    <p className="text-red-500 text-sm mb-2">{error}</p>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
        {loading ? (
          <p className="text-gray-600">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <p className="text-gray-500">No blogs yet. Create one!</p>
        ) : (
          <div className="grid grid-cols-1 gap-2 justify-items-center">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className=" bg-white rounded-xl w-xl shadow p-6 hover:shadow-lg transition relative"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FaUserCircle size={26} className="text-gray-600" />
                  <span className="font-semibold text-gray-800">
                    {blog.userId?.username}
                  </span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900">
                  {blog.title}
                </h2>

                <p className="mt-2 text-gray-600 line-clamp-3">
                  {truncateWords(blog.content, 10)}
                </p>

                {blog.images && blog.images.length > 0 && (
                  <div className="flex justify-center gap-2 rounded-lg overflow-hidden my-3">
                    {blog.images.map((img, i) =>
                      i < 2 ? (
                        <div key={i} className="relative ">
                          <a
                            href={`http://localhost:4000/${img}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {" "}
                            <img
                              src={`http://localhost:4000/${img}`}
                              className="h-48 w-96 object-scale-down rounded-lg "
                            />
                          </a>

                          {i === 1 && blog.images.length > 2 && (
                            <Link
                              to={`/detail/${blog._id}`}
                              className="mt-4 text-indigo-600 hover:underline text-sm"
                            >
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
                                <FaPlus className="text-2xl mb-1" />
                                <span className="text-sm font-semibold">
                                  +{blog.images.length - 2}
                                </span>
                              </div>
                            </Link>
                          )}
                        </div>
                      ) : null
                    )}
                  </div>
                )}
                {blog.userId?._id === currentUserId && (
                  <button
                    onClick={() => {
                      setDeleteId(blog._id);
                      setShowDeleteModal(true);
                    }}
                    className="absolute top-6 right-5 text-red-500 hover:text-red-700"
                    title="Delete blog"
                  >
                    <HiTrash size={20} />
                  </button>
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
            ))}
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
    </div>
  );
}

export default Home;
