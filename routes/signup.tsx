export default function Signup() {
    return (
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Sign Up</title>
        </head>
        <body>
          <h1>Sign Up</h1>
          <form method="post" action="/api/signup">
            <input type="text" name="username" />
            <input type="text" name="password" />
            <button type="submit">Submit</button>
          </form>
        </body>
      </html>
    );
  }