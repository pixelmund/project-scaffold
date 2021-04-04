import { builder } from '~schema/builder';

builder.queryField('test', (t) =>
	t.string({
		resolve: () => 'Test resolver',
	}),
);

builder.mutationField('testMutation', (t) =>
	t.string({
		resolve: () => 'Test resolver',
	}),
);
