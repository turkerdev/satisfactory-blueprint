import type { LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "lib/db.server";

export async function loader({}: LoaderArgs) {
  return await db.blueprint.findMany({
    select: { id: true, name: true, slug: true },
  });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="w-[1024px] mx-auto grid grid-cols-4 py-6 gap-4">
      {data.map((bp) => (
        <div key={bp.id} className="border p-2 rounded border-neutral-600">
          <h2 className="mb-1 text-red-400 text-lg">{bp.name}</h2>
          <Link to={`/bp/${bp.id}/${bp.slug}`}>
            <img src="" alt="" width={480} height={270} />
          </Link>
        </div>
      ))}
    </div>
  );
}
