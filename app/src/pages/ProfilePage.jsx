import {
  CalendarDays,
  Contact,
  MessageCircle,
  UserRoundPen,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { useChatStore } from "../store/useChatStore.js";
import { useState, useEffect } from "react";
import moment from "moment";
import EditProfile from "../components/layout/EditProfile";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import { axiosInstanace } from "../lib/axios";
import { useParams, useNavigate } from "react-router-dom";
import { usePostStore } from "../store/usePostStore.js";

const ProfilePage = () => {
  const [selectImg, setSelectImg] = useState(null);
  const [selectBackground, setSelectBackground] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isUser, setIsUser] = useState(false);

  const { authUser, onlineUsers } = useAuthStore();
  const { getMessages, setSelectedUser } = useChatStore();
  const { posts, getPosts } = usePostStore();
  const { nameTag } = useParams();
  const decodeNameTag = decodeURIComponent(nameTag);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstanace.get(
          `/users/${encodeURIComponent(decodeNameTag)}`
        );
        setUserProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    if (decodeNameTag === authUser?.nameTag) {
      setUserProfile(authUser); // Nếu truy cập profile của chính mình
      setIsUser(true);
    } else {
      fetchProfile(); // Nếu truy cập user khác, gọi API
    }
  }, [decodeNameTag, authUser]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const bioText = userProfile?.bio || `Hi I'am ${userProfile?.userName}`; // Nếu bio rỗng thì hiển thị mặc định

  // Xử lý định dạng văn bản
  const formatText = (input) => {
    return input
      .split(/(\*\*[^*]+\*\*|\*[^*]+\*|https?:\/\/[^\s]+|\S+@\S+\.\S+|\n)/g)
      .map((word, index) => {
        if (!word.trim()) return word; // Giữ nguyên khoảng trắng và xuống dòng

        // Xuống dòng `\n`
        if (word === "\n") {
          return <br key={index} />;
        }
        // In đậm **text**
        if (word.startsWith("**") && word.endsWith("**")) {
          return (
            <b key={index} className="font-semibold">
              {word.slice(2, -2)}
            </b>
          );
        }
        // In nghiêng *text*
        if (word.startsWith("*") && word.endsWith("*")) {
          return <i key={index}>{word.slice(1, -1)}</i>;
        }
        // Định dạng link (http, https)
        if (word.match(/^https?:\/\/[^\s]+$/)) {
          return (
            <a
              key={index}
              href={word}
              className="text-blue-500 mx-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              {word}
            </a>
          );
        }
        // Định dạng email (example@gmail.com)
        if (word.match(/^\S+@\S+\.\S+$/)) {
          return (
            <a
              key={index}
              href={`mailto:${word}`}
              className="text-green-500 mx-1"
            >
              {word}
            </a>
          );
        }
        return word + " ";
      });
  };

  const handleChat = async () => {
    if (!userProfile) return;
    setSelectedUser(userProfile);
    await getMessages(userProfile._id);
    navigate("/chat-room");
  };

  const getTimeAgo = (updatedAt) => {
    const now = moment();
    const updatedTime = moment(updatedAt);

    const minutes = now.diff(updatedTime, "minutes");
    const hours = now.diff(updatedTime, "hours");
    const days = now.diff(updatedTime, "days");
    const months = now.diff(updatedTime, "months");
    const years = now.diff(updatedTime, "years");

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 30) return `${days} days ago`;
    if (months < 12) return `${months} months ago`;
    return `${years} years ago`;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-9 justify-center items-center">
      {/* Left side */}
      <div
        className="w-[80vw] lg:w-96 h-[75vh] rounded-3xl flex flex-col mt-[25vw] lg:mt-0 relative
            bg-white drop-shadow-2xl border-milk border-2"
      >
        {/* Background */}
        <div
          className="rounded-tr-3xl rounded-tl-3xl h-[20vh] bg-cover bg-center border-b-2 
                    border-milk drop-shadow-md"
          style={{
            backgroundImage: `url(${
              selectBackground ||
              userProfile?.profileBackground ||
              "/background.webp"
            })`,
          }}
        ></div>
        {/* Avatar */}
        <div
          className="rounded-full bg-cover bg-center absolute lg:h-36 lg:w-36 h-28 w-28 
                    left-1/2 -translate-x-1/2 top-[13vh] drop-shadow-md ring-milk ring-[3px]"
          style={{
            backgroundImage: `url(${
              selectImg || userProfile?.profilePic || "/avatar.webp"
            })`,
          }}
        >
          <div
            className={`absolute rounded-full h-5 w-5 border-2 border-rice right-1 bottom-0 lg:right-4 
                            ${
                              onlineUsers.includes(userProfile?._id)
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
          />
        </div>
        {/* Info */}
        <div className="rounded-b-3xl relative flex flex-col items-center justify-start h-[55vh] truncate">
          {isUser ? (
            <button
              className="editProfile flex justify-center items-center gap-1 absolute top-[11vh]
                                  text-xs lg:text-base font-medium"
              onClick={() => setIsVisible(!isVisible)}
            >
              Edit profile <UserRoundPen size={18} />
            </button>
          ) : (
            <button
              className="editProfile flex justify-center items-center gap-1 absolute top-[11vh]
                        text-xs lg:text-base font-medium"
              onClick={handleChat}
            >
              Chat <MessageCircle size={18} />
            </button>
          )}
          <div className="absolute top-[17vh] w-full">
            <div className="flex flex-col items-center">
              <hr className="w-2/3 text-black/20 drop-shadow-sm" />
              <h2 className="text-xl lg:text-2xl font-bold text-center m-2 lg:m-3 text-black">
                {userProfile?.userName}
              </h2>
              <p className="font-bold text-center m-0 text-black">
                NameTag:
                <span className="text-black/50 ml-2">
                  {userProfile?.nameTag}
                </span>
              </p>
              <p className="font-bold text-center m-1 lg:m-2 text-black/50">
                {userProfile?.email}
              </p>
              <hr className="w-2/3 text-black/20 drop-shadow-sm" />
            </div>
            <div className="flex flex-col items-start m-6 text-black font-medium h-full">
              <div className="flex mb-5 lg:mb-7 w-full">
                <p className="ml-1 flex font-bold">
                  <Contact color="gray" />
                  {userProfile?.nameSocial_1
                    ? `${userProfile?.nameSocial_1}: `
                    : "Social-1:"}
                </p>
                {userProfile?.linkSocial_1 ? (
                  <a
                    href={userProfile.linkSocial_1}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black/50 ml-1 text-blue-500 truncate"
                  >
                    {userProfile.linkSocial_1}
                  </a>
                ) : (
                  <span className="text-black/50 ml-2">None</span>
                )}
              </div>
              <div className="flex mb-5 lg:mb-7 truncate w-full">
                <p className="ml-1 flex font-bold">
                  <Contact color="gray" />
                  {userProfile?.nameSocial_2
                    ? `${userProfile?.nameSocial_2}: `
                    : "Social-2:"}
                </p>
                {userProfile?.linkSocial_2 ? (
                  <a
                    href={userProfile.linkSocial_2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black/50 ml-1 text-blue-500 truncate"
                  >
                    {userProfile.linkSocial_2}
                  </a>
                ) : (
                  <span className="text-black/50 ml-2">None</span>
                )}
              </div>
              <div className="flex mb-5 lg:mb-6 truncate w-full">
                <p className="ml-1 flex font-bold">
                  <Contact color="gray" />
                  {userProfile?.nameSocial_3
                    ? `${userProfile?.nameSocial_3}: `
                    : "Social-3:"}
                </p>
                {userProfile?.linkSocial_3 ? (
                  <a
                    href={userProfile.linkSocial_3}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black/50 ml-1 text-blue-500 truncate"
                  >
                    {userProfile.linkSocial_3}
                  </a>
                ) : (
                  <span className="text-black/50 ml-2">None</span>
                )}
              </div>
              <div className="flex ml-1">
                <CalendarDays color="gray" />
                <p className="mt-0.5 font-bold">
                  Joined on:
                  <span className="text-black/70 ml-2 font-medium">
                    {moment(userProfile?.createdAt).format("DD/MM/YYYY")}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side */}
      <div
        className="w-[90vw] lg:w-[60vw] h-[75vh] rounded-3xl flex flex-col mb-9 lg:mb-0
            bg-white border-2 border-milk drop-shadow-2xl"
      >
        <div className="w-full flex flex-col justify-start h-1/3">
          <h3 className="ml-4 mt-4 mb-4 lg:mb-2 text-black text-lg lg:text-2xl font-bold">
            Bio:{" "}
          </h3>
          <div className="flex flex-col items-center overflow-y-auto">
            <p
              className="ml-3 mr-3 text-black/70 whitespace-pre-wrap text-xs 
                            lg:text-base line-clamp-6.5"
              style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
            >
              {formatText(bioText)}
            </p>
          </div>
        </div>

        <div className="flex flex-col w-full">
          <div className="flex items-center justify-center">
            <hr className=" w-5/6 text-black/20 drop-shadow-sm m-2" />
          </div>
          <h2 className="text-black font-bold text-lg mt-2 ml-4">
            🏆 Translated novel
          </h2>
        </div>

        <div
          className="flex h-[34vh] items-center p-8 pt-4 pb-10 snap-x scroll-smooth select-none
          snap-mandatory space-x-4 lg:space-x-10 overflow-x-auto justify-start"
        >
          {posts
            .filter((post) => post?.author?._id === userProfile?._id)
            .map((post) => (
              <a
                key={`${post.author._id}-${post._id}`}
                href={`/post/${post?._id}`}
                className="w-1/2 lg:w-1/6 h-full relative flex-shrink-0"
              >
                <picture className="drop-shadow-md">
                  <img
                    src={post?.image}
                    alt="post"
                    className="w-full h-full object-cover rounded-lg border-2 border-black/10"
                  />
                  <div className="absolute rounded-lg inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </picture>
                <p className="absolute bottom-2 left-2 flex flex-col">
                  <span className="text-white text-xs lg:text-sm font-bold mb-2">
                    {post?.title}
                  </span>
                  <span className="text-white text-xs lg:text-sm">
                    {getTimeAgo(post.updatedAt)}
                  </span>
                </p>
              </a>
            ))}
        </div>

        <div className="w-full flex flex-col h-1/6">
          <div className="flex items-center justify-center">
            <hr className=" w-5/6 text-black/20 drop-shadow-sm" />
          </div>
        </div>
      </div>

      {/* Component motionJS show/hide visibility box*/}
      <AnimatePresence initial={false}>
        {isVisible ? (
          <div
            className={`fixed inset-0 backdrop-blur-md flex justify-center 
                        items-center duration-300`}
          >
            <motion.div
              key="edit-profile"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EditProfile
                selectImg={selectImg}
                setSelectImg={setSelectImg}
                selectBackground={selectBackground}
                setSelectBackground={setSelectBackground}
                closeEditor={() => setIsVisible(!isVisible)}
              />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
