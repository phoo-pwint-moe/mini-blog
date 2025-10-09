import { useSelector } from "react-redux";
import BlogCard from "./BlogCard";

function BlogList({ openModal }) {
  const { items, loading, error } = useSelector((state) => state.blogs);

  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (items.length === 0) return <p>No blogs yet. Create one!</p>;

  return (
    <div className="grid grid-cols-1 gap-2 mb-5 justify-items-center">
      {items.map((blog) => (
        <BlogCard key={blog._id} blog={blog} openModal={openModal} />
      ))}
    </div>
  );
}
export default BlogList;
