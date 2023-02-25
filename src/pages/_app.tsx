import { HelmetProvider } from 'react-helmet-async';
// theme
import ThemeProvider from '../theme';
// components
import { Web3Modal } from '@web3modal/react';
import App, { AppContext, AppProps } from 'next/app';
import { store } from 'src/redux/store';
import { infuraProvider } from 'wagmi/providers/infura';
import { StyledChart } from '..//components/chart';
import ScrollToTop from '..//components/scroll-to-top';

// scroll bar
import { Provider as ReduxProvider } from 'react-redux';
import 'simplebar/src/simplebar.css';

import { EthereumClient } from '@web3modal/ethereum';
import * as React from 'react';
import { chains, client, walletConnectProjectId } from 'src/utils/wagmi';
import { WagmiConfig } from 'wagmi';

const ethereumClient = new EthereumClient(client, chains)


// ----------------------------------------------------------------------

export default function MyApp(props: AppProps) {
  const { Component, pageProps} = props
  return (
    <HelmetProvider>
      <WagmiConfig client={client}>
        <ReduxProvider store={store}>
        <ThemeProvider>
          <Web3Modal projectId={walletConnectProjectId} ethereumClient={ethereumClient} />
          <Component {...pageProps} />
        </ThemeProvider>
        </ReduxProvider>
      </WagmiConfig>
    </HelmetProvider>
  );
}

/* MyApp.getInitialProps = async (context: AppContext) => {
*   const appProps = await App.getInitialProps(context);
*
*   return {
*     ...appProps,
*   };
* }; */
