import { Contract } from 'ethers';
import { useMemo } from 'react';
import { RootState, useSelector } from 'src/redux/store';
import Authorizer from 'src/contracts/Authorizer.json';


export default function useAuthorizerContracts() {
  const state = useSelector((state: RootState)=>state.contracts);
  const contract = useMemo(()=>{
    return state.authorizerAddresses.map((address: string)=>{
    return new Contract(address, Authorizer.abi);
    })
  }, [state.authorizerAddresses]);

  return contract;
}
