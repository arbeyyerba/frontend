import { useMemo } from 'react';
import { RootState, useSelector } from 'src/redux/store';
import { ProfileContract } from 'src/types/profileContract';
import { useNetwork } from 'wagmi';



export default function useUserProfileContract() {
  const contractState = useSelector((state: RootState)=>state.contracts);
  const {chain} = useNetwork();
  const chainId = chain?.id.toString() || ''; 

  const contract = useMemo(()=>{
  if (contractState.userProfile && contractState.userProfile.address) {
    return new ProfileContract(contractState.userProfile.address, chainId)
  } else {
    return undefined
  }
  }, [contractState.userProfile]);

  return contract;
}
