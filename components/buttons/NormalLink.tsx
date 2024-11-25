import { IS_BROWSER } from "$fresh/runtime.ts";
import { JSX } from "preact/jsx-runtime";

interface anchorArguments extends JSX.HTMLAttributes<HTMLAnchorElement> {
  text: string;
  link: string;
}

export default function NormalLink(props: anchorArguments) {
  return (
    <a
      href={props.link}
      disabled={!IS_BROWSER || props.disabled}
      class="text-red-900 transition-all hover:text-shadow-mdblack"
    >
      {props.text}
    </a>
  );
}
