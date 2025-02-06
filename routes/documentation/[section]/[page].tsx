import { PageProps } from "$fresh/server.ts";

export default function Item(props: PageProps) {
    const { section, page } = props.params;
    return (
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Documentation Page</title>
            </head>
            <body>
                <h1>{section}</h1>
                <h2>{page}</h2>
            </body>
        </html>
    );
}
