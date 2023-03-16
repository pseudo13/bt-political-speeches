const { workerData, parentPort } = require("worker_threads");
import axios from "axios";
import csvToJson from "csvtojson";
import { parseFileData } from '../services/evaluationService'

const lowerKeyObject = (obj: any) => Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v])
);

const downloadCSVFile = async (url: string) => {
    return await axios.get(url, {
        responseType: 'blob'
    }).then(async (res: any) => {
        const convertedData = await csvToJson().fromString(res.data);
        return convertedData.map(data => lowerKeyObject(data));
    }).catch(e => {
        console.log(e.message)
        return [];
    })
}

const run = async () => {
    const result: any[] = await downloadCSVFile(workerData.url);
    const speakersData = parseFileData(result);
    parentPort.postMessage(speakersData);
}
run();

