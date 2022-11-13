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
    <div className="flex w-fit mx-auto gap-4">
      <div className="p-4 w-[1024px] mx-auto flex flex-col gap-2 ml-[196px]">
        <h1 className="text-center capitalize text-4xl mb-10">{data.name}</h1>
        <p className="">{data.description || "No description"}</p>
      </div>
      <div className="w-[196px] mt-12 p-2 pl-4 flex flex-col gap-1 border-l border-neutral-700">
        <a
          className="font-bold text-lg hover:bg-red-600 hover:text-white text-red-500 border border-red-600 rounded px-2 py-1 w-full text-center"
          href={`/download/${data.file}`}
          download
        >
          Download
        </a>
      </div>
    </div>
  );
}
