import { useRef, useEffect, useState } from "react";
import moment from "moment";
import { usePostStore } from "../store/usePostStore";
import { useAuthStore } from "../store/useAuthStore";
import TopTranslator from "../components/layout/TopTranslator";
import PostSkeleton from "../components/Skeletons/PostSkeleton";
import { Upload } from "lucide-react";
import { motion } from "motion/react";
import { AnimatePresence } from "motion/react";
import CreatePost from "../components/layout/CreatePost";

const HomePage = () => {
  const scrollRef = useRef(null);
  const cardRef = useRef(null);
  const [cardSize, setCardSize] = useState({ width: 0, height: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const { authUser } = useAuthStore();
  const { posts, getPosts, isPostsLoading } = usePostStore();

  const handleScroll = () => {
    if (scrollRef.current && cardSize.width > 0) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const index = Math.round(scrollLeft / cardSize.width);
      setActiveIndex(index);
    }
  };

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

  useEffect(() => {
    if (cardRef.current) {
      setCardSize({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });
    }
  }, [posts]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [cardSize.width]);

  useEffect(() => {
    getPosts();
    if (authUser?.creatingPost) setIsCreatingPost(true);
  }, [getPosts, authUser]);

  if (isPostsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen mb-15 relative">
      <div className="flex flex-col flex-grow">
        <div className="min-h-[4rem] relative bg-base-300" />
        {/* Carousel */}
        <div className="h-[25vh] lg:h-[40vh] bg-base-300 relative w-full z-10">
          {/* Prev button */}
          {activeIndex > 0 && (
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({
                  left: -cardSize.width,
                  behavior: "smooth",
                })
              }
              className="hidden lg:block absolute left-0 top-3/4 transform -translate-y-1/2 px-2 font-semibold
                      py-2 bg-gray-700 bg-white text-base-300 rounded-r-lg z-10 w-9 h-10 hover:bg-base-100 hover:text-white"
            >
              {"<"}
            </button>
          )}
          {/* Next button */}
          {activeIndex < posts.length - 1 && (
            <button
              onClick={() =>
                scrollRef.current?.scrollBy({
                  left: cardSize.width,
                  behavior: "smooth",
                })
              }
              className="hidden lg:block absolute right-0 top-3/4 transform -translate-y-1/2 px-2 font-semibold
                      py-2 bg-gray-700 bg-white text-base-300 rounded-l-lg z-10 w-9 h-10 hover:bg-base-100 hover:text-white"
            >
              {">"}
            </button>
          )}

          <div
            ref={scrollRef}
            className="absolute bottom-2 lg:-bottom-[7vw] w-full h-[23vh] lg:h-[50vh] snap-x scroll-smooth select-none
            snap-mandatory flex space-x-20 items-center overflow-x-auto no-scrollbar pr-8 pl-4"
          >
            {/* Spacer */}
            <div className="snap-center lg:w-[calc((100vw-1100px-2rem)/2)] h-full lg:flex-shrink-0 hidden lg:flex" />
            {/* Card */}
            {posts.map((post, index) => (
              <div
                key={post._id}
                ref={index === 0 ? cardRef : null}
                className={`relative shrink-0 snap-center w-[90vw] lg:w-[calc((100vw-2rem)/2)] h-full transition-all duration-500
                ${
                  index === activeIndex
                    ? "opacity-100"
                    : "lg:opacity-60 lg:pointer-events-none"
                }`}
              >
                <picture className="w-full h-full flex items-center justify-center">
                  <img
                    src={post?.background}
                    alt=""
                    className="object-cover object-top rounded-lg w-full h-full filter brightness-75"
                  />
                  <div className="absolute rounded-lg inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                </picture>
                <div className="absolute w-full h-1/3 bottom-0 flex justify-between items-center p-3 md:p-6 z-10">
                  <div className="flex flex-col gap-1 xl:gap-2 w-full overflow-hidden">
                    <div className="max-w-[24rem] flex-0">
                      <h2
                        className="font-head font-bold overflow-ellipsis whitespace-nowrap
                        overflow-hidden md:overflow-auto md:whitespace-normal break-words
                        text-lg lg:text-2xl text-white text-opacity-75"
                      >
                        <a href={`/post/${post?._id}`}>{post?.title}</a>
                      </h2>
                    </div>
                    <div className="flex-1 flex-grow max-w-[32rem]">
                      <p
                        className="w-full overflow-ellipsis whitespace-nowrap
                        overflow-hidden md:overflow-auto md:whitespace-normal break-words
                        text-white text-opacity-80 text-sm"
                      >
                        <a href={`/post/${post?._id}`}>{post?.content}</a>
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block flex-0 whitespace-nowrap">
                    <a
                      href={`/post/${post?._id}`}
                      className="inline-block button bg-blue-600 hover:bg-blue-500
                    bg-opacity-80 hover:bg-opacity-70 text-white px-2 md:px-8 py-1
                    md:py-2 text-sm uppercase font-bold rounded-lg"
                    >
                      More Info
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {/* Spacer */}
            <div className="snap-center lg:w-[calc((100vw-1100px-2rem)/2)] h-full lg:flex-shrink-0 hidden lg:flex" />
          </div>
        </div>

        <div className="lg:min-h-[9rem] relative" />

        {/* Content */}
        <div className="relative flex flex-row mt-10 lg:mt-[10vw] mb-10">
          {/* Left side */}
          <div className="w-1/4 hidden lg:flex flex-col p-10">
            <TopTranslator />
          </div>
          {/* Right side */}
          <div className="lg:w-3/4 w-full m-5">
            <div className="flex flex-row relative items-center">
              <h1 className="text-black font-extrabold text-xl lg:text-2xl">
                Recently updated
              </h1>
              {isCreatingPost ? (
                <button
                  onClick={() => setIsVisible(!isVisible)}
                  className="flex justify-center items-center gap-2 bg-white hover:bg-black/10 text-black/70 text-sm lg:text-base absolute right-5 lg:right-10 w-32 lg:w-44 h-8 lg:h-10 rounded-md"
                >
                  <Upload size={15} />
                  Upload novel
                </button>
              ) : null}
            </div>
            {isPostsLoading ? (
              <div>
                <PostSkeleton />
              </div>
            ) : (
              <div className="w-full h-full flex flex-wrap justify-center lg:justify-start flex-shrink-0 p-3 pt-10 gap-14 lg:gap-x-10">
                {/* Card */}
                {posts.map((post) => (
                  <div key={post._id} className="w-1/3 h-56 lg:w-1/6 lg:h-96">
                    <a href={`/post/${post._id}`}>
                      <img
                        src={post?.image}
                        alt=""
                        className="object-cover object-center w-full h-[80%] drop-shadow-md rounded-md"
                      />
                    </a>
                    <h2 className="text-black font-semibold text-base mt-2 ml-1 pointer-events-none truncate">
                      {post?.title}
                    </h2>
                    <p className="text-black/50 text-sm mt-2 ml-1 flex gap-1 flex-col lg:flex-row pointer-events-none">
                      <span className="font-bold text-black/70">
                        Chap {post.chapters?.length || 0}
                      </span>
                      <span className="lg:flex hidden"> - </span>
                      {getTimeAgo(post.updatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* Mobile */}
        <div className="w-full flex justify-center lg:hidden mt-10 mb-10">
          <TopTranslator />
        </div>

        {/* Component motionJS show/hide visibility box*/}
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
                <CreatePost closeEditor={() => setIsVisible(!isVisible)} />
              </motion.div>
            </div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HomePage;
