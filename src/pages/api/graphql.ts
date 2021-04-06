import { schema } from '~/schema/index';
import { Context } from '~/schema/builder';
import {
	getGraphQLParameters,
	processRequest,
	renderGraphiQL,
	shouldRenderGraphiQL,
} from 'graphql-helix';
import { NextApiHandler } from 'next';
import { ExecutionResult, GraphQLError } from 'graphql';
import { IncomingHttpHeaders } from 'http';

const formatResult = (result: ExecutionResult) => {
	const formattedResult: ExecutionResult = {
		data: result.data,
	};

	if (result.errors) {
		formattedResult.errors = result.errors.map((error) => {
			console.log({ graphQLError: error.originalError });

			// Return a generic error message instead
			return new GraphQLError(
				error.message,
				error.nodes,
				error.source,
				error.positions,
				error.path,
				error.originalError,
				{
					code: (error.originalError as any)?.code,
					path: (error.originalError as any)?.path,
					...(error.originalError as any)?.extensions,
				},
			);
		});
	}

	return formattedResult;
};

interface GraphQLRequest {
	body?: any;
	headers: IncomingHttpHeaders;
	method: string;
	query: any;
}

const handler: NextApiHandler = async (req, res) => {
	try {
		const request: GraphQLRequest = {
			headers: req.headers,
			method: req.method ?? 'GET',
			query: req.query,
			body: req.body,
		};

		if (shouldRenderGraphiQL(request)) {
			res.send(renderGraphiQL({ endpoint: '/api/graphql' }));
		} else {
			const { operationName, query, variables } = getGraphQLParameters(request);

			const result = await processRequest<Context>({
				operationName,
				query,
				variables,
				request,
				schema,
				contextFactory: () => {
					return {
						req,
						res,
					};
				},
			});

			if (result.type !== 'RESPONSE') {
				throw new Error(`Unsupported response type: "${result.type}"`);
			}

			if (result.type === 'RESPONSE') {
				result.headers.forEach(({ name, value }) => res.setHeader(name, value));
				res.status(result.status);
				res.json(formatResult(result.payload));
			}
		}
	} catch (err) {
		res.statusCode = 500;
		res.end(err.toString());
	}
};

export default handler;
