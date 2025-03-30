import { useEffect } from "react";
import { usePostStore } from "../../store/usePostStore";
import moment from "moment";
import { Crown, Languages, User } from "lucide-react";

const CommentContainer = ({ id, chapterId }) => {
  const { getComment, comment, post, getPostById } = usePostStore();

  useEffect(() => {
    getComment(id, chapterId);
    getPostById(id);
  }, [getComment, getPostById, id, chapterId]);

  const getTimeAgo = (updatedAt) => {
    const now = moment();
    const updatedTime = moment(updatedAt);

    const minutes = now.diff(updatedTime, "minutes");
    const hours = now.diff(updatedTime, "hours");
    const days = now.diff(updatedTime, "days");
    const months = now.diff(updatedTime, "months");
    const years = now.diff(updatedTime, "years");

    if (minutes < 60) return `${minutes} minute ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} day ago`;
    if (months < 12) return `${months} month ago`;
    return `${years} years ago`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comment?.comments?.length > 0 ? (
          comment.comments.map((message) => (
            <div key={message._id} className="chat chat-start">
              <div className="chat-image avatar">
                <a
                  href={`/profile/${encodeURIComponent(message.user.nameTag)}`}
                  className="size-14"
                >
                  <img
                    src={message.user.profilePic || "/avatar.webp"}
                    alt="Profile pic"
                    className="rounded-full ring-2 ring-black object-cover object-center"
                  />
                </a>
              </div>
              <div
                className={`flex flex-col bg-black/10 font-medium rounded-lg p-3
              ${
                message.user._id === post?.author._id
                  ? "border-2 border-cyan-400"
                  : ""
              }
              `}
              >
                <h3 className="flex text-black font-bold">
                  {message?.user.userName}
                  {message?.user._id === "67d40e8b3e1d5e17abd7bd9b" && (
                    <span className="flex justify-center items-center gap-1 ring-1 ring-red-400 bg-red-300 text-red-500 text-xs ml-2 p-1 rounded-lg">
                      <Crown size={12} /> Admin
                    </span>
                  )}
                  {message?.user._id === post?.author._id && (
                    <span className="flex justify-center items-center gap-1 ring-1 ring-green-400 bg-green-300 text-green-500 text-xs ml-2 p-1 rounded-lg">
                      <Languages size={12} /> Translater
                    </span>
                  )}
                  {message?.user._id !== post?.author._id && (
                    <span className="flex justify-center items-center gap-1 ring-1 ring-zinc-400 bg-zinc-300 text-zinc-500 text-xs ml-2 p-1 rounded-lg">
                      <User size={12} /> Member
                    </span>
                  )}
                </h3>
                <div className="flex flex-col gap-2 text-black mt-2 min-w-32">
                  {message.content && <p>{message.content}</p>}
                  {message.image && (
                    <img
                      src={message.image}
                      alt=""
                      className="max-w-[100px] rounded-md mb-2"
                    />
                  )}
                </div>
                <time className="text-xs opacity-50 text-black mt-3">
                  {getTimeAgo(message.createdAt)}
                </time>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-black">No comments</p>
        )}
      </div>
    </div>
  );
};

export default CommentContainer;
