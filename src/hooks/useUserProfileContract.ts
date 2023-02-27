import { Contract } from 'ethers';
import { useMemo } from 'react';
import { RootState, useSelector } from 'src/redux/store';
import Profile from 'src/contracts/Profile.json';


export default function useUserProfileContract() {
  const contractState = useSelector((state: RootState)=>state.contracts);
  const contract = useMemo(()=>{
  if (contractState.userProfile) {
    return new Contract(contractState.userProfile.address, Profile.abi);
  } else {
    return undefined
  }
  }, [contractState.userProfile]);

  return contract;
}
