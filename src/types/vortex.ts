export interface VortexPromptFormState {
    agentName: string;
    objective: string;
    context: string;
    persona: string;
    expertise: string;
    capabilities: string;
    outputFormat: string;
    redLines: string;
    riskLevel: 'prudent' | 'balanced' | 'aggressive';
}

export interface GeneratedPrompt {
    markdown: string;
    ascii: string;
    json: string;
}
