import { usePostStore } from "../../store/usePostStore";

const TopTranslator = () => {
  const { posts } = usePostStore();

  const uniqueAuthors = Array.from(
    new Map(posts.map((post) => [post.author?._id, post.author])).values()
  ).slice(0, 5);

  return (
    <div className="bg-white lg:mt-10 p-5 border-2 border-milk rounded-lg drop-shadow-md w-[70vw] lg:w-full">
      <h1 className="text-black font-extrabold text-xl lg:text-2xl mb-10">
        Top translators:
      </h1>
      {uniqueAuthors.map((author, index) => (
        <div key={author?._id || index} className="mb-5 flex flex-row">
          <a href={`/profile/${encodeURIComponent(author?.nameTag)}`}>
            <img
              src={author?.profilePic || "/avatar.webp"}
              alt={author?.userName || "Translator ..."}
              className="object-cover object-center drop-shadow-md rounded-full w-16 h-16 ring-2 ring-black"
            />
          </a>
          <p className="text-black flex flex-col font-semibold text-lg m-2 ml-5 pointer-events-none">
            {author?.userName || "Unknown"}
            <span className="text-zinc-400 font-normal text-base">
              {author?.nameTag || "#Unknown"}
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default TopTranslator;
