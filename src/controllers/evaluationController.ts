import { Request, Response } from 'express';
import { SpeakerDict } from '../models/evaluation'
import { parseFileData, getSpeakersStatistic } from '../services/evaluationService'

const { Worker } = require("worker_threads");

const getValidUrl = (urlString: string) => {
  if (urlString.includes("http") || urlString.includes("https")) {
    return urlString;
  }
  return "http://localhost:3000/" + urlString; // Check if file exist in public folder, needs to adapt to the real host and port
}

const createWorker = (url: string) => {
  return new Promise(function (resolve, reject) {
    const worker = new Worker(__dirname + "/../worker/getFileFromUrl.js", {
      workerData: { url }
    });
    worker.on("message", (data: any) => {
      resolve(data);
    });
    worker.on("error", (msg: any) => {
      reject(`An error ocurred: ${msg}`);
    });
  });
}

const evaluationController = async (req: Request, res: Response<any>) => {
  if (!req.query.url) {
    return res.json({
      mostSpeeches: null,
      mostSecurity: null,
      leastWordy: null
    })
  }

  let urls = Array.isArray(req.query.url)
    ? req.query.url.map(url => getValidUrl(url as string))
    : [getValidUrl(req.query.url as string)];
  urls = urls.filter(url => !!url);
  const completeData: SpeakerDict[] = []
  if (urls.length == 0) {
    return res.json({ message: "Invalid urls or urls do not contain csv files" });
  }

  // Create a separate thread to fetching and processing the data from URLS
  const workerPromises: Promise<any>[] = []
  for (const url of urls) {
    workerPromises.push(createWorker(url));
  }
  const result = await Promise.all(workerPromises);
  completeData.push(...result);
  return res.json(getSpeakersStatistic(completeData))
}

export default evaluationController;
