import type { LoaderArgs } from "@remix-run/node";
import { authenticator } from "lib/auth.server";
import { z } from "zod";

export async function loader({ request, params }: LoaderArgs) {
  const provider = z.string().parse(params.provider);
  await authenticator.authenticate(provider, request, {
    successRedirect: "/",
    failureRedirect: "/login",
  });
  return null;
}
