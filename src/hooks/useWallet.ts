import { useAccount } from 'wagmi';

export default function useWalletAddress() {
  const { address} = useAccount();
  return address
}
