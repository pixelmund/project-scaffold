import { builder } from '~/schema/builder';

builder.queryField('test', (t) =>
	t.string({
		resolve: () => 'Test resolver',
	}),
);

builder.queryField('lazy', (t) =>
	t.string({
		resolve: () => 'Lazy resolver',
	}),
);

builder.mutationField('testMutation', (t) =>
	t.string({
		resolve: () => 'Test resolver',
	}),
);
