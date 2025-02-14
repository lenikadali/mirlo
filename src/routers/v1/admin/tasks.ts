import { NextFunction, Request, Response } from "express";
import { userAuthenticated, userHasPermission } from "../../../auth/passport";
import cleanUpFiles from "../../../jobs/tasks/clean-up-files";
import initiateUserNotifcations from "../../../jobs/tasks/initiate-user-notifications";
import { startMovingFiles } from "../../../queues/moving-files-to-backblaze";

export default function () {
  const operations = {
    GET: [userAuthenticated, userHasPermission("admin"), GET],
  };

  async function GET(req: Request, res: Response, next: NextFunction) {
    const { jobName, jobParam } = req.query;
    const result: { [key: string]: "Success" } = {};
    try {
      if (jobName) {
        if (jobName === "cleanUpFiles" && typeof jobParam === "string") {
          await cleanUpFiles(jobParam);
          result[jobName] = "Success";
        }
        if (
          jobName === "moveBucketToBackblaze" &&
          typeof jobParam === "string" &&
          [
            "artist-avatars",
            "artist-banners",
            "trackgroup-covers",
            "post-images",
          ].includes(jobParam)
        ) {
          await startMovingFiles(jobParam);
          result[jobName] = "Success";
        }
        if (jobName === "initiateUserNotifications") {
          await initiateUserNotifcations();
          result[jobName] = "Success";
        }
      }
      res.status(200).json({ result });
    } catch (e) {
      next(e);
    }
  }

  return operations;
}
