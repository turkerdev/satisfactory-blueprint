import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "lib/db.server";
import { DownloadSimple } from "phosphor-react";
import { z } from "zod";

export async function loader({ params }: LoaderArgs) {
  const { projectId, "*": splat } = await z
    .object({
      projectId: z.string(),
      "*": z.string(),
    })
    .parseAsync(params);

  const bp = await db.blueprint.findUnique({
    where: { id: projectId },
  });

  if (!bp) {
    throw redirect("/");
  }

  if (splat !== bp.slug) {
    throw redirect(bp.slug);
  }

  return {
    projectId,
    name: bp.name,
    description: bp.description,
    download_count: bp.download_count,
  };
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="flex w-fit mx-auto gap-4">
      <div className="p-4 lg:w-[720px] mx-auto flex flex-col gap-2">
        <h1 className="text-center capitalize text-4xl mb-10">{data.name}</h1>
        <p className="">{data.description || "No description"}</p>
      </div>
      <div className="w-[196px] mt-24 p-2 pl-4 flex flex-col gap-2 border-l border-neutral-700">
        <a
          className="font-bold text-lg hover:bg-red-600 hover:text-white text-red-400 border border-red-600 rounded px-2 py-1 w-full text-center"
          href={`/download/${data.projectId}`}
          download
        >
          Download
        </a>
        <span className="flex gap-2 items-center text-neutral-400">
          <DownloadSimple size={24} /> {data.download_count}
        </span>
      </div>
    </div>
  );
}
