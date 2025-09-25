import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import ImageUploading from "react-images-uploading";
import { FaPlus } from "react-icons/fa";


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
  const [deleteId, setDeleteId] = useState(null);
  const maxNumber = 5;
  const Api = "http://localhost:4000";
  const token = localStorage.getItem("token");
  const currentUserId = localStorage.getItem("userId");

  // Fetch single blog
  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${Api}/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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
      .map((img) => img.data_url.split("http://localhost:4000/")[1]);
    formData.append("existingImages", JSON.stringify(existingImages));

    // New images
    images.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });

    console.log(formData.get("existingImages"));
    
    try {
      await axios.put(`${Api}/blogs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setShowUpdateModal(false);
      await fetchBlog();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update blog");
    }
  };

  // Delete blog
  const handleDeleteBlog = async () => {
    try {
      await axios.delete(`${Api}/blogs/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowDeleteModal(false);
      setDeleteId(null);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete blog");
    }
  };

  if (loading) return <p className="p-6 item-center text-gray-500">Loading blog...</p>;
  if (!blog) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-3xl mx-auto">
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
      <p className="text-gray-700 mb-6 whitespace-pre-wrap">{blog.content}</p>

      {blog.images.map((img, i) => (
         
              <a
                href={`http://localhost:4000/${img}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  key={img}
                  src={`http://localhost:4000/${img}`}
                  className="w-full mb-3 rounded-xl"
                />
              </a>
          ))}
      <div className="flex gap-3">
        {blog.userId?._id === currentUserId && (
          <button
            onClick={() => {
              setImages(blog.images.map(img => ({ data_url: `http://localhost:4000/${img}` })));
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
            <h2 className="text-xl font-bold mb-4">Update Blog</h2>
            <form onSubmit={handleUpdateBlog} className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 placeholder-gray-400 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 placeholder-gray-400 border rounded-lg focus:ring-2 focus:ring-indigo-500"
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
