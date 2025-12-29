export interface BattleParticipant {
    name: string;
    systemPrompt: string;
}

export interface BattleResult {
    participantA: {
        answer: string;
        score: number;
        positives: string[];
    };
    participantB: {
        answer: string;
        score: number;
        positives: string[];
    };
    judgeAnalysis: string;
    suggestedFusedPrompt: string;
    winner: 'A' | 'B' | 'Draw';
}

export interface BattleRequest {
    promptA: string;
    promptB: string;
    query: string;
}
