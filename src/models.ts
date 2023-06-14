type StringOrNumber = string | number;

export type AuthToken = {
    token: string;
    scope: Array<string>;
};

export type AgentData = {
    id: StringOrNumber;
    name: string;
    user_id: StringOrNumber;
    image: string;
    template_id: StringOrNumber;
    created: string;
    last_modified: string;
    status: string;
};

export type ConversationData = {
    conversation_id: StringOrNumber;
    agent_id: StringOrNumber;
    is_closed: number;
    conversation_created: string;
    name: string;
    user_id: StringOrNumber;
    image: string;
    template_id: StringOrNumber;
    agent_created: string;
    last_modified: string;
    status: string;
    last_message_timestamp: string;
};

export type MessageData = {
    id: StringOrNumber;
    sender_type: string;
    message: string;
};
