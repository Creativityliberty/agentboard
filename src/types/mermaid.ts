export interface MermaidMessage {
    role: 'user' | 'model';
    text: string;
    codeBlock?: string;
    timestamp: number;
}

export const DEFAULT_MERMAID_CODE = `graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Debug]
    D --> B`;
