 import useWalletAddress from './useWallet';


export default function useAccountProfile(): { address: string; } {
  const address = useWalletAddress();
  const isConnected = !!address;
  if (!isConnected) {
    throw new Error('Not connected to wallet');
  } else {
    return {
      address
    }
  }
}
