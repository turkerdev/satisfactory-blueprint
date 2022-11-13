import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { authenticator } from "lib/auth.server";
import { z } from "zod";

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const { provider } = await z
    .object({
      provider: z.string(),
    })
    .parseAsync(Object.fromEntries(form));
  await authenticator.authenticate(provider, request);
};

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
  return null;
}

export default function Login() {
  return (
    <div className="flex flex-col w-fit mx-auto p-2 gap-3 mt-24">
      <Provider provider="discord" />
    </div>
  );
}

export function Provider({ provider }: { provider: string }) {
  return (
    <Form method="post">
      <input type="hidden" name="provider" value={provider} />
      <button
        className="bg-red-600 hover:bg-red-500 rounded px-2 py-1 w-full text-xl"
        type="submit"
      >
        Login via <span className="capitalize">{provider}</span>
      </button>
    </Form>
  );
}
