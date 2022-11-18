import { useLoaderData } from "@remix-run/react";
import { db } from "lib/db.server";
import { env } from "lib/env.server";
import BlueprintCard from "~/components/BlueprintCard";

export async function loader() {
  const blueprints = await db.blueprint.findMany({
    where: {
      is_public: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      download_count: true,
      description: true,
      thumbnail_key: true,
    },
    orderBy: {
      download_count: "desc",
    },
  });

  return blueprints.map(
    ({ description, download_count, id, name, slug, thumbnail_key }) => ({
      id,
      name,
      slug,
      description,
      download_count,
      thumbnail: env.CF_PUBLIC_IMG_URL + "/" + thumbnail_key,
    })
  );
}

export default function Index() {
  const blueprints = useLoaderData<typeof loader>();

  return (
    <div className="p-6 gap-4 mx-auto grid grid-cols-1 max-w-sm sm:grid-cols-2 sm:max-w-xl md:grid-cols-2 lg:grid-cols-3 lg:max-w-4xl xl:grid-cols-4 xl:max-w-5xl">
      {blueprints.map((bp) => (
        <BlueprintCard
          key={bp.id}
          id={bp.id}
          name={bp.name}
          slug={bp.slug}
          description={bp.description}
          download_count={bp.download_count}
          thumbnail={bp.thumbnail}
        />
      ))}
    </div>
  );
}
