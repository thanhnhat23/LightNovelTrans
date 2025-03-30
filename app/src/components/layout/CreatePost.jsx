import { useState } from "react";
import { usePostStore } from "../../store/usePostStore";
import { toast } from "react-hot-toast";

const CreatePost = ({ closeEditor }) => {
  const { createPost } = usePostStore();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    creator: "",
    describe: "",
    source: "",
    source_2: "",
    background: null,
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const handleBackgroundChange = (event) => {
    const file = event.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, background: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    if (
      !formData.title.trim() &&
      !formData.background &&
      !formData.image &&
      !formData.creator.trim() &&
      !formData.source.trim()
    )
      return toast.error("All fields are required");

    try {
      await createPost({
        title: formData.title.trim(),
        describe: formData.describe.trim(),
        content: formData.content.trim(),
        creator: formData.creator.trim(),
        source: formData.source.trim(),
        source_2: formData.source_2.trim(),
        background: formData.background,
        image: formData.image,
      });
      setFormData({
        title: "",
        content: "",
        creator: "",
        source: "",
        source_2: "",
        background: null,
        image: null,
      });
      setLoading(true);
      closeEditor();
      toast.success("Post created successfully");
    } catch (error) {
      console.log("Failed to create post:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen -mt-9 lg:mt-14">
      <div
        className="w-[80vw] lg:w-[29rem] h-full rounded-3xl flex flex-col mt-[25vw] lg:mt-0 relative
        bg-white border-2 border-milk drop-shadow-md"
      >
        <div className="w-full mt-4">
          <div className="flex text-black justify-center items-center m-5 font-bold">
            <p>Upload novel</p>
            <div className="absolute right-3 top-3">
              <button className="btn close" onClick={closeEditor}>
                X
              </button>
            </div>
          </div>

          <form onSubmit={handleCreatePost} className="mt-6">
            <div className="flex flex-col items-start">
              {/* Tiêu đề truyện */}
              <div className="flex relative p-3 w-full">
                <label htmlFor="title" className="text-black font-bold">
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Nhập tiêu đề truyện"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="lg:absolute right-2 input input-bordered lg:w-80 h-8 ml-9 text-black drop-shadow-md
                  bg-black/10 border-2 border-gray/10 focus:outline-none"
                />
              </div>

              <div className="flex relative p-3 w-full">
                <label htmlFor="creator" className="text-black font-bold">
                  Creator:
                </label>
                <input
                  type="text"
                  id="creator"
                  placeholder="Nhập tên tác giả"
                  value={formData.creator}
                  onChange={(e) =>
                    setFormData({ ...formData, creator: e.target.value })
                  }
                  className="lg:absolute right-2 input input-bordered lg:w-80 h-8 ml-9 text-black drop-shadow-md
                  bg-black/10 border-2 border-gray/10 focus:outline-none"
                />
              </div>

              <div className="flex relative p-3 w-full">
                <label htmlFor="source" className="text-black font-bold">
                  Source:
                </label>
                <input
                  type="text"
                  id="source"
                  placeholder="Nhập nguồn dịch truyện"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  className="lg:absolute right-2 input input-bordered lg:w-80 h-8 ml-9 text-black drop-shadow-md
                  bg-black/10 border-2 border-gray/10 focus:outline-none"
                />
              </div>

              <div className="flex relative p-3 w-full">
                <label htmlFor="source" className="text-black font-bold">
                  Source 2:
                </label>
                <input
                  type="text"
                  id="source"
                  placeholder="Nhập nguồn dịch truyện (nếu có)"
                  value={formData.source_2}
                  onChange={(e) =>
                    setFormData({ ...formData, source_2: e.target.value })
                  }
                  className="lg:absolute right-2 input input-bordered lg:w-80 h-8 ml-9 text-black drop-shadow-md
                  bg-black/10 border-2 border-gray/10 focus:outline-none"
                />
              </div>

              {/* Ảnh minh họa */}
              <div className="flex relative p-3 w-full">
                <label htmlFor="image-upload" className="text-black font-bold">
                  Image:
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="lg:absolute right-2 file-input lg:w-80 h-8 ml-4 file-input-neutral text-black drop-shadow-md
                  bg-black/10 border-2 border-gray/10 focus:outline-none"
                />
              </div>

              {/* Bìa minh họa */}
              <div className="flex relative p-3 w-full">
                <label htmlFor="image-upload" className="text-black font-bold">
                  Background:
                </label>
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleBackgroundChange}
                  className="lg:absolute right-2 file-input lg:w-80 h-8 ml-4 file-input-neutral text-black drop-shadow-md
                  bg-black/10 border-2 border-gray/10 focus:outline-none"
                />
              </div>

              <div className="flex flex-col relative m-3">
                <label htmlFor="content" className="text-black font-bold">
                  Content:{" "}
                </label>
                <textarea
                  id="content"
                  placeholder="Nhập tóm tắt nội dung truyện"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="textarea h-10 w-[73vw] lg:w-[27rem] text-black drop-shadow-md
                    bg-black/10 border-2 border-gray/10 resize-none focus:outline-none"
                />
              </div>

              {/* Nội dung truyện */}
              <div className="flex flex-col relative m-3">
                <label htmlFor="describe" className="text-black font-bold">
                  Describe:{" "}
                </label>
                <textarea
                  id="describe"
                  placeholder="Nhập mô tả truyện"
                  value={formData.describe}
                  onChange={(e) =>
                    setFormData({ ...formData, describe: e.target.value })
                  }
                  className="textarea h-48 w-[73vw] lg:w-[27rem] text-black drop-shadow-md
                    bg-black/10 border-2 border-gray/10 resize-none focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn editProfile m-3 w-full"
              >
                {loading ? "Loading..." : "Upload"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
