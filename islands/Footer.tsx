export default function Footer() {
  return (
    <footer class="flex flex-col items-center bg-slate-900 p-12">
      <div class="flex p-12 justify-center items-center space-x-20">
        <div class="flex flex-col justify-start items-center h-[20rem]">
          <h1 class="text-white text-5xl border-b-[3px] mb-4">Main Pages</h1>
          <a
            href="#"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Home
          </a>
          <a
            href="#"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Documentation
          </a>
          <a
            href="/signup"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Sign Up
          </a>
          <a
            href="/login"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Log In
          </a>
        </div>
        <div class="flex flex-col justify-start items-center h-[20rem]">
          <h1 class="text-white text-5xl border-b-[3px] mb-4">Section 2</h1>
          <a
            href="#"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Link 1
          </a>
          <a
            href="#"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Link 2
          </a>
          <a
            href="#"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Link 3
          </a>
          <a
            href="#"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Link 4
          </a>
        </div>
        <div class="flex flex-col justify-start items-center h-[20rem]">
          <h1 class="text-white text-5xl border-b-[3px] mb-4">Section 3</h1>
          <a
            href="#"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Link 1
          </a>
          <a
            href="#"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Link 2
          </a>
          <a
            href="#"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Link 3
          </a>
          <a
            href="#"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Link 4
          </a>
        </div>
        <div class="flex flex-col justify-start items-center h-[20rem]">
          <h1 class="text-white text-5xl border-b-[3px] mb-4">Section 4</h1>
          <a
            href="#"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Link 1
          </a>
          <a
            href="#"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Link 2
          </a>
          <a
            href="#"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Link 3
          </a>
          <a
            href="#"
            class="text-cyan-400 transition hover:text-white text-2xl mb-2"
          >
            Link 4
          </a>
        </div>
      </div>
      <div class="p-12 border-t-[3px] flex items-center justify-stretch border-t-white w-full">
        <div class="flex items-center w-full">
          <img
            class="mx-4 size-[5.5rem]"
            src="/images/rabbi.webp"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
          <h1 class="text-white text-5xl">RABBI</h1>
        </div>
        <p class="text-slate-700 text-[1rem] text-center">
          Made By Eitan Brochstein
        </p>
      </div>
    </footer>
  );
}
