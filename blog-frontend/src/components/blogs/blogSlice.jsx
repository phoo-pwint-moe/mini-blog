import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api";

const currentUserId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

// Async Thunks
export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const res = await api.post(`/blogs/get/${currentUserId}`);
  return res.data.sort((a, b) => new  Date(b.updatedAt) - new Date(a.updatedAt));
});

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, formData }) => {
    const res = await api.put(`/blogs/${id}`, formData);
    return res.data;
  }
);

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async (formData) => {
    const res = await api.post("/blogs", formData);
    return res.data;
  }
);

export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (id) => {
  await api.delete(`/blogs/${id}`);
  return id;
});

// Slice
const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    items: [],
    loading: false,
    error: null,
    showCreateModal: false,
    showUpdateModal: false,
    showDeleteModal: false,
    deleteId: null,
    updateBlog: null,
  },
  reducers: {
    setShowCreateModal: (state, action) => {
      state.showCreateModal = action.payload;
    },
    setShowUpdateModal: (state, action) => {
      state.showUpdateModal = action.payload;
    },
    setShowDeleteModal: (state, action) => {
      state.showDeleteModal = action.payload;
    },
    setUpdateBlog: (state, action) => {
      state.updateBlog = action.payload;
    },
    setDeleteId: (state, action) => {
      state.deleteId = action.payload;
    },

    addSocketBlog: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateLikes: (state, action) => {
      const { blogId, likes, dislikes, likedBy, dislikedBy } = action.payload;
      const blog = state.items.find((b) => b._id === blogId);
      if (blog) {
        blog.likes = likes;
        blog.dislikes = dislikes;
        blog.likedBy = likedBy;
        blog.dislikedBy = dislikedBy;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map((b) => ({
          ...b,
          likes: b.likedBy.length,
          dislikes: b.dislikedBy.length,
        }));
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.items = state.items.map((b) =>
          b._id === action.payload._id ? action.payload : b
        );
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b._id !== action.payload);
      });
  },
});

export const {
  setShowCreateModal,
  setShowUpdateModal,
  setShowDeleteModal,
  setUpdateBlog,
  setDeleteId,
  addSocketBlog,
  updateLikes,
} = blogSlice.actions;

export default blogSlice.reducer;
