import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import JSZip from "jszip";
import { authenticator } from "lib/auth.server";
import { db } from "lib/db.server";
import { env } from "lib/env.server";
import { s3 } from "lib/s3.server";
import { marked } from "marked";
import { nanoid } from "nanoid";
import slugify from "slugify";
import { z } from "zod";

export const action: ActionFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  const form = await request.formData();
  const data = await z
    .object({
      files: z
        .array(z.instanceof(File))
        .length(2)
        .refine((files) => {
          let sbpExist = false;
          let sbpcfgExist = false;
          for (const file of files) {
            if (file.name.endsWith(".sbp")) sbpExist = true;
            else if (file.name.endsWith(".sbpcfg")) sbpcfgExist = true;
          }

          return sbpExist && sbpcfgExist;
        }, "sbp and sbpcfg files must be present")
        .transform((files) => {
          const sbp = files.find((x) => x.name.endsWith(".sbp"));
          const sbpcfg = files.find((x) => x.name.endsWith(".sbpcfg"));
          if (!sbp || !sbpcfg) {
            throw new Error("How did we end up here?");
          }
          return { sbp, sbpcfg };
        })
        .refine(({ sbp, sbpcfg }) => {
          return sbp.size <= 1024 * 1024 && sbpcfg.size <= 1024;
        }, "I sense some shenanigans going on here"),
      name: z
        .string()
        .min(10)
        .max(64)
        .transform((value) => ({ name: value, slug: slugify(value) })),
      description: z.string().min(10).max(240),
      content: z.string().optional(),
    })
    .parseAsync({
      ...Object.fromEntries(form),
      files: form.getAll("files"),
    });

  const projectId = nanoid(4);

  const zip = new JSZip();
  zip.file(`${data.name.slug}_${projectId}.sbp`, await data.files.sbp.text());
  zip.file(
    `${data.name.slug}_${projectId}.sbpcfg`,
    await data.files.sbpcfg.text()
  );
  const zipped = await zip.generateAsync({ type: "uint8array" });

  await s3
    .upload({
      Bucket: env.CF_BUCKET,
      Key: `${data.name.slug}_${projectId}.zip`,
      Body: zipped,
    })
    .promise();

  await db.blueprint.create({
    data: {
      id: projectId,
      name: data.name.name,
      slug: data.name.slug,
      description: data.description,
      content: data.content,
      content_md: data.content ? marked.parse(data.content) : undefined,
      publisher: { connect: { id: user.id } },
    },
  });

  return redirect(`/bp/${projectId}/${data.name.slug}`);
};

export async function loader({ request }: LoaderArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  return null;
}

export default function Upload() {
  return (
    <div className="w-fit mx-auto mt-12">
      <Form
        method="post"
        encType="multipart/form-data"
        className="flex flex-col gap-2"
      >
        <label htmlFor="name-input">Blueprint Name</label>
        <input
          type="text"
          name="name"
          id="name-input"
          placeholder="Blueprint Name"
          maxLength={64}
          minLength={10}
          className="bg-transparent p-2 rounded border border-neutral-700 outline-none focus:border-red-500 focus:text-white text-neutral-300"
        />
        <label htmlFor="description-input">Description (240 character)</label>
        <input
          type="text"
          name="description"
          id="description-input"
          placeholder="Description"
          maxLength={240}
          minLength={10}
          className="bg-transparent p-2 rounded border border-neutral-700 outline-none focus:border-red-500 focus:text-white text-neutral-300"
        />
        <label htmlFor="content-input">Content (Markdown supported)</label>
        <textarea
          name="content"
          id="content-input"
          placeholder="No content"
          className="bg-transparent p-2 rounded border border-neutral-700 outline-none focus:border-red-500 focus:text-white text-neutral-300"
        />
        <label htmlFor="blueprint-input">Files (.sbp & .sbpcfg)</label>
        <input
          type="file"
          id="blueprint-input"
          name="files"
          accept=".sbp, .sbpcfg"
          multiple
        />
        <input
          type="submit"
          value="Upload"
          className="font-bold text-lg hover:bg-red-600 hover:text-white text-red-500 border border-red-600 rounded px-2 py-1 w-full text-center hover:cursor-pointer"
        />
      </Form>
    </div>
  );
}
