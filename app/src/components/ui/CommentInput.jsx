import { useState, useRef } from "react";
import { usePostStore } from "../../store/usePostStore";
import { toast } from "react-hot-toast";
import { Image, Send, X } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

const CommentInput = ({ id, chapterId }) => {
  const [content, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendComment } = usePostStore();
  const { authUser } = useAuthStore();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendComment = async (event) => {
    event.preventDefault();
    if (!content.trim() && !imagePreview) return;
    try {
      await sendComment({
        postId: id,
        chapterId: chapterId,
        content: content.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.log("Failed to send message: ", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1 w-5 h-5 rounded-full bg-base-300 text-black
                            flex items-center justify-center bg-white hover:bg-black hover:text-white"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendComment} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <img
            src={authUser?.profilePic || "/avatar.webp"}
            alt=""
            className="w-10 h-10 rounded-full ring-1 ring-black mr-5 object-cover object-center"
          />
          <input
            type="text"
            className="w-full input input-bondered rounded-lg input-sm sm:input-md bg-black/10 
                        border-black/10 border-2 drop-shadow-sm text-black font-medium"
            placeholder="Type a comment ..."
            value={content}
            onChange={(event) => setText(event.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex bg-white btn
                                border-none hover:bg-white shadow-none
                                ${
                                  imagePreview
                                    ? "text-emerald-500"
                                    : "text-black/50"
                                }
                        `}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
          <button
            type="submit"
            className={`btn border-none shadow-none 
                            ${
                              content.trim() || imagePreview
                                ? "text-true_blue bg-white hover:bg-white"
                                : "text-black/50"
                            }`}
            disabled={!content.trim() && !imagePreview}
          >
            <Send size={22} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentInput;
