import React from 'react';
import { useQuery, gql } from 'urql';
import { IndexPageQuery } from './__generated__/IndexPageQuery';
import Link from 'next/link';
import Lazy from '../Lazy';

export const query = gql`
	query IndexPageQuery {
		test
	}
`;

export default function IndexPage() {
	const [{ data, fetching, error }] = useQuery<IndexPageQuery>({ query });

	if (fetching) return <p>Loading...</p>;
	if (error) return <p>Oh no... {error.message}</p>;

	return (
		<div>
			<div>{data?.test}</div>
			<Link href="/test2">
				<a>Go to test 2</a>
			</Link>
			<Lazy />
		</div>
	);
}
