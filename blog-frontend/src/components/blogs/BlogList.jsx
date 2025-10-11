import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import BlogCard from "./BlogCard";
import { io } from "socket.io-client";
import { fetchBlogs, updateLikes } from "./blogSlice";
const currentUserId = localStorage.getItem("userId");
const socket = io("http://localhost:4000", { auth: { currentUserId } });

function BlogList({ openModal }) {
  const { items, loading, error } = useSelector((state) => state.blogs);
  const dispatch = useDispatch();
  
    useEffect(() => {
      dispatch(fetchBlogs());
    }, [dispatch]);

    useEffect(() => {
      socket.on(
        "update_likes",
        ({ blogId, likes, dislikes, likedBy, dislikedBy }) => {
          dispatch(
            updateLikes({
              blogId,
              likes,
              dislikes,
              likedBy,
              dislikedBy,
            })
          );
        }
      );

      return () => socket.off("update_likes");
    }, [dispatch]);
  if (loading) return <p>Loading blogs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (items.length === 0) return <p>No blogs yet. Create one!</p>;

  return (
    <div className="grid grid-cols-1 gap-2 mb-5 justify-items-center">
      {items.map((blog) => (
        <BlogCard key={blog._id} blog={blog} openModal={openModal} socket={socket} />
      ))}
    </div>
  );
}
export default BlogList;
