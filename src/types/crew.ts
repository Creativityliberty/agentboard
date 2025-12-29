export interface AgentRole {
    name: string;
    role: string;
    goal: string;
    backstory: string;
}

export interface CrewTask {
    id: string;
    agentName: string;
    description: string;
    expectedOutput: string;
}

export interface CrewDesignResponse {
    agents: AgentRole[];
    tasks: CrewTask[];
    mermaidFlow: string;
    explanation: string;
}

export interface CrewDesignRequest {
    objective: string;
    complexity?: 'Simple' | 'Complex' | 'Autonomous';
}
