import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "lib/db.server";
import { z } from "zod";

export async function loader({ params }: LoaderArgs) {
  const { projectId } = await z
    .object({
      projectId: z.string(),
    })
    .parseAsync(params);

  const blueprint = await db.blueprint.findUnique({
    where: { id: projectId },
  });

  if (!blueprint) {
    throw redirect("/");
  }

  return {
    name: blueprint.name,
    description: blueprint.description,
    file: `${blueprint.slug}_${projectId}.zip`,
  };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <a href={`/download/${data.file}`} download>
        Download
      </a>
    </div>
  );
}
