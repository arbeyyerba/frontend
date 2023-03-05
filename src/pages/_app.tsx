import { HelmetProvider } from 'react-helmet-async';
// theme
import ThemeProvider from '../theme';
// components
import { Web3Modal } from '@web3modal/react';
import { AppProps } from 'next/app';
import { store } from 'src/redux/store';


// scroll bar
import { Provider as ReduxProvider } from 'react-redux';
import 'simplebar/src/simplebar.css';

import { EthereumClient } from '@web3modal/ethereum';
import * as React from 'react';
import { chains, client } from 'src/utils/wagmi';
import { WagmiConfig } from 'wagmi';
import { LensProvider } from '@lens-protocol/react';
import {bindings as wagmiBindings} from '@lens-protocol/react';
import {localStorage} from '@lens-protocol/react/web';
import { LensConfig, staging } from '@lens-protocol/react';

const ethereumClient = new EthereumClient(client, chains)


// ----------------------------------------------------------------------

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

export default function MyApp(props: AppProps) {
  const { Component, pageProps} = props
  return (
    <HelmetProvider>
      <WagmiConfig client={client}>
        <ReduxProvider store={store}>
        <ThemeProvider>
          <LensProvider config={{
            bindings: wagmiBindings,
            environment: staging,
            storage: localStorage(),
          }}>
          <Web3Modal projectId={walletConnectProjectId} ethereumClient={ethereumClient} />
          <Component {...pageProps} />
          </LensProvider>
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
