import { z } from 'zod';

export type ApiEndpoint = {
    endpoint: string;
    validator?: z.AnyZodObject;
};

const StringOrNumber = z.union([z.string(), z.number()]);

export const Endpoints: Record<string, ApiEndpoint> = {
	Authenticate: {
		endpoint: '/auth',
		validator: z.object({
			api_key: z.string()
		})
	},
	KeyValid: {
		endpoint: '/key',
		validator: z.object({
			api_key: z.string()
		})
	},
	GetAgents: {
		endpoint: '/agents'
	},
	GetAgent: {
		endpoint: '/agent/{agent_id}',
		validator: z.object({
			agent_id: StringOrNumber
		})
	},
	GetConversations: {
		endpoint: '/conversations'
	},
	GetConversation: {
		endpoint: '/conversations/{conversation_id}',
		validator: z.object({
			conversation_id: StringOrNumber
		})
	},
	NewConversation: {
		endpoint: '/conversations/new',
		validator: z.object({
			agent_id: StringOrNumber
		})
	},
	NewMessage: {
		endpoint: '/conversations/msg/{conversation_id}',
		validator: z.object({
			conversation_id: StringOrNumber,
			message: z.string()
		})
	}
} as const;
