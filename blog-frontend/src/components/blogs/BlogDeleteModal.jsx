import { useDispatch, useSelector } from "react-redux";
import { deleteBlog, setShowDeleteModal, setDeleteId } from "./blogSlice";

function BlogDeleteModal() {
  const dispatch = useDispatch();
  const { deleteId } = useSelector((s) => s.blogs);

  const handleDelete = () => {
    dispatch(deleteBlog(deleteId));
    dispatch(setShowDeleteModal(false));
    dispatch(setDeleteId(null));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Delete</h2>
        <p className="mb-6 text-gray-600">
          Are you sure you want to delete this blog? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => dispatch(setShowDeleteModal(false))}
            className="px-4 py-2 bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
export default BlogDeleteModal;
