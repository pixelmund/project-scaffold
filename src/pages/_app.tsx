import { AppProps } from 'next/app';
import { Provider } from 'urql';
import { useUrqlClient } from '~/utils/urql';
import '../styles.css';

function MyApp({ Component, pageProps }: AppProps) {
	const client = useUrqlClient(pageProps.initialClientState);

	return (
		<Provider value={client}>
			<Component {...pageProps} />
		</Provider>
	);
}

export default MyApp;
