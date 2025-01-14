import { JSX } from "preact/jsx-runtime";

export default function Search(props: JSX.HTMLAttributes<HTMLInputElement>) {
	return (
        <div class="rounded-[1.3rem] bg-slate-200 flex justify-center items-center px-4 w-full">
            <img src="/images/svg/search.svg" alt="Search" />
            <input type="text" name="search" class={"w-full p-4 bg-transparent focus:outline-none text-red-900 font-semibold text-2xl " + props.class} placeholder="Search" />
        </div>
    );
}
