export interface BlueprintAnalysis {
    mermaidCode?: string;
    uiCode?: string;
    explanation: string;
    timestamp: number;
}

export interface AnalysisRequest {
    image: string; // base64
    prompt?: string;
}
