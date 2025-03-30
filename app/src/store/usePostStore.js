import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstanace } from "../lib/axios";

export const usePostStore = create((set, get) => ({
  posts: [],
  chapters: [],
  comments: [],
  comment: null,
  chapter: null,
  post: null,
  isPostsLoading: false,

  getPosts: async () => {
    set({ isPostsLoading: true });
    try {
      const res = await axiosInstanace.get("/posts");
      set({ posts: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isPostsLoading: false });
    }
  },

  createPost: async (postData) => {
    const { posts } = get();
    try {
      const res = await axiosInstanace.post("/posts", postData);
      set({ posts: [...posts, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getPostById: async (postId) => {
    set({ isPostsLoading: true });
    try {
      const res = await axiosInstanace.get(`/posts/${postId}`);
      set({ post: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isPostsLoading: false });
    }
  },

  createChapter: async (chapterData) => {
    const { posts, post } = get();
    const { postId } = chapterData;

    try {
      const res = await axiosInstanace.post(
        `/posts/${postId}/chapters`,
        chapterData
      );
      set({ chapters: res.data });
      if (post && post._id === postId) {
        set({ post: { ...post, chapters: res.data } });
      }
      set({
        posts: posts.map((p) =>
          p._id === postId ? { ...p, chapters: res.data } : p
        ),
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create chapter");
    }
  },

  getChapters: async (postId, chapterId) => {
    try {
      const res = await axiosInstanace.get(
        `/posts/${postId}/chapter/${chapterId}`
      );
      set({ chapter: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  sendComment: async (data) => {
    const { id, chapterId } = data;
    try {
      const res = await axiosInstanace.post(`/posts/${id}/chapter/${chapterId}/comment`, data);
      set({ comments: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  getComment: async (id, chapterId) => {
    try {
      const res = await axiosInstanace.get(
        `/posts/${id}/chapter/${chapterId}/comment`
      );
      set({ comment: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  // deletePost: async (id) => {
  //   try {
  //     await axiosInstanace.delete(`/posts/${id}`);
  //     toast.success("Post deleted successfully");
  //     get().getPosts();
  //   } catch (error) {
  //     toast.error(error.response.data.message);
  //   }
  // },

  deleteChapter: async (id, chapterId) => {
    try {
      await axiosInstanace.delete(`/posts/${id}/chapter/${chapterId}`);
      toast.success("Chapter deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
}));
