import { modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { configureChains, createClient } from 'wagmi'
import { goerli, localhost, polygonMumbai, polygon } from 'wagmi/chains'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
console.log('walletConnectProjectId', walletConnectProjectId);
if (walletConnectProjectId === undefined) {
  throw new Error('Missing walletConnectProjectId');
}
const anvilLocalhost = {...localhost, id: 31337};

const { chains, provider, webSocketProvider } = configureChains(
  [goerli, polygon, polygonMumbai, ...(process.env.NODE_ENV === 'development' ? [polygonMumbai, goerli, localhost, anvilLocalhost] : [])],
  [walletConnectProvider({ projectId: walletConnectProjectId })],
)

export const client = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'Abrey', chains }),
  provider,
  webSocketProvider,
})


export { chains }
