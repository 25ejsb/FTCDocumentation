import { JSX } from "preact/jsx-runtime";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { useEffect, useState } from "preact/hooks";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = document.cookie.includes("auth=verysecretcode");
    setIsLoggedIn(token);
  }, []);

  return (
    <nav
      id="nav"
      class="fixed flex top-0 left-0 w-full h-20 p-12 max-md:px-6 items-center justify-between"
    >
      <a href="/" class="flex items-center h-[6rem]">
        <img
          class="mx-4 size-[5.5rem]"
          src="/images/rabbi.webp"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-white text-5xl max-sm:hidden">RABBI</h1>
      </a>
      <div class="flex items-center justify-center space-x-4 text-white text-2xl max-md:hidden">
        <a href="#" class="hover:text-shadow-mdwhite md:text-start">Home</a>
        <a href="#" class="hover:text-shadow-mdwhite md:text-start">
          Documentation
        </a>
        {isLoggedIn
          ? (
            <a
              href="/api/logout"
              class="hover:text-shadow-mdwhite md:text-start"
            >
              Log Out
            </a>
          )
          : (
            <>
              <a href="/login" class="hover:text-shadow-mdwhite md:text-start">
                Log In
              </a>
              <a href="/signup" class="hover:text-shadow-mdwhite md:text-start">
                Sign Up
              </a>
            </>
          )}
      </div>
      <button id="menu-button" class="hidden max-md:flex">
        <img id="menu-button-image" src="/images/svg/menu.svg" alt="Menu" />
      </button>
      <div
        id="menu"
        class="fixed hidden justify-start p-16 items-center top-[6rem] left-0 w-full h-[30rem] bg-black/50 flex-col space-y-8"
      >
        <a
          href="#"
          class="hover:text-shadow-mdwhite md:text-start text-white text-4xl uppercase tracking-wide"
        >
          Home
        </a>
        <a
          href="#"
          class="hover:text-shadow-mdwhite md:text-start text-white text-4xl uppercase tracking-wide"
        >
          Documentation
        </a>
        {isLoggedIn
          ? (
            <a
              href="/api/logout"
              class="hover:text-shadow-mdwhite md:text-start text-white text-4xl uppercase tracking-wide"
            >
              Log Out
            </a>
          )
          : (
            <>
              <a
                href="/login"
                class="hover:text-shadow-mdwhite md:text-start text-white text-4xl uppercase tracking-wide"
              >
                Log In
              </a>
              <a
                href="/signup"
                class="hover:text-shadow-mdwhite md:text-start text-white text-4xl uppercase tracking-wide"
              >
                Sign Up
              </a>
            </>
          )}
      </div>
      <script src="/js/nav.js"></script>
    </nav>
  );
}
