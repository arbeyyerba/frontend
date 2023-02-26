import { Contract } from 'ethers';
import { useMemo } from 'react';
import { RootState, useSelector } from 'src/redux/store';
import Profile from 'src/contracts/Profile.json';


export default function useUserProfileContract() {
  const contractState = useSelector((state: RootState)=>state.contracts);
  const contract = useMemo(()=>{
  if (contractState.userProfileContractAddress) {
    return new Contract(contractState.userProfileContractAddress, Profile.abi);
  } else {
    return undefined
  }
  }, [contractState.userProfileContractAddress]);

  return contract;
}
