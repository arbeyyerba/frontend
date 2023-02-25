import { useAccount } from 'wagmi';

export default function useWalletAddress() {
  const {isConnected, address} = useAccount();
  return address
}
