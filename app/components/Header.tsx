import { Form, Link } from "@remix-run/react";

type Props = {
  user: { id: string } | null;
};

export default function Header({ user }: Props) {
  return (
    <nav className="flex p-2 border-b border-b-neutral-500 gap-2 items-center">
      <Link to="/">
        <h1 className="text-2xl text-red-500 hover:text-white">
          Satisfactory Blueprints
        </h1>
      </Link>
      <span className="ml-auto" />
      {user ? (
        <>
          <Link
            to="/upload"
            className="hover:bg-red-600 hover:text-white text-red-500 border border-red-600 rounded py-1 px-3"
          >
            Upload
          </Link>
          <p>{user.id}</p>
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
  );
}
