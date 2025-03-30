import { ArrowUpFromLine, Book, BookOpen, Clock } from "lucide-react";
import moment from "moment";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import CreateChapter from "../components/layout/CreateChapter";
import ManagerChapter from "../components/layout/ManagerChapter";

const ChapterPage = () => {
  const { id } = useParams();
  const { posts, post, getPostById, getPosts } = usePostStore();
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const { authUser } = useAuthStore();
  const [isVisible, setIsVisible] = useState(false);
  const [lastIndex, setLastIndex] = useState(-1);
  const [headIndex, setHeadIndex] = useState(-1);
  const userPostCount = posts.filter(
    (posts) => posts?.author?._id === post?.author?._id
  ).length;
  const encodeNameTag = encodeURIComponent(post?.author?.nameTag);

  useEffect(() => {
    getPostById(id);
    getPosts();
    if (authUser?.creatingPost && post?.author?._id === authUser?._id) setIsCreatingPost(true);
  }, [getPostById, getPosts, id, authUser, post]);

  useEffect(() => {
    if (post?.chapters?.length) {
      setLastIndex(post.chapters.length - 1);
      setHeadIndex(0);
    }
  }, [post]);

  const lastCurrentIndex = post?.chapters[lastIndex]?._id;
  const headCurrentIndex = post?.chapters[headIndex]?._id;

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
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center pt-24 px-4 mb-10">
        {/* Top */}
        <div
          className="text-black drop-shadow-md border-2 min-h-[42rem] lg:min-h-[52rem]
         border-black/20 rounded-t-lg w-full max-w-7xl bg-gray_light/70"
        >
          <div className="flex flex-col relative">
            <div className="w-full h-[12rem] lg:h-[35rem]">
              <picture className="w-full h-full flex items-center justify-center">
                <img
                  src={post?.background}
                  alt=""
                  className="object-cover object-top rounded-t-lg w-full h-full"
                />
                <div className="absolute rounded-t-lg inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
              </picture>
              <div className="lg:flex flex-col m-7 p-2 hidden ml-3 absolute bottom-0 right-0 w-[57rem]">
                <p className="text-white/70">{post?.creator}</p>
                <h1
                  className="text-white text-3xl font-extrabold"
                  style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                >
                  {post?.title}
                </h1>
              </div>
            </div>

            <div className="absolute top-36 lg:top-[80%] lg:left-20 lg:translate-x-0 left-1/2 transform -translate-x-1/2">
              <img
                src={post?.image}
                alt=""
                className="object-cover object-center drop-shadow-md w-32 h-48 lg:w-60 lg:h-[21rem] rounded-lg filter brightness-95"
              />
            </div>
          </div>

          <div className="w-full h-20 lg:hidden flex" />

          {/* INFO */}
          <div
            className="w-full min-h-56 flex flex-col gap-2 lg:relative mb-2 lg:bottom-0 
            p-5 lg:justify-end items-center"
          >
            <div
              className="flex flex-col justify-center items-center lg:items-start gap-2 
              lg:absolute lg:top-2 lg:left-[21rem] pt-5 p-2 lg:mt-0 mt-10"
            >
              <div className="text-center flex flex-col lg:hidden w-full">
                <h1
                  className="text-black text-lg lg:text-2xl font-extrabold"
                  style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                >
                  {post?.title}
                </h1>
                <p className="text-black/70">{post?.creator}</p>
              </div>
              <p className="flex gap-2 items-center text-sm lg:text-lg font-medium text-black/60">
                <Clock size={15} />
                {getTimeAgo(post?.updatedAt)}
              </p>
              <p
                className="flex text-sm font-medium text-black/80 lg:mt-0 mt-2"
                style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
              >
                {post?.content || "No content"}
              </p>
            </div>

            <div className="flex lg:flex-row lg:gap-7 gap-3 flex-col lg:absolute lg:left-[21.5rem]">
              <a
                href={`/post/${post?._id}/chapter/${headCurrentIndex}`}
                className="flex justify-center items-center gap-2 button w-56 h-9 bg-white hover:bg-black/10 rounded-lg"
              >
                <Book size={17} />
                <span className="text-black text-base font-medium">
                  Read from chapter 1
                </span>
              </a>
              <a
                href={`/post/${post?._id}/chapter/${lastCurrentIndex}`}
                className="flex justify-center items-center gap-2 button w-56 h-9 bg-white hover:bg-black/10 rounded-lg"
              >
                <BookOpen size={17} />
                <span className="text-black text-base font-medium">
                  Latest read
                </span>
              </a>
              {isCreatingPost ? (
                <button
                onClick={() => setIsVisible(!isVisible)}
                className="flex justify-center items-center gap-2 button w-56 h-9 bg-white hover:bg-black/10 rounded-lg"
              >
                <ArrowUpFromLine size={17} />
                <span className="text-black text-base font-medium">
                  Upload chapter
                </span>
              </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="text-black drop-shadow-md border-2 border-t-0 relative p-4 lg:p-8 gap-5
         border-black/20 rounded-b-lg w-full max-w-7xl bg-white flex flex-col lg:flex-row"
        >
          {/* Left side */}
          <div className="flex flex-col w-full lg:w-2/3">
            <div className="bg-black/10 flex flex-col w-full min-h-44 rounded-t-lg drop-shadow-md p-5">
              {/* Info author*/}
              <div className="flex flex-row gap-5">
                <a href={`/profile/${encodeNameTag}`}>
                  <img
                    src={post?.author?.profilePic}
                    alt=""
                    className="rounded-full w-10 h-10 lg:w-14 lg:h-14 ring-2 ring-black object-cover object-center"
                  />
                </a>
                <div className="flex flex-col">
                  <h1 className="text-black text-base lg:text-xl font-extrabold pointer-events-none">
                    {post?.author?.userName}
                  </h1>
                  <p className="text-black/70 text-sm lg:text-base pointer-events-none">
                    {userPostCount} translated novels
                  </p>
                </div>
              </div>
              {/* Description */}
              <p className="text-black/70 text-sm lg:text-base mt-5">
                {post?.describe || "No description"}
              </p>
            </div>
            {/* Info chapter */}
            <div className="flex flex-col bg-black/20 rounded-b-lg w-full p-5">
              <h1 className="text-black text-base lg:text-xl font-extrabold">
                Source trans
              </h1>
              {post?.source ? (
                <a
                  className="text-blue-500 text-sm lg:text-base mt-2"
                  href={`${post?.source}`}
                >
                  {post?.source}
                </a>
              ) : (
                <p className="text-zinc-600">No source</p>
              )}
              {post?.source_2 ? (
                <a
                  className="text-blue-500 text-sm lg:text-base mt-2"
                  href={`${post?.source_2}`}
                >
                  {post?.source_2}
                </a>
              ) : null}
              <h1 className="text-black text-base lg:text-xl font-extrabold mt-3 lg:mt-5">
                More info
              </h1>
              <p className="text-black/70 text-sm lg:text-base mt-2">
                Total chapter:{" "}
                <span className="font-bold">{post?.chapters.length || 0}</span>{" "}
                chapter
              </p>
              <p className="text-black/70 text-sm lg:text-base mt-2">
                Lasted update:{" "}
                <span className="font-bold">
                  {moment(post?.updatedAt).calendar()}
                </span>
              </p>
            </div>
            {/* Chapter container */}
            <div className="flex flex-col gap-2 w-full max-h-96 lg:max-h-[40rem] mt-5 lg:mt-10 snap-y overflow-y-auto">
              {/* Chapter map */}
              {Array.isArray(post?.chapters) ? (
                post.chapters.map((chapter) => ( 
                  <a
                    key={`${post._id}-${chapter.chapNumber}`}
                    href={`/post/${post._id}/chapter/${chapter._id}`}
                    className="flex flex-row items-center w-full h-10 lg:h-14 bg-black/10 flex-shrink-0 relative"
                  >
                    <div className="w-1/4 lg:w-1/5 h-full flex items-center justify-center">
                      <span className="w-2 h-full absolute left-0 bg-black/10" />
                      <p className="font-semibold text-xs lg:text-base">
                        Chapter {chapter.chapNumber}
                      </p>
                    </div>
                    <div className="lg:w-4/5 h-full flex flex-col justify-center font-medium">
                      <p className="text-xs lg:text-base text-black/80">
                        {chapter.title}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {getTimeAgo(chapter.createdAt)}
                      </p>
                    </div>
                    {isCreatingPost ? (
                      <ManagerChapter id={post._id} chapterId={chapter._id}/>
                    ) : null}
                  </a>
                ))
              ) : (
                <p className="text-black text-center">No chapters available</p>
              )}
            </div>
          </div>

          <hr className="lg:hidden mt-4 text-black/20" />

          {/* Right side */}
          <div className="flex flex-col w-full lg:w-1/3 p-5">
            <h1 className="font-bold text-base lg:text-lg">Same translator</h1>
            {/* Card suggest */}
            {posts
              .filter((posts) => posts?.author?._id === post?.author?._id)
              .map((posts) => (
                <a
                  href={`/post/${posts?._id}`}
                  key={`${posts.author._id}-${posts._id}`}
                  className="flex flex-row mt-3"
                >
                  <picture className="w-20">
                    <img
                      src={posts?.image}
                      alt=""
                      className="w-16 h-20 ring-1 ring-zinc-300 object-cover object-center rounded-md drop-shadow-sm shrink-0"
                    />
                  </picture>
                  <div className="flex flex-col justify-center ml-2 gap-2 w-full">
                    <h2 className="font-bold line-clamp-2 text-sm lg:text-base">
                      {posts?.title}
                    </h2>
                    <p className="flex flex-row text-black text-sm lg:text-base">
                      <span className="font-bold mr-1">
                        {" "}
                        Chap {posts.chapters?.length || 0}
                      </span>
                      -
                      <span className="font-medium text-zinc-500 ml-1">
                        {getTimeAgo(posts?.updatedAt)}
                      </span>
                    </p>
                  </div>
                </a>
              ))}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isVisible ? (
            <div
              className={`fixed inset-0 backdrop-blur-md flex justify-center 
                        items-center duration-300 z-50`}
            >
              <motion.div
                key="edit-profile"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CreateChapter
                  postId={id}
                  closeEditor={() => setIsVisible(!isVisible)}
                />
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChapterPage;
