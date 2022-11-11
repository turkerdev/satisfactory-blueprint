import type { LoaderArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "lib/auth.server";

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request);

  return {
    user: user ? { id: user.id } : null,
  };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      {data.user ? (
        <>
          <p>Hello {data.user.id}</p>
          <Link to="/upload">Upload</Link>
          <Form method="post" action="/logout">
            <button type="submit">Log out</button>
          </Form>
        </>
      ) : (
        <>
          <Link to="/login">Log in</Link>
        </>
      )}
    </div>
  );
}
