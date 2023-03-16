export interface EvaluationResult {
    mostSpeeches: null | string;
    mostSecurity: null | string;
    leastWordy: null | string;
}

export interface CSVData {
    speaker: string,
    topic: string,
    date: Date,
    words: number
}

export class SpeechValue extends Map<string, number> {
}

export interface SpeakerDict {
    [key: string]: SpeakerData
}

export interface SpeakerCount {
    [key: string]: number;
}

export class SpeakerData {
    constructor(public name: string, public yearSpeeches: SpeechValue = new Map(), public topicSpeeches: SpeechValue = new Map(), public wordsCount: number = 0) { }

    updateYearSpeechValue(key: string, value: number | undefined) {
        if (value == null || value == undefined) return;
        let speech = this.yearSpeeches.get(key);
        if (!speech) {
            this.yearSpeeches.set(key, value);
        } else {
            this.yearSpeeches.set(key, speech + value)
        }
    }

    updateTopicSpeechValue(key: string, value: number | undefined) {
        if (value == null || value == undefined) return;
        let speech = this.topicSpeeches.get(key);
        if (!speech) {
            this.topicSpeeches.set(key, value);
        } else {
            this.topicSpeeches.set(key, speech + value)
        }
    }

    updateWordsCount(count: number | undefined) {
        if (count == null || count == undefined) return;
        this.wordsCount += +count;
    }

    toJSON() {
        return {
            name: this.name,
            yearSpeeches: Object.fromEntries(this.yearSpeeches),
            topicSpeeches: Object.fromEntries(this.topicSpeeches),
            wordsCount: this.wordsCount
        }
    }
}

export type Result = string | null | undefined;