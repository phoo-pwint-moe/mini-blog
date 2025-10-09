import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateBlog, setShowUpdateModal, setUpdateBlog } from "./blogSlice";
import ImageUploading from "react-images-uploading";
import { FaPlus } from "react-icons/fa";

function BlogUpdateModal() {
  const dispatch = useDispatch();
  const { updateBlog: blogToEdit } = useSelector((s) => s.blogs);

  // Initialize with existing data
  const [title, setTitle] = useState(blogToEdit?.title || "");
  const [content, setContent] = useState(blogToEdit?.content || "");
  const [existingImages, setExistingImages] = useState(
    blogToEdit?.images || []
  );
  const [newImages, setNewImages] = useState([]);

  const maxNumber = 5;
  const remainingSlots = maxNumber - existingImages.length;

  const onChange = (imageList) => setNewImages(imageList);

  const handleRemoveExisting = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    // Keep existing images
    existingImages
      .filter((img) => !img.file) // images already on server
      .map((img) => img.data_url);
    formData.append("existingImages", JSON.stringify(existingImages));

    // Add new uploaded ones
    newImages.forEach((img) => {
      if (img.file) formData.append("images", img.file);
    });

     if (!title || !content) return;

    dispatch(updateBlog({ id: blogToEdit._id, formData }));
    dispatch(setShowUpdateModal(false));
    dispatch(setUpdateBlog(null));
  };

  const handleCancel = () => {
    dispatch(setShowUpdateModal(false));
    dispatch(setUpdateBlog(null));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg  max-h-[90vh] overflow-y-auto  shadow-lg">
        <h2 className="text-xl font-bold mb-4">Update Blog</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Blog Title"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          {/* Content */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Blog Content"
            className="w-full h-40 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
          />

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Existing Images</h4>
              <div className="grid grid-cols-3 gap-2">
                {existingImages.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt="existing"
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExisting(index)}
                      className="absolute top-0 right-0 text-red-600 font-bold bg-white/70 rounded-full px-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          {remainingSlots > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Add More Images</h4>
              <ImageUploading
                multiple
                value={newImages}
                onChange={onChange}
                maxNumber={remainingSlots}
                dataURLKey="data_url"
              >
                {({ imageList, onImageUpload, onImageRemove }) => (
                  <div>
                    <button
                      type="button"
                      onClick={onImageUpload}
                      className="flex items-center gap-2 text-indigo-600 hover:underline mb-2"
                    >
                      <FaPlus /> Add Images ({remainingSlots} left)
                    </button>

                    <div className="grid grid-cols-3 gap-2">
                      {imageList.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.data_url}
                            alt=""
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => onImageRemove(index)}
                            className="absolute top-0 right-0 text-red-600 font-bold bg-white/70 rounded-full px-1"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </ImageUploading>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={handleCancel}
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
  );
}

export default BlogUpdateModal;
