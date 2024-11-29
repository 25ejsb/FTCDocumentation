export default function Footer() {
  return (
    <footer class="flex flex-col items-center bg-slate-900 p-12">
      <div class="flex flex-wrap p-12 justify-center items-center">
        <div class="flex flex-col justify-center items-center h-[20rem] mx-4">
          <h1 class="text-white text-5xl border-b-[3px] mb-4 text-center">
            Main Pages
          </h1>
          <a
            href="/#"
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
        <div class="flex flex-col justify-center items-center h-[20rem] mx-4">
          <h1 class="text-white text-5xl border-b-[3px] mb-4 text-center">
            Section 2
          </h1>
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
        <div class="flex flex-col justify-center items-center h-[20rem] mx-4">
          <h1 class="text-white text-5xl border-b-[3px] mb-4 text-center">
            Section 3
          </h1>
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
        <div class="flex flex-col justify-center items-center h-[20rem] mx-4">
          <h1 class="text-white text-5xl border-b-[3px] mb-4 text-center">
            Section 4
          </h1>
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
      <div class="p-12 border-t-[3px] flex items-center justify-between max-sm:justify-center border-t-white max-sm:flex-wrap w-full">
        <div class="flex items-center w-[15rem] max-sm:my-4">
          <img
            class="mx-4 size-[5.5rem]"
            src="/images/rabbi.webp"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
          <h1 class="text-white text-5xl text-center">RABBI</h1>
        </div>
        <p class="text-slate-700 text-[1rem] text-center">
          Made By Eitan Brochstein
        </p>
      </div>
    </footer>
  );
}
