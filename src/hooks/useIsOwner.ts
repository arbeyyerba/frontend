import useUserProfileContractState from "./useUserProfileContractState";
import useWalletAddress from "./useWallet";

export default function useIsOwner() {
  const profileContractState = useUserProfileContractState();
  const walletAddress = useWalletAddress();
  const isOwner = walletAddress && walletAddress.toLowerCase() == profileContractState?.ownerAddress?.toLowerCase();
  return isOwner;
}
