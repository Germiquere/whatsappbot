export interface CreateAgentResponse {
    success: boolean;
    data:    Data;
}

export interface Data {
    id:             string;
    type:           string;
    name:           string;
    description:    string;
    isActive:       boolean;
    createdAt:      Date;
    updatedAt:      Date;
    apiUserId:      string;
    avatar:         string;
    initialMessage: string;
    llms:           LlmElement[];
    llmModel:       string;
    prompt:         string;
    apiUser:        APIUser;
    datasources:    LlmElement[];
    tools:          LlmElement[];
    workflowSteps:  WorkflowStep[];
    metadata:       Metadata;
    outputSchema:   string;
}

export interface APIUser {
    id:              string;
    createdAt:       Date;
    updatedAt:       Date;
    token:           string;
    email:           string;
    llms:            Llm[];
    datasources:     APIUserDatasource[];
    tools:           APIUserDatasource[];
    workflows:       APIKey[];
    vectorDb:        Llm[];
    workflowConfigs: WorkflowConfig[];
    apiKeys:         APIKey[];
}

export interface APIKey {
    id:             string;
    name:           string;
    displayApiKey?: string;
    createdAt:      Date;
    updatedAt:      Date;
    apiUserId:      string;
}

export interface APIUserDatasource {
    id:            string;
    name:          string;
    type:          string;
    apiUserId:     string;
    createdAt:     Date;
    updatedAt:     Date;
    status?:       string;
    description?:  string;
    returnDirect?: boolean;
}

export interface Llm {
    id:        string;
    provider:  string;
    apiKey?:   string;
    createdAt: Date;
    updatedAt: Date;
    apiUserId: string;
}

export interface WorkflowConfig {
    id:         string;
    createdAt:  Date;
    updatedAt:  Date;
    workflowId: string;
}

export interface LlmElement {
    agentId:       string;
    datasourceId?: string;
    createdAt:     Date;
    updatedAt:     Date;
    llmId?:        string;
    toolId?:       string;
}

export interface Metadata {
    key: string;
}

export interface WorkflowStep {
    id:         string;
    order:      number;
    workflowId: string;
    createdAt:  Date;
    updatedAt:  Date;
    agentId:    string;
}
