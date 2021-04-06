import { useQuery, gql } from 'urql';
import { IndexPage2Query } from './__generated__/IndexPage2Query';
import Link from 'next/link';
import Lazy from '../Lazy';

export const query = gql`
	query IndexPage2Query {
		test
	}
`;

export default function IndexPage2() {
	const [{ data, fetching, error }] = useQuery<IndexPage2Query>({ query });

	if (fetching) return <p>Loading...</p>;
	if (error) return <p>Oh no... {error.message}</p>;

	return (
		<div>
			<div>{data?.test}</div>
			<Link href="/">
				<a>Go to test 1</a>
			</Link>
			<Lazy />
		</div>
	);
}
