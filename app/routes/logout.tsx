import type { ActionFunction } from "@remix-run/node";
import { authenticator } from "lib/auth.server";

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/" });
};
