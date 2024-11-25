import { useSignal } from "@preact/signals";
import Counter from "../islands/Counter.tsx";
import Navbar from "../islands/Navbar.tsx";
import RedLinkBtn from "../components/buttons/RedLinkBtn.tsx";
import NormalLink from "../components/buttons/NormalLink.tsx";
import Footer from "../islands/Footer.tsx";

export default function Home() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>FTC Gann Documentation</title>
      </head>
      <body class="font-forum">
        <section class="flex flex-wrap space-x-3 space-y-4 min-h-[80vh] max-sm:min-h-[90vh] px-8 max-md:pt-20 justify-around items-center inset-0 bg-[linear-gradient(to_right_bottom,rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url('https://imagescdn.homes.com/i2/bRuQxp-5oG4CrZgJ0vb1z8OnBtQoY9k3yIt0m5imaRc/117/gann-academy-waltham-ma-primaryphoto.jpg?p=1')] bg-cover bg-center backdrop-blur-sm">
          <div class="lg:w-[40rem] max-lg:w-[20rem] max-md:w-full max-lg:shrink-0 h-full flex items-center justify-center flex-col shrink">
            <h1 class="text-6xl max-md:text-4xl font-bold text-white text-shadow-mdwhite text-center">
              FTC Gann Documentation
            </h1>
            <p class="my-5 text-white text-center">
              Official Documentation for all FTC code written for the RABBI
              Robotics Team
            </p>
            <div class="flex space-x-4">
              <RedLinkBtn
                class="hover:shadow-mdwhite"
                text="Get Started"
                link="https://google.com"
              />
              <RedLinkBtn
                class="hover:shadow-mdwhite"
                text="Admin Login"
                link="https://google.com"
              />
            </div>
          </div>
          <div class="w-[19rem] h-[19rem] max-lg:w-[15rem] max-lg:h-[15rem] flex items-center justify-center">
            <img
              class="my-6 w-full h-full"
              src="/images/rabbi.webp"
              alt="Rabbi"
            />
          </div>
          <script src="/ts/scroll.ts"></script>
        </section>
        <section class="flex px-12 py-16 items-center justify-center flex-col bg-slate-100">
          <h1 class="text-6xl font-bold mb-8 flex">
            About<p class="ml-4 text-red-900 tracking-wide">RABBI</p>
          </h1>
          <div class="flex flex-wrap justify-center items-center sm:space-x-12 mb-16">
            <img
              class="my-6 w-[20rem] h-[20rem]"
              src="/images/rabbi.webp"
              alt="Rabbi"
            />
            <p class="text-lg w-[35rem] max-sm:w-[100%] text-center">
              Rabbi was founded in 2010, Lorem ipsum, dolor sit amet consectetur
              adipisicing elit. Id officia ea ipsam rem placeat! Voluptates
              placeat eveniet harum impedit dolorem officiis fuga, beatae eos,
              odio reprehenderit, quisquam eaque quam nam.
            </p>
          </div>
          <h1 class="text-6xl font-bold mb-8 text-center">
            How To Install Code
          </h1>
          <p class="space-y-4 text-2xl text-center md:w-[50rem] mb-8">
            To Install The FTC Code, you'll need to install{" "}
            <b class="text-red-700 font-bold">Git</b> from{" "}
            <NormalLink
              link="https://git-scm.com/downloads"
              text="This Link"
            />, and you'll need to install a{" "}
            <b class="text-red-700 font-bold">JVM</b>{" "}
            <NormalLink link="https://adoptium.net" text="Here" />. If you
            already have both, then move on to the follow steps:
          </p>
          <p class="text-2xl text-center">
            Open Up the Terminal with you desired directory, and run this
            command to download the code:
          </p>
          <p class="bg-slate-900 p-2 rounded-lg mb-4">
            <code class="text-white">
              $ <b class="text-red-700">git</b>{" "}
              clone https://github.com/RABBI-4466/FTC-2024-2025.git
            </code>
          </p>
          <p class="text-md text-red-900 mb-12 text-center">
            If the clone didn't work, make sure that you have proper access to
            the repository, otherwise it won't work
          </p>
          <h1 class="text-6xl font-bold mb-8 text-center">
            Installing Android Studio IDE
          </h1>
          <p class="space-y-4 text-2xl text-center md:w-[50rem] mb-4">
            In order to run and use the code properly, you'll need to install
            the <b class="text-red-700 font-bold">Android Studio IDE</b>{" "}
            <NormalLink
              link="https://developer.android.com/studio"
              text="Here"
            />. Android Studio is needed, since we use Android Phones for the
            custom FTC App to connect to the robots.
          </p>
          <p class="space-y-4 text-2xl text-center md:w-[50rem] mb-4">
            Along with installing Android Studio, you'll also need to install
            the{"  "}
            <b class="text-red-700 font-bold">Android Debug Bridge (ADB)</b>.
            Here's how you download ADB on different operating systems:
          </p>
          <div class="flex w-[100%] justify-center items-top sm:space-x-8 flex-wrap">
            <div class="flex flex-col">
              <h1 class="text-6xl font-bold mb-8 text-center">Windows:</h1>
              <RedLinkBtn
                link="https://dl.google.com/android/installer_r24.4.1-windows.exe"
                text="Download Windows Installer"
                class="hover:shadow-mdblack"
              />
            </div>
            <div class="flex flex-col">
              <h1 class="text-6xl font-bold mb-8 text-center">Mac (Brew):</h1>
              <p class="bg-slate-900 p-2 rounded-lg mb-4">
                <code class="text-white">
                  $ <b class="text-red-700">brew</b>{"  "}upgrade
                </code>
                <br></br>
                <code class="text-white">
                  $ <b class="text-red-700">brew</b>{"  "}
                  install android-platform-tools
                </code>
              </p>
            </div>
            <div class="flex flex-col">
              <h1 class="text-6xl font-bold mb-8 text-center">Linux (Apt):</h1>
              <p class="bg-slate-900 p-2 rounded-lg mb-4">
                <code class="text-white">
                  $ <b class="text-red-700">sudo</b>{"  "}apt-get update
                </code>
                <br></br>
                <code class="text-white">
                  $ <b class="text-red-700">sudo</b>{"  "}
                  apt-get -y install android-tools-adb
                </code>
              </p>
            </div>
          </div>
          <p class="mb-8 text-center">
            There are many other ways to install ADB, so if you have a preferred
            alternative, that is completely fine
          </p>
          <RedLinkBtn
            class="uppercase tracking-wide hover:shadow-mdblack text-4xl"
            link="/documentation"
            text="Start Programming"
          />
        </section>
        <Footer />
        <Navbar />
      </body>
    </html>
  );
}
