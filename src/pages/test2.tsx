import { preloadQuery } from '~/utils/urql';
import Test2, { query } from '~/components/Test2';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) =>
	preloadQuery(context, { query });

export default Test2;
