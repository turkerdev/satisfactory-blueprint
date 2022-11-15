import type { LoaderArgs, MetaFunction } from "@remix-run/node";
import {
  Form,
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { authenticator } from "lib/auth.server";
import styles from "./styles/app.css";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Satisfactory Blueprints",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request);

  return {
    user: user ? { id: user.id } : null,
  };
}

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-[#1c1c1c] text-gray-100">
        <nav className="flex p-2 border-b border-b-neutral-500 gap-2 items-center">
          <Link to="/">
            <h1 className="text-2xl text-red-500 hover:text-white">
              Satisfactory Blueprints
            </h1>
          </Link>
          <span className="ml-auto" />
          {data.user ? (
            <>
              <Link
                to="/upload"
                className="hover:bg-red-600 hover:text-white text-red-500 border border-red-600 rounded py-1 px-3"
              >
                Upload
              </Link>
              <p>{data.user.id}</p>
              <Form method="post" action="/logout">
                <button
                  type="submit"
                  className="hover:text-red-500 text-neutral-400 border border-neutral-700 px-2 py-1 rounded"
                >
                  Log out
                </button>
              </Form>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-red-600 hover:bg-red-500 text-white rounded py-1 px-3"
              >
                Log in
              </Link>
            </>
          )}
        </nav>
        <main>
          <Outlet />
        </main>
        <footer className="bottom-0 fixed flex flex-col text-neutral-400 w-full">
          <p>Currently in beta. Please report any bugs or issues.</p>
          <p>New features will be added soon.</p>
          <a href="https://discord.gg/HtT7HgR72P" className="hover:text-white">
            https://discord.gg/HtT7HgR72P
          </a>
        </footer>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
