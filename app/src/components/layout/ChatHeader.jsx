import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";
import { X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const encodeNameTag = encodeURIComponent(selectedUser.nameTag);

  return (
    <div className="p-2.5 border-b-2 border-black/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <a href={`/profile/${encodeNameTag}`} className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={selectedUser.profilePic || "/avatar.webp"}
                alt={selectedUser.userName}
              />
            </div>
          </a>

          {/* User info */}
          <div className="select-none">
            <h3 className="font-medium">{selectedUser.userName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedUser(null)}
          className="bg-white hover:bg-white"
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
