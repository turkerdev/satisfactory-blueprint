import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { env } from "lib/env.server";
import { z } from "zod";

export async function loader({ params, request }: LoaderArgs) {
  const { file } = await z
    .object({
      file: z.string(),
    })
    .parseAsync(params);

  return redirect(env.CF_PUBLIC_URL + file);
}
