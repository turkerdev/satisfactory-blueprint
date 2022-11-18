import { useLoaderData } from "@remix-run/react";
import { db } from "lib/db.server";
import BlueprintCard from "~/components/BlueprintCard";

export async function loader() {
  return await db.blueprint.findMany({
    where: {
      is_public: true,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      download_count: true,
      description: true,
    },
    orderBy: {
      download_count: "desc",
    },
  });
}

export default function Index() {
  const blueprints = useLoaderData<typeof loader>();

  return (
    <div className="w-[1024px] mx-auto grid grid-cols-4 py-6 gap-4">
      {blueprints.map((bp) => (
        <BlueprintCard
          key={bp.id}
          id={bp.id}
          name={bp.name}
          slug={bp.slug}
          description={bp.description}
          download_count={bp.download_count}
        />
      ))}
    </div>
  );
}
