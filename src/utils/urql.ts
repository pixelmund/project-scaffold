import {
	createClient,
	dedupExchange,
	cacheExchange,
	fetchExchange,
	ssrExchange,
	Client,
} from '@urql/core';
import { SSRExchange } from '@urql/core/dist/types/exchanges/ssr';
import { DocumentNode } from 'graphql';
import { GetServerSidePropsContext } from 'next';
import { useMemo } from 'react';

const isServerSide = typeof window === 'undefined';

interface PreloadQueryOptions {
	query: DocumentNode;
	variables?: object;
}

export async function preloadQuery(
	context: GetServerSidePropsContext,
	options: PreloadQueryOptions,
) {
	const { client, ssr } = createUrqlClient({
		headers: context.req.headers,
	});

	await client.query(options.query, options.variables).toPromise();

	return {
		props: {
			initialClientState: ssr.extractData(),
		},
	};
}

interface ClientWithSsr {
	client: Client;
	ssr: SSRExchange;
}

let urqlClient: ClientWithSsr;

export function useUrqlClient(initialState?: Record<string, any>) {
	const { client } = useMemo(
		() => createUrqlClient({ initialState, headers: {} }),
		[initialState],
	);
	return client;
}

export function createUrqlClient({
	initialState,
	headers,
}: {
	headers: Record<string, any>;
	initialState?: Record<string, any>;
}) {
	let nextClient = urqlClient;

	if (!nextClient) {
		const ssr = ssrExchange({
			isClient: !isServerSide,
		});

		const client = createClient({
			url: !isServerSide ? '/api/graphql' : 'http://localhost:3000/api/graphql',
			fetchOptions: {
				credentials: 'include',
				headers: {
					...headers,
				},
			},
			exchanges: [dedupExchange, cacheExchange, ssr, fetchExchange],
		});

		nextClient = { ssr, client };
	}

	if (initialState) {
		nextClient.ssr.restoreData(initialState);
	}

	// For SSG and SSR always create a new Apollo Client
	if (isServerSide) return nextClient;

	// Create the Apollo Client once in the client
	if (!urqlClient) {
		urqlClient = nextClient;
	}

	return nextClient;
}
