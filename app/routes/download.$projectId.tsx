import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { db } from "lib/db.server";
import { env } from "lib/env.server";
import { s3 } from "lib/s3.server";
import { getSession } from "lib/session.server";
import { z } from "zod";

export async function loader({ params, request }: LoaderArgs) {
  const { projectId } = await z
    .object({
      projectId: z.string(),
    })
    .parseAsync(params);

  const bp = await db.blueprint.findUnique({
    where: { id: projectId },
  });

  if (!bp) {
    throw redirect("/");
  }

  const session = await getSession(request.headers.get("Cookie"));
  if (!bp.is_public && bp.userId !== session?.data?.user?.id) {
    throw redirect("/");
  }

  await db.blueprint.update({
    where: { id: projectId },
    data: {
      download_count: { increment: 1 },
    },
  });

  const file = await s3.getSignedUrlPromise("getObject", {
    Bucket: env.CF_BUCKET,
    Key: `${bp.slug}_${projectId}.zip`,
    Expires: 60,
  });

  return redirect(file);
}
