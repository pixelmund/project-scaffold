import SchemaBuilder from '@giraphql/core';
import SimpleObjectsPlugin from '@giraphql/plugin-simple-objects';
import ScopeAuthPlugin from '@giraphql/plugin-scope-auth';
import { IncomingMessage, OutgoingMessage } from 'http';

interface Context {
	req: IncomingMessage;
	res: OutgoingMessage;
}

export const builder = new SchemaBuilder<{
	Context: Context;
	Scalars: {
		ID: { Input: string; Output: string };
		Date: { Input: Date; Output: Date };
	};
	AuthScopes: {
		public: boolean;
		user: boolean;
	};
}>({
	plugins: [SimpleObjectsPlugin, ScopeAuthPlugin],
	authScopes: async ({ req, res }: Context) => ({
		public: true,
		user: false
	}),
});

// This initializes the query and mutation types so that we can add fields to them dynamically:
builder.queryType({});
builder.mutationType({});

builder.scalarType('Date', {
	serialize: (date) => date.toISOString(),
	parseValue: (date) => {
		return new Date(date);
	},
});
