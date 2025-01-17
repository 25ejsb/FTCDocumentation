import { JSX } from "preact/jsx-runtime";

interface Data extends JSX.HTMLAttributes<HTMLHeadingElement> {
	text: string;
}

export default function ClassicText(props: Data) {
	return (
		<h1
			class={"uppercase text-red-900 font-semibold text-shadow-mdblack tracking-wide " +
				props.class}
		>
			{props.text}
		</h1>
	);
}
