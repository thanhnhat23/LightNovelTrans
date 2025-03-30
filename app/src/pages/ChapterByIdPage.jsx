import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { usePostStore } from "../store/usePostStore";
import { ArrowBigLeft, ArrowBigRight, House } from "lucide-react";
import CommentInput from "../components/ui/CommentInput";
import CommentContainer from "../components/ui/CommentContainer";
import Menu from "../components/layout/Menu";

const ChapterByIdPage = () => {
  const { id, chapterId } = useParams();
  const { chapter, getChapters, comment, getComment, post } = usePostStore();
  const [isNextIndex, setIsNextIndex] = useState(true);
  const [isPrevIndex, setIsPrevIndex] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(-1);

  useEffect(() => {
    getChapters(id, chapterId);
    getComment(id, chapterId);
  }, [getChapters, getComment, id, chapterId]);

  useEffect(() => {
    if (post?.chapters?.length) {
      const index = post.chapters.findIndex((ch) => ch._id === chapterId);
      setCurrentIndex(index);
      setIsPrevIndex(index === 0);
      setIsNextIndex(index === post.chapters.length - 1);
    }
  }, [post, chapterId]);

  const nextIndex = post?.chapters[currentIndex + 1]?._id;
  const prevIndex = post?.chapters[currentIndex - 1]?._id;

  return (
    <div className="min-h-screen bg-pastel_yellow/10">
      <div className="flex flex-col items-center justify-center pt-24">
        {/* Content */}
        <div className="flex flex-col justify-center w-full lg:w-2/3 rounded-md p-2 text-black">
          <h1 className="text-xl lg:text-2xl font-bold flex justify-center mb-5 text-center">
            Chapter {chapter?.chapNumber} <br /> {chapter?.title}
          </h1>
          <div className="text-black/90 lg:text-lg font-medium tracking-wider leading-loose">
            {chapter?.content ? (
              <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
            ) : (
              "Loading content..."
            )}
          </div>
        </div>

        {/* Menu */}
        <div className="flex w-2/3 m-7 h-10 bg-white rounded-3xl">
          <a
            href={`/post/${id}/chapter/${prevIndex}`}
            className={`w-1/3 flex justify-center items-center rounded-l-3xl hover:bg-black/20
            ${isPrevIndex && "pointer-events-none bg-black/20 "}`}
          >
            <ArrowBigLeft color="black" /> 
          </a>
          <a
            href="/"
            className="w-1/3 flex justify-center items-center hover:bg-black/20"
          >
            <House color="black" />
          </a>
          <a
            href={`/post/${id}/chapter/${nextIndex}`}
            className={`w-1/3 flex justify-center items-center rounded-r-3xl hover:bg-black/20
            ${isNextIndex && "pointer-events-none bg-black/20"}`}
          >
            <ArrowBigRight color="black" />
          </a>
        </div>

        <div className="flex flex-col w-full lg:w-2/3 m-7 min-h-44 bg-white">
          <div className="flex items-center w-full h-14 bg-black/80 p-5 rounded-t-md">
            <h1 className="text-white text-xl font-bold">
              Comment ( {comment?.comments?.length || "0"} )
            </h1>
          </div>
          <div className="flex flex-col w-full max-h-[60rem] overflow-auto">
            <CommentInput
              id={id}
              chapterId={chapterId}
            />
            <CommentContainer
              id={id}
              chapterId={chapterId}
            />
          </div>
        </div>
      </div>
      <div className="fixed bottom-5 right-5 text-black/50">
        <Menu
          nextIndex={nextIndex}
          prevIndex={prevIndex}
          id={id}
          isNextIndex={isNextIndex}
          isPrevIndex={isPrevIndex}
        />
      </div>
    </div>
  );
};

export default ChapterByIdPage;
