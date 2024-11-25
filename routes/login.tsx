import { Handlers, PageProps } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";

interface Data {
  isLoggedIn: boolean;
}

export const handler: Handlers = {
  GET(req, res) {
    const cookies = getCookies(req.headers);
    const isLoggedIn = cookies.auth === "verysecretcode";
    if (isLoggedIn) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: "/",
        },
      });
    }
    return res.render({ isLoggedIn: isLoggedIn });
  },
};

export default function Login({ data }: PageProps<Data>) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Log In</title>
      </head>
      <body>
        <h1>Log In</h1>
        <form method="post" action="/api/login">
          <input type="text" name="username" />
          <input type="text" name="password" />
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  );
}
