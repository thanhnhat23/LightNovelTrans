const PostSkeleton = () => {
  const skeletonPost = Array(10).fill(null);

  return (
    <div className="w-full h-full flex flex-wrap justify-center lg:justify-start flex-shrink-0 p-3 pt-10 gap-14 lg:gap-x-10">
      {/* Card */}
      {skeletonPost.map((_, index) => (
        <div key={index} className="w-1/3 h-56 lg:w-1/6 lg:h-96">
          <a href="">
            <div className="size-12 rounded-lg bg-black/30 animate-pulse w-full h-[80%]" />
          </a>
          <h2 className="text-black font-semibold text-base mt-2 ml-1 pointer-events-none truncate">
            <div className="bg-black/30 animate-pulse h-4 w-52 rounded-md" />
          </h2>
          <p className="text-black/50 text-sm mt-2 ml-1 flex gap-1 flex-col lg:flex-row pointer-events-none">
            <span className="font-bold text-black/70">
              <div className="bg-black/30 animate-pulse h-4 w-20 rounded-md" />
            </span>
            <span className="lg:flex hidden"> - </span>
            <span>
              <div className="bg-black/30 animate-pulse h-4 w-32 rounded-md" />
            </span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default PostSkeleton;
