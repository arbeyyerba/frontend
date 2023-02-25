import { Contract } from 'ethers';
import { useMemo } from 'react';
import { RootState, useSelector } from 'src/redux/store';
import Profile from 'src/contracts/Profile.json';


export default function useUserProfileContract() {
  const state = useSelector((state: RootState)=>state.contracts);
  const contract = useMemo(()=>{
  if (state.userProfileContractAddress) {
    return new Contract(state.userProfileContractAddress, Profile.abi);
  } else {
    return undefined
  }
  }, [state.userProfileContractAddress]);

  return contract;
}
