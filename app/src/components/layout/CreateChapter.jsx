import { useState } from "react";
import { usePostStore } from "../../store/usePostStore";
import { toast } from "react-hot-toast";
import mammoth from "mammoth";

const CreateChapter = ({ closeEditor, postId }) => {
  const { createChapter } = usePostStore();
  const [formData, setFormData] = useState({
    chapterNumber: "",
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const handleWordConvert = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;

      try {
        const { value } = await mammoth.convertToHtml({ arrayBuffer });
        setFormData((prev) => ({ ...prev, content: value }));
        toast.success("Word file converted successfully!");
      } catch (error) {
        toast.error("Failed to convert Word file.");
        console.error(error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    if (
      !formData.title.trim() &&
      !formData.content.trim() &&
      !formData.chapterNumber
    )
      return toast.error("All fields are required");

    try {
      await createChapter({
        postId,
        chapterNumber: formData.chapterNumber,
        title: formData.title.trim(),
        content: formData.content.trim(),
      });
      setFormData({ chapterNumber: "", title: "", content: "" });
      setLoading(true);
      closeEditor();
      toast.success("Chapter created successfully");
    } catch (error) {
      console.log("Failed to create chap:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen lg:mt-14">
      <div
        className="w-[80vw] lg:w-[29rem] h-full rounded-3xl flex flex-col mt-[25vw] lg:mt-0 relative
        bg-white border-2 border-milk drop-shadow-md"
      >
        <div className="w-full mt-4">
          <div className="flex text-black justify-center items-center m-5 font-bold">
            <p>Upload chapter</p>
            <div className="absolute right-3 top-3">
              <button className="btn close" onClick={closeEditor}>
                X
              </button>
            </div>
          </div>

          <form onSubmit={handleCreatePost} className="mt-6">
            <div className="flex flex-col items-start">
              <div className="flex relative p-3 w-full flex-row">
                <label htmlFor="chapterNumber" className="text-black font-bold">
                  Chapter number:
                </label>
                <input
                  type="text"
                  id="chapterNumber"
                  value={formData.chapterNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      chapterNumber: e.target.value,
                    })
                  }
                  className="input input-bordered w-16 h-8 ml-3 text-black drop-shadow-md
                  bg-black/10 border-2 border-gray/10 focus:outline-none"
                />
              </div>

              {/* Tiêu đề chương */}
              <div className="flex relative p-3 w-full">
                <label htmlFor="title" className="text-black font-bold">
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  placeholder="Nhập tiêu đề chương"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="lg:absolute right-2 input input-bordered lg:w-80 h-8 ml-9 text-black drop-shadow-md
                  bg-black/10 border-2 border-gray/10 focus:outline-none"
                />
              </div>

              <div className="flex flex-col relative p-3 w-full">
                <label htmlFor="content" className="text-black font-bold">
                  Content:{" "}
                </label>
                <input
                  type="file"
                  id="content"
                  accept="docx/*"
                  onChange={handleWordConvert}
                  className="lg:absolute right-2 file-input lg:w-80 h-8 lg:ml-4 file-input-neutral text-black drop-shadow-md
                  bg-black/10 border-2 border-gray/10 focus:outline-none"
                />
                <p className="text-red-500 text-xs lg:text-sm text-start mt-3">
                  *Vui lòng chọn file word đã translated
                </p>
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

export default CreateChapter;
