export interface SemanticMapResponse {
    mermaidCode: string;
    concepts: string[];
    summary: string;
}

export interface SemanticMapRequest {
    urls: string[];
    focus?: string;
}
