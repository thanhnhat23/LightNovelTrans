import {
  DiscordOutlined,
  GithubOutlined,
  TwitterOutlined,
} from "@ant-design/icons";

const Footer = () => {

  return (
    <footer className="footer footer-center bg-base-300 text-base-content p-3 sm:p-5 flex flex-col">
      <nav className="grid grid-flow-col gap-4 place-items-center">
        <a 
        href="https://www.facebook.com/t.nhat.231026/"
        className="link no-underline hover:bg-gray/25 w-28 h-10 rounded grid place-items-center">
          About me
        </a>
        <a 
        href="https://mail.google.com/mail/u/1/?view=cm&fs=1&to=luongthanhnhat567@gmail.com&tf=1"
        className="link no-underline hover:bg-gray/25 w-28 h-10 rounded grid place-items-center">
          Contact
        </a>
        <a
        href="https://github.com/thanhnhat23/LightNovelTrans"
        className="link no-underline hover:bg-gray/25 w-28 h-10 rounded grid place-items-center">
          Source web
        </a>
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-8 text-3xl">
          <a
            href="https://github.com/thanhnhat23"
            className="hover:bg-gray/10 w-10 h-10 rounded-xl"
          >
            <GithubOutlined />
          </a>
          <a
            href="https://x.com/ThanhNhat06"
            className="hover:bg-gray/10 w-10 h-10 rounded-xl"
          >
            <TwitterOutlined />
          </a>
          <a
            href="https://discord.gg/u8hVwz7W3h"
            className="hover:bg-gray/10 w-10 h-10 rounded-xl"
          >
            <DiscordOutlined />
          </a>
        </div>
      </nav>
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by
          ThanhNhat
        </p>
      </aside>
    </footer>
  );
};

export default Footer;
