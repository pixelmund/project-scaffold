import React from 'react';
import { useQuery, gql } from 'urql';

export default function Lazy() {
	const [{ data, fetching, error }] = useQuery({
		query: gql`
			query LazyQuery {
				lazy
			}
		`,
	});

	if (fetching) return <p>Loading...</p>;
	if (error) return <p>Oh no... {error.message}</p>;

	return <div>Lazy: {data?.lazy}</div>;
}
