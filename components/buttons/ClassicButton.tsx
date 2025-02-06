import { JSX } from "preact/jsx-runtime";

interface Data extends JSX.HTMLAttributes<HTMLButtonElement> {
    text: string;
}

export default function ClassicButton(props: Data) {
    return (
        <button {...props} class={"text-center text-white text-2xl bg-red-900 w-[10rem] h-[3rem] rounded-2xl mb-4 transition-all hover:translate-y-2 hover:shadow-mdblack tracking-wide " + props.class}>
            {props.text}
        </button>
    );
}
