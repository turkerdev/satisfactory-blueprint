import { Link } from "@remix-run/react";
import { DownloadSimple } from "phosphor-react";

type Props = {
  id: string;
  name: string;
  slug: string;
  description: string;
  download_count: number;
  thumbnail: string;
};

export default function BlueprintCard({
  id,
  name,
  description,
  download_count,
  slug,
  thumbnail,
}: Props) {
  return (
    <div
      key={id}
      className="p-2 border rounded border-neutral-600 flex flex-col gap-2"
    >
      <Link
        to={`/bp/${id}/${slug}`}
        className="text-red-400 text-2xl hover:text-white overflow-hidden"
      >
        {name}
      </Link>
      <Link to={`/bp/${id}/${slug}`}>
        <p className="overflow-hidden">{description}</p>
      </Link>
      <img
        src={thumbnail}
        alt="Thumbnail"
        className="mx-auto aspect-video h-32 mt-auto"
      />
      <div className="flex justify-around border-t pt-2 border-neutral-600">
        <span className="flex gap-2 items-center text-neutral-400">
          <DownloadSimple size={24} /> {download_count}
        </span>
      </div>
    </div>
  );
}
