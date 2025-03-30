import { Trash } from "lucide-react";
import { usePostStore } from "../../store/usePostStore";

const ManagerChapter = ({ id, chapterId }) => {
  const { deleteChapter } = usePostStore();

  const handleDelete = () => {
    deleteChapter(id, chapterId);
  };

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="flex gap-2 mr-2 ml-4 absolute right-0"
    >
      <button
        onClick={handleDelete}
        className="w-5 h-5 lg:w-7 lg:h-7 flex justify-center items-center bg-red-400 hover:bg-red-300 rounded-md text-red-700"
      >
        <Trash size={14} />
      </button>
    </div>
  );
};

export default ManagerChapter;
