import { useState } from "react";
import { useDispatch } from "react-redux";
import { createBlog, setShowCreateModal } from "./blogSlice";
import ImageUploading from "react-images-uploading";
import { FaPlus } from "react-icons/fa";

const currentUserId = localStorage.getItem("userId");

function BlogCreateModal() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const maxNumber = 5;

  const onChange = (imageList) => setImages(imageList);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("userId", currentUserId);
    images.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });

    dispatch(createBlog(formData));
    dispatch(setShowCreateModal(false));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Create New Blog</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Blog Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-40 px-4 py-2 border rounded-lg"
          />
          <ImageUploading
            multiple
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
          >
            {({ imageList, onImageUpload, onImageRemove }) => (
              <div>
                <button
                  type="button"
                  onClick={onImageUpload}
                  className="flex items-center gap-2"
                >
                  <FaPlus /> Add Images
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

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => dispatch(setShowCreateModal(false))}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default BlogCreateModal;
