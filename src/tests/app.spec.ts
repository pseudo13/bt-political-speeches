import request from "supertest";
import { Express } from 'express-serve-static-core';
import { faker } from "@faker-js/faker"
import fs from "fs";
import json2csv from "json2csv"

import { CSVData } from "../models/evaluation"

import { buildApp } from "../index"
let server: Express
let speakers: CSVData[];
let topics = ["Internal security", "Education Policy", "Coal Subsidies", "External security"];
let names = ["Alpha", "Beta", "Gamma", "Omega", "Giga"]
let csvFileName = 'example.csv';
const internalSecurity = "Internal security";
const url = '/evaluation?url=http://localhost:3000/' + csvFileName;
console.log(url);

server = buildApp(3001);

describe('APP should return the correct calculation', () => {
    beforeAll(async () => {
        speakers = [];
        [...Array(20)].map((_) => {
            speakers.push({
                date: faker.date.between("2012", "2014"),
                speaker: names[faker.datatype.number({ min: 0, max: names.length - 1 })],
                topic: topics[faker.datatype.number({ min: 0, max: topics.length - 1 })],
                words: faker.datatype.number()
            })
        });
        const csvData = await json2csv.parseAsync(speakers)
        fs.writeFileSync(__dirname + "/../../public/" + csvFileName, csvData)
        function availableRoutes() {
            return server._router.stack
                .filter((r: any) => r.route)
                .map((r: any) => {
                    return {
                        method: Object.keys(r.route.methods)[0].toUpperCase(),
                        path: r.route.path
                    };
                });
        }
        const routes = availableRoutes();
    });
    afterAll(async () => {
        fs.unlinkSync(__dirname + "/../../public/" + csvFileName);
    })

    // This test does not return response because worker-threads does not run successfully
    it('should return 200', (done) => {
        request(server)
            .get(url)
            .expect(200)
            .end((err, res) => {
                const speakers2013 = speakers.filter(speaker => new Date(speaker.date).getFullYear().toString() == '2013');
                const speakersSecurity = speakers.filter(speaker => speaker.topic.toLowerCase() == internalSecurity);

                interface Speakercount {
                    [key: string]: number
                }
                let keys = (obj: any, value: any) => Object.keys(obj).filter(k => obj[k] === value);

                const speakersYear: Speakercount = {}
                names.forEach(name => {
                    speakersYear[name] = speakers2013.filter(speaker => speaker.speaker == name)?.length ?? 0
                })
                const maxYearCount = Math.max(...Object.values(speakersYear));
                const maxYearSpeakers = keys(speakersYear, maxYearCount);
                const speakerWithMostSpeechBy2013 = maxYearSpeakers.length == 1 ? maxYearSpeakers[0] : null;

                const speakersTopic: Speakercount = {}
                names.forEach(name => {
                    speakersTopic[name] = speakersSecurity.filter(speaker => speaker.speaker == name)?.length ?? 0
                })
                const maxTopicCount = Math.max(...Object.values(speakersTopic));
                const maxTopicSpeakers = keys(speakersTopic, maxTopicCount);
                const speakerWithMostSpeechByTopic = maxTopicSpeakers.length == 1 ? maxTopicSpeakers[0] : null;

                const speakersWordsCount: Speakercount = {};
                speakers.forEach(speaker => {
                    if (!speakersWordsCount[speaker.speaker]) {
                        speakersWordsCount[speaker.speaker] = +speaker.words;
                    } else {
                        speakersWordsCount[speaker.speaker] += +speaker.words;
                    }
                })
                const minWordsCount = Math.min(...Object.values(speakersWordsCount));
                const minWordSpeakers = keys(speakersTopic, minWordsCount);
                const speakerWithMinimalWords = minWordSpeakers.length == 1 ? maxTopicSpeakers[0] : null;

                console.log(res.body)
                expect(res.body).toContain({
                    mostSpeeches: speakerWithMostSpeechBy2013,
                    mostSecurity: speakerWithMostSpeechByTopic,
                    leastWordy: speakerWithMinimalWords
                });
                (server as any).close();
                done()
            })
    }, 10000);
});