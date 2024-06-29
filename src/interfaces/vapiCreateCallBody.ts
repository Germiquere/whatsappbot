export interface ICreateCallBody {
    type:        string;
    assistant:   Assistant;
    customer:    Customer;
    phoneNumber?: PhoneNumber;
}

export interface Assistant {
    transcriber?:           Transcriber;
    model?:                 Model;
    serverMessages?:        string[];
    voice?:                 Voice;
    firstMessageMode?:      string;
    recordingEnabled?:      boolean;
    maxDurationSeconds?:    number;
    silenceTimeoutSeconds?: number;
    name?:                  string;
    firstMessage?:          string;
    serverUrl?:             string;
}

export interface Model {
    temperature?: number;
    provider?:    string;
    model?:       string;
}

export interface Transcriber {
    provider?: string;
    model?:    string;
    language?: string;
}

export interface Voice {
    inputPreprocessingEnabled?: boolean;
    provider?:                  string;
    voiceId?:                   string;
}

export interface Customer {
    number?: string;
    name?:   string;
}

export interface PhoneNumber {
    twilioPhoneNumber: string;
    twilioAccountSid:  string;
    twilioAuthToken:   string;
    name?:              string;
}
