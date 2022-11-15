import S3 from "aws-sdk/clients/s3";
import { env } from "./env.server";

export const s3 = new S3({
  endpoint: `https://${env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  accessKeyId: env.CF_ACCESS_ID,
  secretAccessKey: env.CF_ACCESS_SECRET,
  signatureVersion: "v4",
});
