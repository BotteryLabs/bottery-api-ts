import fetch from 'node-fetch';
import { AuthToken, ConversationData, AgentData, MessageData } from './models';
import { ApiEndpoint, Endpoints } from './endpoints';

const BASE_URL = 'https://cloud.bottery.ai/api' as const;

type StringOrNumber = string | number;

export default class BotteryClient {
	private authToken: AuthToken | undefined;
	private static debug: boolean =
		process.env.BOTTERY_DEBUG !== undefined ?? false;

	private static measure(key: string) {
		if (this.debug) {
			console.time(key);
		}
	}

	private static endMeasure(key: string) {
		if (this.debug) {
			console.timeEnd(key);
		}
	}

	private static async apiRequest(
		endpoint: ApiEndpoint,
		headers: Record<string, string>,
		payload?: Record<string, any>
	) {
		this.measure('apiRequest-validator');
		let input = payload;
		if (endpoint.validator) {
			input = await endpoint.validator.safeParseAsync(payload);
			if (input.success) {
				input = input.data;
			} else {
				this.endMeasure('apiRequest-validator');
				throw new Error(
					`Invalid payload supplied to Bottery API Request: ${input}`
				);
			}
		}
		this.endMeasure('apiRequest-validator');

		let endpointUrl = `${BASE_URL}${endpoint.endpoint}`;

		if (input) {
			for (const key of Object.keys(input)) {
				endpointUrl = endpointUrl.replace(`{${key}}`, input[key]);
			}
		} else {
			input = {};
		}

		this.measure('apiRequest-fetch');

		const res = await fetch(endpointUrl, {
			method: 'POST',
			body: JSON.stringify(input),
			headers: headers
		});
		this.endMeasure('apiRequest-fetch');

		return await res.json();
	}

	static async isValidApiKey(apiKey: string): Promise<boolean> {
		const connectRes = await this.apiRequest(
			Endpoints.KeyValid,
			{
				'Content-Type': 'application/json'
			},
			{
				api_key: apiKey
			}
		);

		return (
			connectRes && connectRes.status && connectRes.status === 'success'
		);
	}

	private async authenticatedApiRequest(
		endpoint: ApiEndpoint,
		payload?: Record<string, any>
	) {
		if (!this.authToken) {
			throw new Error('You\'re not authenticated with Bottery');
		}

		return await BotteryClient.apiRequest(
			endpoint,
			{
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.authToken.token}`
			},
			payload
		);
	}

	async Connect(apiKey: string) {
		const connectRes = await BotteryClient.apiRequest(
			Endpoints.Authenticate,
			{
				'Content-Type': 'application/json'
			},
			{
				api_key: apiKey
			}
		);

		if (
			!connectRes ||
            !connectRes.status ||
            connectRes.status !== 'success'
		) {
			return false;
		}

		this.authToken = {
			token: connectRes.token,
			scope: connectRes.scope
		};
		return this.authToken;
	}

	async GetAgents() {
		return (await this.authenticatedApiRequest(
			Endpoints.GetAgents
		)) as Array<AgentData>;
	}

	async GetAgent(agentId: StringOrNumber) {
		return (await this.authenticatedApiRequest(Endpoints.GetAgent, {
			agent_id: agentId
		})) as AgentData;
	}

	async GetConversations() {
		return (await this.authenticatedApiRequest(
			Endpoints.GetConversations
		)) as Array<ConversationData>;
	}

	async GetConversation(conversationId: StringOrNumber) {
		return (await this.authenticatedApiRequest(Endpoints.GetConversation, {
			conversation_id: conversationId
		})) as ConversationData;
	}

	async NewConversation(agentId: StringOrNumber) {
		const res = await this.authenticatedApiRequest(
			Endpoints.NewConversation,
			{
				agent_id: agentId
			}
		);

		if (res.status !== 'success') {
			throw new Error('Failed to create conversation');
		}

		return res.id as number;
	}

	async NewMessage(conversationId: StringOrNumber, message: string) {
		return (await this.authenticatedApiRequest(Endpoints.NewMessage, {
			conversation_id: conversationId,
			message: message
		})) as MessageData;
	}
}
