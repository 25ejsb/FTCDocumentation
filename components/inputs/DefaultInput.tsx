import { JSX } from "preact/jsx-runtime";

interface Data extends JSX.HTMLAttributes<HTMLInputElement> {}

export default function DefaultInput(props: Data) {
    return <input {...props} class={"border-none focus:outline-none shadow-md my-4 p-4 text-[2rem] max-sm:text-[1.25rem] rounded-2xl w-[70%] max-sm:w-[80%] bg-slate-200 " + props.class} />;
}
