import { JSX } from "preact/jsx-runtime";
import { Handlers, PageProps } from "$fresh/server.ts";
import { useEffect, useState } from "preact/hooks";
import { getSession, kv, User } from "../utils/db.ts";

interface Data extends JSX.HTMLAttributes<HTMLElement> {
    noBackgroundOnStart: boolean;
}

export default function Navbar(props: Data) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [session, setSession] = useState({
        isAuthenticated: false,
        user: {},
    });

    useEffect(() => {
        sessionData();
        const sessionId = document.cookie
            .split("; ")
            .find((cookie) => cookie.startsWith("session_id="))
            ?.split("=")[1];
        if (sessionId) {
            setIsLoggedIn(true);
        }
    }, []);

    const sessionData = async () => {
        try {
            const response = await fetch("/api/getSessionData");
            const data = await response.json();
            setSession(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <nav id="nav" class="fixed flex top-0 left-0 w-full h-20 p-12 max-md:px-6 items-center justify-between">
            <a href="/" class="flex items-center h-[6rem]">
                <img class="mx-4 size-[5.5rem]" src="/images/rabbi.webp" alt="the Fresh logo: a sliced lemon dripping with juice" />
                <h1 class="text-white text-5xl max-sm:hidden">RABBI</h1>
            </a>
            <div class="flex items-center justify-center space-x-4 text-white text-3xl max-md:hidden">
                <a href="/#" class="hover:text-shadow-mdwhite text-2xl max-lg:text-lg md:text-start">
                    Home
                </a>
                <a href="/documentation" class="hover:text-shadow-mdwhite text-2xl max-lg:text-lg md:text-start">
                    Documentation
                </a>
                {isLoggedIn ? (
                    <a href="/api/logout" class="hover:text-shadow-mdwhite text-2xl max-lg:text-lg md:text-start">
                        Log Out
                    </a>
                ) : (
                    <>
                        <a href="/login" class="hover:text-shadow-mdwhite max-lg:text-lg text-2xl md:text-start">
                            Log In
                        </a>
                        <a href="/signup" class="hover:text-shadow-mdwhite max-lg:text-lg text-2xl md:text-start">
                            Sign Up
                        </a>
                    </>
                )}
                {session.user != null ? (
                    <a href="/account" class="hover:text-shadow-mdwhite max-lg:text-lg text-2xl md:text-start">
                        @{(session.user as User).username}
                    </a>
                ) : (
                    <></>
                )}
            </div>
            <button id="menu-button" class="hidden max-md:flex">
                <img id="menu-button-image" src="/images/svg/menu.svg" alt="Menu" />
            </button>
            <div id="menu" class="fixed hidden justify-start p-16 items-center top-[6rem] left-0 w-full h-[30rem] bg-black/50 flex-col space-y-8">
                <a href="/#" class="hover:text-shadow-mdwhite md:text-start text-white text-4xl uppercase tracking-wide">
                    Home
                </a>
                <a href="/documentation" class="hover:text-shadow-mdwhite md:text-start text-white text-4xl uppercase tracking-wide">
                    Documentation
                </a>
                {isLoggedIn ? (
                    <a href="/api/logout" class="hover:text-shadow-mdwhite md:text-start text-white text-4xl uppercase tracking-wide">
                        Log Out
                    </a>
                ) : (
                    <>
                        <a href="/login" class="hover:text-shadow-mdwhite md:text-start text-white text-4xl uppercase tracking-wide">
                            Log In
                        </a>
                        <a href="/signup" class="hover:text-shadow-mdwhite md:text-start text-white text-4xl uppercase tracking-wide">
                            Sign Up
                        </a>
                    </>
                )}
                {session.user != null ? (
                    <a href="/account" class="hover:text-shadow-mdwhite md:text-start text-white text-4xl tracking-wide">
                        @{(session.user as User).username}
                    </a>
                ) : (
                    <></>
                )}
            </div>
            {props.noBackgroundOnStart ? (
                <>
                    <script src="/js/nav.js"></script>
                </>
            ) : (
                <>
                    <script src="/js/allBackground.js"></script>
                </>
            )}
        </nav>
    );
}
