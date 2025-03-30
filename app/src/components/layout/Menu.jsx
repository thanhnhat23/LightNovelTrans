import { ArrowBigLeft, ArrowBigRight, House } from "lucide-react";

const Menu = ({ nextIndex, prevIndex, id, isNextIndex, isPrevIndex }) => {
  return (
    <ul className="menu border-2 border-black/50 rounded-box gap-4">
      <li>
        <a
          href={`/post/${id}/chapter/${prevIndex}`}
          className={`${isNextIndex && "hidden"}`}
        >
          <ArrowBigLeft />
        </a>
      </li>
      <li>
        <a href="/">
          <House />
        </a>
      </li>
      <li>
        <a
          href={`/post/${id}/chapter/${nextIndex}`}
          className={`${isPrevIndex && "hidden"}`}
        >
          <ArrowBigRight />
        </a>
      </li>
    </ul>
  );
};

export default Menu;
