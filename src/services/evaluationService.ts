import { CSVData, Result, SpeakerData, SpeakerDict } from '../models/evaluation'

export const parseFileData = (data: CSVData[]) => {
    const fileSpeakersTotal: SpeakerDict = {};
    data.forEach(row => {
        let speaker: SpeakerData;
        if (!fileSpeakersTotal[row.speaker]) {
            fileSpeakersTotal[row.speaker] = new SpeakerData(row.speaker)
        }
        speaker = fileSpeakersTotal[row.speaker];
        speaker.updateYearSpeechValue(new Date(row.date).getFullYear().toString(), 1);
        speaker.updateTopicSpeechValue(row.topic.toLowerCase(), 1);
        speaker.updateWordsCount(row.words);
    })
    return fileSpeakersTotal;
}

const getYearMostSpeaker = (combinedSpeakersData: SpeakerDict, year: string) => {
    // Only return the most speaker, but null if there are 2 speaker with the same count
    const yearMost = Math.max(...Object.values(combinedSpeakersData).filter(speaker => speaker.yearSpeeches.get(year) !== undefined).map(speaker => speaker.yearSpeeches.get(year) ?? 0));
    const yearMostSpeakers = Object.values(combinedSpeakersData).filter(speaker => speaker.yearSpeeches.get(year) == yearMost);
    const yearMostSpeaker = yearMostSpeakers.length == 1 ? yearMostSpeakers[0].name : null;
    return yearMostSpeaker;
}

const getTopicMostSpeaker = (combinedSpeakersData: SpeakerDict, topic: string) => {
    // Only return the most speaker, but null if there are 2 speaker with the same count
    const topicMost = Math.max(...Object.values(combinedSpeakersData).filter(speaker => speaker.topicSpeeches.get(topic) !== undefined).map(speaker => speaker.topicSpeeches.get(topic) ?? 0));
    const topicMostSpeakers = Object.values(combinedSpeakersData).filter(speaker => speaker.topicSpeeches.get(topic) == topicMost);
    const topicMostSpeaker = topicMostSpeakers.length == 1 ? topicMostSpeakers[0].name : null;
    return topicMostSpeaker;
}

const getWordsCountLeast = (combinedSpeakersData: SpeakerDict) => {
    // Only return the most speaker, but null if there are 2 speaker with the same count
    const wordCountLeast = Math.min(...Object.values(combinedSpeakersData).filter(speaker => speaker.wordsCount !== undefined).map(speaker => speaker.wordsCount));
    const wordCountLeastSpeakers = Object.values(combinedSpeakersData).filter(speaker => speaker.wordsCount == wordCountLeast);
    const wordCountLeastSpeaker = wordCountLeastSpeakers.length == 1 ? wordCountLeastSpeakers[0].name : null;
    return wordCountLeastSpeaker;
}

export const getSpeakersStatistic = (speakersTotal: SpeakerDict[], year: string = '2013', topic: string = 'Internal security'): {
    mostSpeeches: Result,
    mostSecurity: Result,
    leastWordy: Result,
    debug: any
} => {
    const combinedSpeakersData: SpeakerDict = {}
    topic = topic.toLowerCase();
    speakersTotal.forEach(speakers => {
        for (const [key, value] of Object.entries(speakers)) {
            if (!combinedSpeakersData[key]) {
                combinedSpeakersData[key] = new SpeakerData(value.name);
            }
            const speaker = combinedSpeakersData[key];
            speaker.updateYearSpeechValue(year, value.yearSpeeches.get(year));
            speaker.updateTopicSpeechValue(topic, value.topicSpeeches.get(topic));
            speaker.updateWordsCount(value.wordsCount);
        }
    })

    return {
        mostSpeeches: getYearMostSpeaker(combinedSpeakersData, year),
        mostSecurity: getTopicMostSpeaker(combinedSpeakersData, topic),
        leastWordy: getWordsCountLeast(combinedSpeakersData),
        debug: combinedSpeakersData
    }
}
