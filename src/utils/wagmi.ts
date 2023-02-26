import { modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { configureChains, createClient } from 'wagmi'
import { goerli, mainnet, localhost, polygonMumbai, polygon } from 'wagmi/chains'

const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
console.log(process.env);
console.log('walletConnectProjectId', walletConnectProjectId);
if (walletConnectProjectId === undefined) {
  throw new Error('Missing walletConnectProjectId');
}
const anvilLocalhost = {...localhost, id: 31337};

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygonMumbai, goerli, polygon,  ...(process.env.NODE_ENV === 'development' ? [goerli, localhost, anvilLocalhost] : [])],
  [walletConnectProvider({ projectId: walletConnectProjectId })],
)

export const client = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'My wagmi + Web3Modal App', chains }),
  provider,
  webSocketProvider,
})

export { chains }
