import { IS_BROWSER } from "$fresh/runtime.ts";
import { JSX } from "preact/jsx-runtime";

interface btnArguments extends JSX.HTMLAttributes<HTMLAnchorElement> {
  link: string;
  text: string;
}

export default function RedLinkBtn(props: btnArguments) {
  return (
    <a
      href={props.link}
      disabled={!IS_BROWSER || props.disabled}
      class={"bg-red-900 p-4 text-white rounded-3xl text-2xl transition-all mb-4 text-center hover:translate-y-1 " +
        props.class}
    >
      {props.text}
    </a>
  );
}
