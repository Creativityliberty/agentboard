export enum MessageSender {
    USER = 'user',
    MODEL = 'model',
    SYSTEM = 'system',
}

export interface ChatMessage {
    id: string;
    text: string;
    sender: MessageSender;
    timestamp: Date;
    isLoading?: boolean;
}

export interface URLGroup {
    id: string;
    name: string;
    urls: string[];
}
