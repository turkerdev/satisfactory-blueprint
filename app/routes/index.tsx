import type { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "lib/db.server";
import { DownloadSimple } from "phosphor-react";

export async function loader({}: LoaderArgs) {
  return await db.blueprint.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      download_count: true,
      description: true,
    },
  });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="w-[1024px] mx-auto grid grid-cols-4 py-6 gap-4">
      {data.map((bp) => (
        <div
          key={bp.id}
          className="p-2 border-b border-t border-neutral-600 flex flex-col gap-2"
        >
          <Link
            to={`/bp/${bp.id}/${bp.slug}`}
            className="mb-1 text-red-400 text-lg hover:text-white"
          >
            {bp.name}
          </Link>
          <Link to={`/bp/${bp.id}/${bp.slug}`}>
            <p>{bp.description?.substring(0, 200)}</p>
          </Link>
          <div className="flex justify-around mt-auto">
            <span className="flex gap-2 items-center text-neutral-400">
              <DownloadSimple size={24} /> {bp.download_count}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
