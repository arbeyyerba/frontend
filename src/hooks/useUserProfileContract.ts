import { useMemo } from 'react';
import { RootState, useSelector } from 'src/redux/store';
import { ProfileContract } from 'src/types/profileContract';


export default function useUserProfileContract() {
  const contractState = useSelector((state: RootState)=>state.contracts);
  const contract = useMemo(()=>{
  if (contractState.userProfile) {
    return new ProfileContract(contractState.userProfile.address)
  } else {
    return undefined
  }
  }, [contractState.userProfile]);

  return contract;
}
