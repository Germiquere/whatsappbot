export interface ICreateCallResponse {
    id:                  string;
    type:                string;
    createdAt:           Date;
    updatedAt:           Date;
    orgId:               string;
    cost:                number;
    assistant:           Assistant;
    phoneNumber:         PhoneNumber;
    customer:            Customer;
    status:              string;
    phoneCallProvider:   string;
    phoneCallProviderId: string;
    phoneCallTransport:  string;
}

interface Assistant {
    name:                  string;
    transcriber:           Transcriber;
    model:                 Model;
    voice:                 Voice;
    firstMessage:          string;
    firstMessageMode:      string;
    recordingEnabled:      boolean;
    serverMessages:        string[];
    silenceTimeoutSeconds: number;
    maxDurationSeconds:    number;
    serverUrl:             string;
}

interface Model {
    model:       string;
    provider:    string;
    temperature: number;
}

interface Transcriber {
    model:    string;
    language: string;
    provider: string;
}

interface Voice {
    voiceId:                   string;
    provider:                  string;
    inputPreprocessingEnabled: boolean;
}

interface Customer {
    number: string;
    name:   string;
}

interface PhoneNumber {
    name:              string;
    twilioPhoneNumber: string;
    twilioAccountSid:  string;
    twilioAuthToken:   string;
}
